import mapValues from 'lodash/mapValues'
import pickBy from 'lodash/pickBy'
import {
  at,
  Class,
  NormalizedCfgValue,
  RuntimeRecorder,
  Selector,
} from './foundation'
import { Privacies } from './privacy'
import { Network } from './network'

const Hook = 'Hook'
const Summary = 'Summary'
const Oc = ObjC
const { DispatchedReporter, NSString, NSAutoreleasePool, NSThread } = Oc.classes
const Debug = true
const configuration = { ...Privacies, ...Network }

function statistics(tag: string, payload: string) {
  if (DispatchedReporter) {
    DispatchedReporter['report:for:'](payload, tag)
  } else {
    console.log(`[${tag}]: ${payload}`)
  }
}

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

/**
 * log designated parts of the calling frame,
 *
 * @param labels user defined param keys to log
 * @param _env extra environment for calling stack,
 * @param _clazz  frame class
 * @param _method  frame method
 * @param returns  frame return value
 * @param receiver frame receiver
 * @param _selector frame selector from calling context
 * @param args frame arguments
 * @returns the log object
 */
const designated = (
  labels: string[],
  _env: Record<string, string>,
  _clazz: string,
  _method: string,
  returns: any,
  receiver: any,
  _selector: string,
  ...args: any[]
): Partial<RuntimeRecorder> => {
  const uniques = new Set(...labels)
  if (uniques.delete('*')) {
    return {
      returns: at(returns).toString(),
      receiver: at(receiver).toString(),
      args: args.map((it) => at(it).toString()),
    }
  } else {
    const messy = Object.create({})
    if (uniques.delete('returns')) {
      Object.assign(messy, { returns: at(returns).toString() })
    }
    if (uniques.delete('self')) {
      Object.assign(messy, { receiver: at(receiver).toString() })
    }

    // mapping arguments
    const declared = _method.replace(/^[-+]\s*/g, '').split(':')
    // remove the last empty group or the only leading group
    declared.pop()
    const positions = labels
      .map((it) => declared.indexOf(it))
      .filter((it) => it >= 0)
    return {
      ...messy, // returns , self
      args: positions.map((position) => at(args[position]).toString()),
    }
  }
}

/**
 * simple logger for calling frame, just log env, signature and selector,
 * for most cases this should be enough
 *
 * @param env
 * @param clazz
 * @param method
 * @param _returns
 * @param _receiver
 * @param selector
 * @param _args
 * @returns
 */
const trivial = (
  env: Record<string, string>,
  clazz: string,
  method: string,
  _returns: any,
  _receiver: any,
  selector: string,
  ..._args: any[]
): Partial<RuntimeRecorder> => {
  const signature = `[${clazz} ${method}]`
  const data = {
    env,
    signature,
    selector,
  }
  return data
}



/**
 * compile configuration to dynamic proxy object
 * 1. find the setter method call
 * 2. hook corresponding method,
 * 3. while invoking, dynamic create a proxy to delegate for designate protocol
 *   3.1 generate methods object to handle protocol message per configuration
 *   3.2 invoke configuration callbacks when protocol message received
 * 4. replace argument with generated proxy
 */
const dynamicProxy = (
  clazz: Class,
  spec: `${string}@${Selector}`,
  protocol: Class,
  messages: NormalizedCfgValue
) => {
  const [label, selector] = spec.split('@')
  const order = selector
    .replace(/[+-]\s|:$/g, '')
    .split(':')
    .indexOf(label) // -1,0,1 etc

  swizzle(clazz, selector, (origin, clazz, method, args) => {
    const params = args
    const src = args[order]
    const $proxy = new (Oc.registerProxy({
      protocols: [Oc.protocols[protocol]],
      methods: messages.reduce(
        (acc, ele) => ({
          ...acc,
          [ele.symbol](...args: any[]) {
            const returns = (this as any).data.target[ele.symbol](...args)
            const [self, , ...param] = args // calling convention -> self, cmd, ...args
            ele.logger(
              {}, // env
              protocol,
              method,
              returns,
              self,
              ele.symbol,
              ...param.map((it) => it)
            )
            return returns
          },
        }),
        {}
      ),
    }))(src)

    // replace designated param
    params[order] = $proxy
    return origin(...params)
  })
}

rpc.exports = {
  init() {
    /**
     * normalize `trivial` | `by-label-argument-record` | `fully-customization-logger` configurations to the same shape
     */
    const normalized = mapValues(configuration, (ary) =>
      ary.map((it) => {
        // `trivial` logger
        if (typeof it === 'string') {
          return { symbol: it, logger: trivial }
        } else {
          // expand `by-label-argument` array to labels of current message and log the corresponding parts, then merge with trivial version
          if (Array.isArray(it.logger)) {
            const { symbol, logger: labels } = it
            return {
              symbol,
              logger(...args: Parameters<RuntimeRecorder>) {
                return {
                  ...trivial(...args),
                  ...designated(labels, ...args),
                }
              },
            }
          } else {
            // fully customized logger callback, it's users' responsibility to log whatever they want
            const { symbol, logger } = it
            return {
              symbol,
              logger(...args: Parameters<RuntimeRecorder>) {
                return { ...trivial(...args), ...logger(...args) }
              },
            }
          }
        }
      })
    )

    /**
     * install hooks for presented classes and configured messages,
     * report `missed` classes & methods by tag [[Summary]]
     */
    const missed = Object.entries(normalized).map(([key, values]) => {
      const clazz = Oc.classes[key]
      if (!clazz) {
        console.error(`missing class: ${key}`)
        // handle protocol delegates
        if (key.split('#').length === 3) {
          const [clazz, tuples, protocol] = key.split('#')
          const [, message] = tuples.split('@')
          if (ObjC.classes[clazz]?.$ownMethods?.includes(message)) {
            dynamicProxy(clazz, tuples as any, protocol, values)
            return { [key]: [] }
          } else {
            return { [key]: [message] }
          }
        } else {
          // missing classes
          return { [key]: '*' }
        }
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
                  const currentThread = NSThread.currentThread()
                  const env = {
                    main: currentThread.isMainThread(),
                    threadName: currentThread.name().toString(),
                    pid: Process.id.toString(),
                    tid: Process.getCurrentThreadId().toString(),
                  }

                  const serialized = JSON.stringify(
                    value.logger(
                      env,
                      clazz,
                      method,
                      returns,
                      self,
                      Oc.selectorAsString(cmd),
                      // args maybe BOOL, which can not wrapped into Oc instance
                      ...args.map((it) => it)
                    )
                  )
                  // const hook = NSString['stringWithString:'](Hook)
                  // const data = NSString['stringWithString:'](serialized)
                  // DispatchedReporter['report:for:'](data, hook)
                  statistics(Hook, serialized)
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
      // const summary = NSString['stringWithString:'](Summary)
      // const data = NSString['stringWithString:'](serialized)
      // DispatchedReporter['report:for:'](summary, data)
      statistics(Summary, serialized)
    })
  },
  dispose() {},
}
