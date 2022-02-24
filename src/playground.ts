const Oc = ObjC

// Interceptor.attach(fn.implementation, {
//   onEnter(args) {
//     const [self, cmd, p1, p2] = args
//     console.log(`self: ${self} cmd:${cmd}`)

//     console.log(`self: ${new Oc.Object(self)} cmd: ${Oc.selectorAsString(cmd)}`)
//     console.log(`p1:${p1}  p2:${p2}`)
//     console.log(`p1:${new Oc.Object(p1)}  p2:${new Oc.Object(p2)}`)
//   },
//   onLeave(value) {
//     console.log(value)
//   },
// })

function of(src: any) {
  return new Oc.Object(src)
}
const fn = Oc.classes['MPMediaQuery']['+ new']
const src = fn.implementation
fn.implementation = Oc.implement(fn, (self, cmd, ...args) => {
  const bar = src(self, cmd, ...args)
  console.log(
    `self-className: ${of(self).$className}, cmd:${Oc.selectorAsString(
      cmd
    )} args:${args.map((it) => of(it))} ret:${bar}`
  )
  return bar
})

console.log(`playground initialized`)

// try {
//   console.log(
//     `self: ${of(self)}, cmd:${of(cmd)} args:${args.map((it) =>
//       of(it)
//     )} ret:${of(bar)}`
//   )
// } catch (e) {
//   console.log(`convert failed`)
// }

// console.log(
//   `*** self:${self} cmd:${Oc.selectorAsString(cmd)} args:${args.map(
//     (it) => it
//   )}`
// )

// console.log(`returns: ${bar} `)
// console.log(`returns oc: ${new Oc.Object(bar)} `)
