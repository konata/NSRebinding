const Oc = ObjC

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
