import { isString, mapValues } from 'lodash'
import { RuntimeLogger, RuntimeSensitives } from './signatures'

const Oc = ObjC
const { UILabel, DispatchedReporter, NSString, NSAutoreleasePool } = Oc.classes

/**
 * method swizzling for both oc-runtime method and native method
 * @param method method representor
 * @param impl replacer
 * @returns
 */
function swizzle(method: any, impl: (original, args) => any) {
  const src = method.implementation
  method.implementation = Oc.implement(method, (...args) => {
    return impl(src, args)
  })
  return method.implementation
}

/**
 * construct an @autoreleasepool for fn, every autorelease NSObject marked inside fn will receive an `release` message after exit this scope
 * thus toi avoid memory leak for autorelease object
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
  ret: any,
  self: any,
  cmd: any,
  ...params: any[]
) => {
  const signature = ''
  const receiver = ''
  const selector = ''
  const args = []
  const returns = ''

  return {
    signature,
    receiver,
    selector,
    args,
    returns,
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

    Object.entries(normalized).forEach(([key, values]) => {
      const clazz = Oc.classes[key]
      if (!clazz) {
        console.log(`missing class: ${key}`)
      } else {
        values.forEach((value) => {
          if (!clazz[value.symbol]) {
            console.log(`missing ${key}:${value}`)
          } else {
            swizzle(clazz[value.symbol], (origin, [self, cmd, ...args]) => {
              const returns = origin(self, cmd, ...args)
              autoreleasepool(() => {
                const serialized = JSON.stringify(
                  value.logger(returns, self, cmd, ...args)
                )
                const data = NSString['stringWithString:'](serialized)
                DispatchedReporter['report:'](data)
              })
              return returns
            })
          }
        })
      }
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
