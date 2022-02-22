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

const autoreleasepool = (fn: () => void) => {
  const pool = NSAutoreleasePool.alloc().init()
  try {
    fn()
  } finally {
    pool.release()
  }
}

const dump: RuntimeLogger = (
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
          return { name: it, call: dump }
        } else {
          return {
            name: it.name,
            call: (...args: Parameters<RuntimeLogger>) => {
              return { ...dump(...args), ...it.polish(...args) }
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
          if (!clazz[value.name]) {
            console.log(`missing ${key}:${value}`)
          } else {
            swizzle(clazz[value.name], (origin, [self, cmd, ...args]) => {
              const returns = origin(self, cmd, ...args)
              autoreleasepool(() => {
                const serialized = JSON.stringify(
                  value.call(returns, self, cmd, ...args)
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
