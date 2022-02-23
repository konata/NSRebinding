import { filter, isString, mapValues, omit, omitBy, pick, pickBy } from 'lodash'
import { RuntimeLogger, RuntimeSensitives } from './signatures'

const Oc = ObjC
const { DispatchedReporter, NSString, NSAutoreleasePool } = Oc.classes

const Hook = 'Hook'
const Summary = 'Summary'

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

const trace: RuntimeLogger = (
  clazz: string,
  method: string,
  returns: any,
  receiver: any,
  selector: string,
  ...args: any[]
) => {
  const signature = `[${clazz} ${method}]`
  const data = {
    signature,
    receiver,
    selector,
    args,
    returns,
  }
  return data
}

const repr = (who: any) => {
  if (
    !(who instanceof NativePointer) &&
    !(typeof who === 'object' && who.hasOwnProperty('handle'))
  ) {
    return `${who}`
  } else {
    return `${new Oc.Object(who)}`
  }
}

rpc.exports = {
  init() {
    const normalized = mapValues(RuntimeSensitives, (ary) =>
      ary.map((it) => {
        if (isString(it)) {
          return { symbol: it, logger: trace }
        } else {
          return {
            symbol: it.symbol,
            logger(...args: Parameters<RuntimeLogger>) {
              return { ...trace(...args), ...it.logger(...args) }
            },
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
                const returns = origin(self, cmd, ...args)
                autoreleasepool(() => {
                  const serialized = JSON.stringify(
                    value.logger(
                      clazz,
                      method,
                      repr(returns),
                      repr(self), // null
                      Oc.selectorAsString(cmd),
                      ...args.map((it) => repr(it)) // args maybe BOOL, which can not wrapped into Oc instance
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

    /*
    swizzle(UILabel['- setText:'], (original, [self, cmd, ...params]) => {
      const type = new Oc.Object(self)['$class'].toString()
      const selector = Oc.selectorAsString(cmd)
      const args = params.map((it) => {
        const description = new Oc.Object(it).toString()
        console.log(`description: ${description}`)
        return description
      })
      const json = JSON.stringify({ type, selector, args })
      const data = NSString['stringWithString:'](json)
      DispatchedReporter['report:'](data)
      return original(self, cmd, ...params)
    })
    */
  },
  dispose() {},
}
