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

export type Class = string

/**
 * selector format
 */
type InstanceMethod = `- ${string}`
type ClassMethod = `+ ${string}`
export type Selector = InstanceMethod | ClassMethod

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
  Class,
  Array<
    | Selector
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
 * shorthand to convert a symbol to an object with symbol & logger
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

export type NormalizedCfgValue = Array<{
  symbol: Selector
  logger: ReplaceReturn<RuntimeRecorder, Partial<RuntimeSnapshot>>
}>

/**
 * specify selector and which arguments to hook
 */
export const argumentOf = (
  clazz: Class,
  spec: `${string}@${Selector}`,
  protocol: Class
) => `${clazz}#${spec}#${protocol}`

/**
 * mark this configuration as unsafe a.k.a I dont know how to resolve the target method
 */
export const unsafe = ([f]: TemplateStringsArray) => f

/**
 * specify the message, we'll infer the only arguments
 */
export const setterOf = (clazz: Class, setter: Selector, protocol: Class) =>
  `${clazz}#${setter.replace(/^[+-]\s+|:$/g, '')}@${setter}#${protocol}`
