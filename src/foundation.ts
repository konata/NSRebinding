/**
 * utility type transformer to change a function return type
 */
export type ReplaceReturn<T extends (...args: any) => any, Ret> = (
  ...args: Parameters<T>
) => Ret

/**
 * remove instance / type mark of a method
 */
type Polish<M extends string> = M extends `+ ${infer R}`
  ? R
  : M extends `- ${infer T}`
  ? T
  : M

/**
 * type transformer to extract all labels of a message
 */
type ArgumentsOf<M extends string> = M extends `${infer Fst}:${infer Rst}`
  ? Fst | ArgumentsOf<Rst>
  : never

/**
 * predefined log arguments
 */
type Predefined = 'self' | 'returns' | '*'

/**
 * marks
 */
type Class = string
type Protocol = string
type Abstract = string
type Hidden = string

/**
 * selector format
 */
type InstanceMethod = `- ${string}`
type ClassMethod = `+ ${string}`
type Selector = InstanceMethod | ClassMethod

/**
 * output of a recorder function
 */
export type RuntimeSnapshot = {
  env: Record<string, string>
  signature: string // +[NSObject new]
  receiver: string // self
  selector: string // + new
  args: Array<string> // args
  returns: string
  description?: string
}

/**
 * recorder type
 */
export type RuntimeRecorder = (
  env: Record<string, string>,
  clazz: string,
  method: string,
  returns: any,
  receiver: any,
  cmd: string,
  ...params: any[]
) => RuntimeSnapshot

/**
 * specify `TrivialSignature` as value to get a normal stringify process
 * specify {name, polish} to customize your partial output, as it will merged into the normal stringify process
 */
export type RuntimeCfg = Record<
  Class | Protocol | Abstract | Hidden,
  Array<
    | Selector // just log invocation
    | {
        symbol: Selector
        logger:
          | ReplaceReturn<RuntimeRecorder, Partial<RuntimeSnapshot>> // customer logger
          | Array<string> // log corresponding parts
      }
  >
>

/**
 * message label parts or predefined parts
 */
type CallableParams<T extends string> = Array<
  ArgumentsOf<Polish<T>> | Predefined
>

/**
 * logger return type
 */
type CallableOutputs<T extends string> = {
  symbol: T
  logger: CallableParams<T>
}

/**
 * apple privacy record types, for reference only
 */
type PrivacyRecord =
  | {
      type: 'access'
      category:
        | 'camera' // @DONE
        | 'microphone' // @DONE
        | 'contacts' // @DONE
        | 'location'
        | 'mediaLibrary' // @DONE
        | 'photos' // @DONE
        | 'screenRecording' // @DONE

      kind?: string // interval begin
      timeStamp?: string
    }
  | {
      type: 'networkActivity'
      domain: string
      timestamp: string
    }

type PrivacyRecords = Array<PrivacyRecord>

/**
 *
 * @param symbol shorthand to convert a symbol to an object with symbol & logger
 * @returns
 */
export function $<T extends string>(symbol: T) {
  const callable: {
    (..._: CallableParams<T>): CallableOutputs<T>
  } & {
    [_ in 'self' | 'returns' | 'all']: CallableOutputs<T>
  } = (...logger: CallableParams<T>) => ({ symbol, logger })

  // shorthand for log self / returns / all params log
  callable.self = { symbol, logger: ['self'] }
  callable.returns = { symbol, logger: ['returns'] }
  callable.all = { symbol, logger: ['*'] }

  return callable
}

/**
 * marks
 */
export const danger = <T extends string>(src: T): T => src

/**
 *
 * @param clazz mark protocol setter
 * @param _
 * @param selector
 * @returns
 */
export const protocol = (
  _: TemplateStringsArray,
  clazz: string,
  selector: `${`+` | '-'} ${string}:`
) => `@protocol#${clazz}#${selector}`

export const decompileProtocol = (compiled: string) => {
  const [, clazz, selector] = compiled.split(/#/g)
}

// export const pr= ([clazz, selector, ]: ReadonlyArray<string>) => `${literal}`

export const abstract = ([literal]: ReadonlyArray<string>) => `#${literal}`
export const hidden = ([literal]: ReadonlyArray<string>) => `_${literal}`
export const defaults = (_: ReadonlyArray<string>) => ``