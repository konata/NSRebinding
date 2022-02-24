/**
 * utility type
 */
 type ReplaceReturn<T extends (...args: any) => any, Ret> = (
    ...args: Parameters<T>
  ) => Ret
  