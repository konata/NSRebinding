/**
 * zip the shortest path
 * @param fst
 * @param snd
 * @returns
 */
function zip<A, B>(fst: Array<A>, snd: Array<B>) {
  const size = Math.min(fst.length, snd.length)
  return [...Array(size).keys()].map((idx) => [fst[idx], snd[idx]])
}

function mapValues<T, S>(value: Record<string, T>, fn: (T) => S) {
  return Object.keys(value).reduce(
    (acc, ele) => ({ ...acc, [ele]: fn(value[ele]) }),
    Object.create({}) as Record<string, S>
  )
}
function pickBy<T>(src: Record<string, T>, fn: (T) => boolean) {
  Object.keys(src).reduce(
    (acc, ele) => (fn(src[ele]) ? { ...acc, [ele]: src[ele] } : { ...acc }),
    {} as Record<string, T>
  )
}

export { zip, mapValues, pickBy }
