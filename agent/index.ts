import { RuntimeSensitives } from './signatures'

const Oc = ObjC
const { UILabel, DispatchedReporter, NSString } = Oc.classes

function swizzle(method: any, impl: (original, args) => any) {
  const src = method.implementation
  method.implementation = Oc.implement(method, (...args) => {
    return impl(src, args)
  })
  return method.implementation
}

rpc.exports = {
  init() {
    Object.entries(RuntimeSensitives).forEach(([key, values]) => {
      const clazz = Oc.classes[key]
      if (!clazz) {
        console.log(`missing class: ${key}`)
      } else {
        // console.log(`found class: ${key}`)
        values.forEach((value) => {
          if (!clazz[value]) {
            console.log(`missing ${key}:${value}`)
          } else {
            // console.log(`got: ${key}/${value}`)
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
