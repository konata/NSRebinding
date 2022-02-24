import { RuntimeSnapshot } from "./oc"


/**
 * native symbol signature
 */
type ModuleName = string
type NativeSymbol = string
type NativeInvocation = Omit<RuntimeSnapshot, 'receiver' | 'cmd'>
type NativeLogger = (returns: any, ...params: any[]) => NativeInvocation

type NativeCfg = Record<
  ModuleName,
  Array<
    | NativeSymbol
    | {
        symbol: NativeSymbol
        logger: ReplaceReturn<NativeLogger, Partial<NativeInvocation>>
      }
  >
>