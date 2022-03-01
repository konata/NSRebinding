import { RuntimeSnapshot as Snapshot, ReplaceReturn } from './foundation'

/**
 * native symbol signature
 */
type ModuleName = string
type NativeSymbol = string
type NativeInvocation = Omit<Snapshot, 'receiver' | 'cmd'>
type NativeLogger = (returns: any, ...params: any[]) => NativeInvocation

export type NativeCfg = Record<
  ModuleName,
  Array<
    | NativeSymbol
    | {
        symbol: NativeSymbol
        logger: ReplaceReturn<NativeLogger, Partial<NativeInvocation>>
      }
  >
>
