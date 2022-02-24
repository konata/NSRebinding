import isString from 'lodash/isString'
import mapValues from 'lodash/mapValues'
import pickBy from 'lodash/pickBy'
import isArray from 'lodash/isArray'
import { configuration, RuntimeRecorder, RuntimeSnapshot } from './oc'

const Hook = 'Hook'
const Summary = 'Summary'
const Oc = ObjC
const { DispatchedReporter, NSString, NSAutoreleasePool } = Oc.classes

/**
 * method swizzling for both oc-runtime method and native method
 * @param method method representor
 * @param impl replacer
 * @returns
 */
function swizzle(
  clazz: string,
  method: string,
  impl: (
    original: (...arg: any[]) => any,
    clazz: string,
    method: string,
    args: Array<any>
  ) => any
) {
  const fn = Oc.classes[clazz][method]
  const original = fn.implementation
  fn.implementation = Oc.implement(fn, (...args) => {
    return impl(original, clazz, method, args)
  })
  return fn.implementation
}

/**
 * construct an @autoreleasepool for scope `fn`, every autorelease NSObject marked inside `fn` will receive a `release` message while scope exit
 * thus to avoid memory leak for autorelease object
 * @param fn
 */
const autoreleasepool = (fn: () => void) => {
  const pool = NSAutoreleasePool.alloc().init()
  try {
    fn()
  } finally {
    pool.release()
  }
}

const logSpec = (
  labels: string[],
  detail: Record<string, string>,
  clazz: string,
  method: string,
  returns: any,
  receiver: any,
  selector: string,
  ...args: any[]
): Partial<RuntimeRecorder> => {
  // TODO
  return '' as any
}

const logCall = (
  detail: Record<string, string>,
  clazz: string,
  method: string,
  returns: any,
  receiver: any,
  selector: string,
  ...args: any[]
): Partial<RuntimeRecorder> => {
  const signature = `[${clazz} ${method}]`
  const data = {
    detail,
    signature,
    selector,
  }
  return data
}

const $ = (raw: any) => {
  if (
    !(raw instanceof NativePointer) &&
    !(typeof raw === 'object' && raw.hasOwnProperty('handle'))
  ) {
    return raw
  } else {
    return new Oc.Object(raw)
  }
}

rpc.exports = {
  init() {
    const normalized = mapValues(configuration, (ary) =>
      ary.map((it) => {
        if (isString(it)) {
          return { symbol: it, logger: logCall }
        } else {
          if (Array.isArray(it.logger)) {
            const { symbol, logger: labels } = it
            return {
              symbol,
              logger(...args: Parameters<RuntimeRecorder>) {
                return {
                  ...logCall(...args),
                  ...logSpec(labels, ...args),
                }
              },
            }
          } else {
            const { symbol, logger } = it
            return {
              symbol,
              logger(...args: Parameters<RuntimeRecorder>) {
                return { ...logCall(...args), ...logger(...args) }
              },
            }
          }
        }
      })
    )

    const missed = Object.entries(normalized).map(([key, values]) => {
      const clazz = Oc.classes[key]
      if (!clazz) {
        console.error(`missing class: ${key}`)
        return { [key]: '*' }
      } else {
        const missed = values.map((value) => {
          // filter out all non-own methods, coz it may hook other sub classes
          if (!clazz.$ownMethods.includes(value.symbol)) {
            console.error(`missing ${key}:${JSON.stringify(value)}`)
            return value.symbol
          } else {
            const fun = Oc.classes[key][value.symbol]
            swizzle(
              key,
              value.symbol,
              (origin, clazz, method, [self, cmd, ...args]) => {
                const before = NSString['stringWithString:'](
                  `before: ${method}`
                )
                DispatchedReporter['report:for:'](Summary, before)
                const returns = origin(self, cmd, ...args)
                const after = NSString['stringWithString:'](`after: ${method}`)
                DispatchedReporter['report:for:'](Summary, after)
                autoreleasepool(() => {
                  const currentThread = Oc.classes['NSThread'].currentThread()
                  const threadName = currentThread.name().toString()
                  const main = currentThread.isMainThread()

                  const serialized = JSON.stringify(
                    value.logger(
                      {
                        main,
                        threadName,
                        pid: Process.id.toString(),
                        tid: Process.getCurrentThreadId().toString(),
                      },
                      clazz,
                      method,
                      $(returns).toString(),
                      $(self).toString(), // null
                      Oc.selectorAsString(cmd),
                      ...args.map((it) => $(it).toString()) // args maybe BOOL, which can not wrapped into Oc instance
                    )
                  )
                  const hook = NSString['stringWithString:'](Hook)
                  const data = NSString['stringWithString:'](serialized)
                  DispatchedReporter['report:for:'](data, hook)
                })
                return returns
              }
            )
            return ''
          }
        })
        return { [key]: missed.filter((it) => !it) }
      }
    })

    const picked = pickBy(missed, (it) => it.length)
    const serialized = JSON.stringify(picked)
    autoreleasepool(() => {
      const summary = NSString['stringWithString:'](Summary)
      const data = NSString['stringWithString:'](serialized)
      DispatchedReporter['report:for:'](data, summary)
    })
  },
  dispose() {},
}
