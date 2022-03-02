import { partition } from 'lodash'

const Oc = ObjC

function at(src: any) {
  return new Oc.Object(src)
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

// hook for protocol delegate

// const clazz = 'CLLocationManager'
// const method = '- setDelegate:'
// const protocol = 'CLLocationManagerDelegate'

// Interceptor.attach(Oc.classes[clazz][method].implementation, {
//   onEnter(args: any) {
//     const include = [
//       '- locationManager:didUpdateLocations:',
//       '- locationManager:didUpdateToLocation:fromLocation:',
//       '- locationManager:didEnterRegion:',
//       '- locationManager:didExitRegion:',
//       '- locationManager:didDetermineState:forRegion:',
//       '- locationManager:didStartMonitoringForRegion:',
//       // '- locationManager:didRangeBeacons:satisfyingConstraint:',
//       // '- locationManager:didFailRangingBeaconsForConstraint:error:',
//       '- locationManager:didVisit:',
//     ]

//     const synthesized = include.reduce((acc, ele) => {
//       return {
//         ...acc,
//         [ele](...args: any[]) {
//           console.log(`2. call ${ele} with args:`)
//           const bar = (this as any).data.target[ele](...args)
//           // console.log(`3. return ${bar}`)
//           // return bar
//         },
//       }
//     }, {})

//     console.log(`0.93 synthesized keys: ${Object.keys(synthesized)}`)

//     const $Proxy = Oc.registerProxy({
//       protocols: [Oc.protocols[protocol]],
//       methods: synthesized,
//       events: {
//         forward(name) {
//           console.log(`?.?  forward message for ${name}`)
//         },
//       },
//     })

//     const $delegate = new $Proxy(args[3], {})
//     args[3] = $delegate
//   },
// })

/*
const root = new Set()

swizzle(
  'CLLocationManager',
  '- setDelegate:',
  (origin, clazz, method, args) => {
    const [self, cmd, delegate] = args
    const protocol = 'CLLocationManagerDelegate'
    if (Oc.protocols[protocol]?.methods) {
      const messageKeys = Object.keys(Oc.protocols[protocol]?.methods ?? {})

      const messages = [
        '- locationManager:didUpdateLocations:',
        '- locationManager:didUpdateToLocation:fromLocation:',
        '- locationManager:didEnterRegion:',
        '- locationManager:didExitRegion:',
        '- locationManager:didDetermineState:forRegion:',
        '- locationManager:didStartMonitoringForRegion:',
        '- locationManager:didRangeBeacons:satisfyingConstraint:',
        '- locationManager:didFailRangingBeaconsForConstraint:error:',
        '- locationManager:didVisit:',
      ] // .filter((it) => messageKeys.includes(it))

      const [include, missing] = partition(messages, (it) =>
        messageKeys.includes(it)
      )

      console.log(`0.9 missing messages:${missing}  include:${include}`)

      const synthesized = include.reduce((acc, ele) => {
        return {
          ...acc,
          [ele](...args: any[]) {
            console.log(`2. call ${ele} with args:`)
            const bar = (this as any).data.target[ele](...args)
            // console.log(`3. return ${bar}`)
            // return bar
          },
        }
      }, {})

      console.log(`0.93 synthesized keys: ${Object.keys(synthesized)}`)

      const $Proxy = Oc.registerProxy({
        protocols: [Oc.protocols[protocol]],
        methods: synthesized,
        events: {
          forward(name) {
            console.log(`?.?  forward message for ${name}`)
          },
        },
      })

      const $delegate = new $Proxy(delegate, {})

      root.add($Proxy)
      root.add($delegate)

      console.log(`0.95 $delegated:${$delegate}`)

      const $args = args
      $args[2] = $delegate
      console.log(
        `1. invoke set with argument src: ${delegate} proxy:${$delegate}`
      )

      return origin(self, cmd, $delegate)
    } else {
      console.log(
        `-1. can not find protocol: ${protocol} methods: ${Oc.protocols[protocol]?.methods?.keys}`
      )
      return origin(...args)
    }
  }
)


*/

const $Proxy = ObjC.registerProxy({
  protocols: [ObjC.protocols.UITableViewDelegate],
  methods: {
    ['- tableView:willSelectRowAtIndexPath:'](...args) {
      console.log(`foobar: natsuki finally`)
      return this.data.target['- tableView:willSelectRowAtIndexPath:'](...args)
    },

    // '- URLSession:didBecomeInvalidWithError:': function (...args: any[]) {
    //   /* fancy logging code here */
    //   /* this.data.foo === 1234 */
    //   console.log(`@@@ natsuki 2:didReceiveResponse`)
    //   this.data.target['- URLSession:didBecomeInvalidWithError:'](...args)
    // },
    // '- URLSessionDidFinishEventsForBackgroundURLSession:': function (...args) {
    //   /* other logging code here */
    //   console.log(`@@@ natsuki 2:didReceiveData`)
    //   this.data.target['- URLSessionDidFinishEventsForBackgroundURLSession:'](
    //     ...args
    //   )
    // },
  },
  events: {
    forward(name) {
      console.log('*** forwarding: ' + name)
    },
  },
})

const method = ObjC.classes.UITableView['- setDelegate:']

Interceptor.attach(method.implementation, {
  onEnter(args: any) {
    if (args[2] != ptr(0x0)) {
      console.log(`natsuki: 1 args:`, args[2])
      args[2] = new $Proxy(args[2])
    }
  },
})

console.log(`0. start hook`)
