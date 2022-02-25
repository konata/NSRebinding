type Polish<M extends string> = M extends `+ ${infer R}`
  ? R
  : M extends `- ${infer T}`
  ? T
  : M

type ArgumentsOf<M extends string> = M extends `${infer Fst}:${infer Rst}`
  ? Fst | ArgumentsOf<Rst>
  : never

type Predefined = 'self' | 'returns' | '*'

type Class = string
type Protocol = string
type Abstract = string
type Hidden = string
type InstanceMethod = `- ${string}`
type ClassMethod = `+ ${string}`
type Selector = InstanceMethod | ClassMethod

export type RuntimeSnapshot = {
  env: Record<string, string>
  signature: string // +[NSObject new]
  receiver: string // self
  selector: string // + new
  args: Array<string> // args
  returns: string
  description?: string
}

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
type RuntimeCfg = Record<
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

type CallableParams<T extends string> = Array<
  ArgumentsOf<Polish<T>> | Predefined
>
type CallableOutputs<T extends string> = {
  symbol: T
  logger: CallableParams<T>
}

function _<T extends string>(symbol: T) {
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

const danger = <T extends string>(src: T): T => src
const protocol = ([literal]: ReadonlyArray<string>) => `$${literal}`
const abstract = ([literal]: ReadonlyArray<string>) => `#${literal}`
const hidden = ([literal]: ReadonlyArray<string>) => `_${literal}`
const defaults = (_: ReadonlyArray<string>) => ``

export const configuration: RuntimeCfg = {
  CNContactStore: ['- requestAccessForEntityType:completionHandler:'],
  CLLocationManager: [
    '+ locationServicesEnabled',
    '- requestWhenInUseAuthorization',
    '- requestAlwaysAuthorization',
    '- requestTemporaryFullAccuracyAuthorizationWithPurposeKey:completion:',
    '- startUpdatingLocation',
    '- stopUpdatingLocation',
    '- requestLocation',
  ],
  AVCaptureDevice: [
    _('+ authorizationStatusForMediaType:')('authorizationStatusForMediaType'),
    _('+ requestAccessForMediaType:completionHandler:')(
      'requestAccessForMediaType'
    ),
  ],
  PHPhotoLibrary: ['+ authorizationStatus', '+ requestAuthorization:'],
  CBCentralManager: ['- initWithDelegate:queue:options:'],
  ATTrackingManager: ['+ requestTrackingAuthorizationWithCompletionHandler:'],
  ASIdentifierManager: ['+ sharedManager', '- advertisingIdentifier'],
  HKObjectType: ['+ quantityTypeForIdentifier:'],
  EKEventStore: ['- requestAccessToEntityType:completion:'],
  NEHotspotNetwork: ['+ fetchCurrentWithCompletionHandler:'],
  WKWebView: [
    _('- loadRequest:')('loadRequest'),
    _('- loadHTMLString:baseURL:')('loadHTMLString', 'baseURL'),
    '- evaluateJavaScript:completionHandler:',
  ],
  WKUserContentController: [
    '- addScriptMessageHandler:name:',
    '- addScriptMessageHandler:contentWorld:name:', // iOS 14
    '- removeScriptMessageHandlerForName:',
  ],
  [protocol`WKScriptMessageHandler`]: [
    '- userContentController:didReceiveScriptMessage:',
  ],
  WKHTTPCookieStore: ['- setCookie:completionHandler:'],
  NSURL: ['+ URLWithString:'],
  NSURLRequest: ['- initWithURL:'],
  NSURLSession: [
    '+ sessionWithConfiguration:delegate:delegateQueue:',
    '- dataTaskWithRequest:completionHandler:',
    '- dataTaskWithRequest:',
  ],
  NSMutableURLRequest: [
    '- setURL:',
    '- setHTTPMethod:',
    '- setValue:forHTTPHeaderField:',
    '- addValue:forHTTPHeaderField:',
    '- setHTTPBody:',
  ],
  NSFileManager: [
    '- createFileAtPath:contents:attributes:',
    danger(
      '- createDirectoryAtPath:withIntermediateDirectories:attributes:error:'
    ),
    '- changeCurrentDirectoryPath:',
    '- copyItemAtPath:toPath:error:',
    danger('- removeItemAtPath:error:'),
  ],

  UNUserNotificationCenter: [
    '- requestAuthorizationWithOptions:completionHandler:',
  ],

  /**
   * below unmarked by doc
   */

  MPMediaQuery: ['- init', '+ new'], // items, collections
  MPMediaLibrary: ['+ authorizationStatus'],
  MPMediaPropertyPredicate: [
    '+ predicateWithValue:forProperty:',
    '+ predicateWithValue:forProperty:comparisonType:',
  ],

  HKHealthStore: [
    '- requestAuthorizationToShareTypes:readTypes:completion:',
    '- executeQuery:',
  ],
  HKStatisticsQuery: [
    '- initWithQuantityType:quantitySamplePredicate:options:completionHandler:',
  ],
  HKSampleQuery: [
    '- initWithSampleType:predicate:limit:sortDescriptors:resultsHandler:',
  ],
  CMMotionActivityManager: [
    '+ authorizationStatus',
    '- queryActivityStartingFromDate:toDate:toQueue:withHandler:',
    '- startActivityUpdatesToQueue:withHandler:',
  ],
  [protocol`WKUIDelegate`]: [
    '- webView:runJavaScriptAlertPanelWithMessage:initiatedByFrame:completionHandler:',
    '- webView:runJavaScriptConfirmPanelWithMessage:initiatedByFrame:completionHandler:',
    '- webView:runJavaScriptTextInputPanelWithPrompt:defaultText:initiatedByFrame:completionHandler:',
  ],
  [protocol`WKNavigationDelegate`]: [
    '- webView:decidePolicyForNavigationAction:decisionHandler:',
  ],

  NSURLSessionDataTask: ['- resume'],

  NSURLConnection: [
    danger('+ sendSynchronousRequest:returningResponse:error:'),
    '+ sendAsynchronousRequest:queue:completionHandler:',
  ],

  [protocol`UIApplicationDelegate`]: [
    '- application:handleOpenURL:',
    '- application:openURL:sourceApplication:annotation:',
    '- application:openURL:options:',
  ],

  UIApplication: [
    '- canOpenURL:',
    '- openURL:',
    '- openURL:options:completionHandler:',
  ],
  LAContext: [
    '- canEvaluatePolicy:error:',
    '- evaluatePolicy:localizedReason:reply:',
  ],
  SFSpeechRecognizer: [
    '+ requestAuthorization:',
    '- recognitionTaskWithRequest:resultHandler:',
  ],
  AVAudioEngine: ['- startAndReturnError:', '- stop'],
  SFSpeechAudioBufferRecognitionRequest: ['- endAudio'],
  NFCNDEFReaderSession: [
    '- initWithDelegate:queue:invalidateAfterFirstRead:',
    '- beginSession',
    '- invalidateSession',
  ],
  HMHomeManager: ['- setDelegate:'],
}
