type Polish<M extends string> = M extends `+ ${infer R}`
  ? R
  : M extends `- ${infer T}`
  ? T
  : M

type ArgumentsOf<M extends string> = M extends `${infer Fst}:${infer Rst}`
  ? Fst | ArgumentsOf<Rst>
  : never

type Predefined = 'self' | 'returns'

type Class = string
type Protocol = string
type Abstract = string
type Hidden = string
type InstanceMethod = `- ${string}`
type ClassMethod = `+ ${string}`
type Selector = InstanceMethod | ClassMethod

export type RuntimeSnapshot = {
  detail: Record<string, string>
  signature: string // +[NSObject new]
  receiver: string // self
  selector: string // + new
  args: Array<string> // args
  returns: string
  description?: string
}

export type RuntimeRecorder = (
  detail: Record<string, string>,
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

function _<T extends string>(symbol: T) {
  return (...logger: Array<ArgumentsOf<Polish<T>> | Predefined>) => ({
    symbol,
    logger,
  })
}

const protocol = ([literal]: ReadonlyArray<string>) => `$${literal}`
const abstract = ([literal]: ReadonlyArray<string>) => `#${literal}`
const hidden = ([literal]: ReadonlyArray<string>) => `_${literal}`
const defaults = (_: ReadonlyArray<string>) => ``

export const configuration: RuntimeCfg = {
  UINavigationController: [
    _('- pushViewController:animated:')(
      'self',
      'pushViewController',
      'returns'
    ),
  ],
  UIViewController: ['- presentViewController:animated:completion:'],
  UNUserNotificationCenter: [
    '- requestAuthorizationWithOptions:completionHandler:',
  ],
  AVCaptureDevice: [
    _('+ authorizationStatusForMediaType:')('authorizationStatusForMediaType'),
    _('+ requestAccessForMediaType:completionHandler:')(
      'requestAccessForMediaType'
    ),
  ],
  MPMediaQuery: ['- init', '+ new'],
  MPMediaLibrary: ['+ authorizationStatus'],
  MPMediaPropertyPredicate: [
    '+ predicateWithValue:forProperty:',
    '+ predicateWithValue:forProperty:comparisonType:',
  ],
  PHPhotoLibrary: ['+ authorizationStatus', '+ requestAuthorization:'],
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

  ATTrackingManager: ['+ requestTrackingAuthorizationWithCompletionHandler:'],
  ASIdentifierManager: ['+ sharedManager', '- advertisingIdentifier'],
  CBCentralManager: ['- initWithDelegate:queue:options:'],
  HKObjectType: ['+ quantityTypeForIdentifier:'],
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
  EKEventStore: ['- requestAccessToEntityType:completion:'],
  NEHotspotNetwork: ['+ fetchCurrentWithCompletionHandler:'],
  [protocol`WKScriptMessageHandler`]: [
    '- userContentController:didReceiveScriptMessage:',
  ],
  WKWebView: [
    '- loadRequest:',
    '- loadHTMLString:baseURL:',
    '- evaluateJavaScript:completionHandler:',
  ],
  WKUserContentController: [
    '- addScriptMessageHandler:name:',
    '- addScriptMessageHandler:contentWorld:name:', // iOS 14
    '- removeScriptMessageHandlerForName:',
  ],
  [protocol`WKUIDelegate`]: [
    '- webView:runJavaScriptAlertPanelWithMessage:initiatedByFrame:completionHandler:',
    '- webView:runJavaScriptConfirmPanelWithMessage:initiatedByFrame:completionHandler:',
    '- webView:runJavaScriptTextInputPanelWithPrompt:defaultText:initiatedByFrame:completionHandler:',
  ],
  [protocol`WKNavigationDelegate`]: [
    '- webView:decidePolicyForNavigationAction:decisionHandler:',
  ],

  WKHTTPCookieStore: ['- setCookie:completionHandler:'],

  NSURL: ['+ URLWithString:'],
  NSURLRequest: ['- initWithURL:'],
  NSURLSession: [
    '+ sessionWithConfiguration:delegate:delegateQueue:',
    '- dataTaskWithRequest:completionHandler:',
    '- dataTaskWithRequest:',
  ],

  NSURLSessionDataTask: ['- resume'],

  NSURLConnection: [
    '+ sendSynchronousRequest:returningResponse:error:',
    '+ sendAsynchronousRequest:queue:completionHandler:',
  ],

  NSMutableURLRequest: [
    '- setURL:',
    '- setHTTPMethod:',
    '- setValue:forHTTPHeaderField:',
    '- addValue:forHTTPHeaderField:',
    '- setHTTPBody:',
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
  UIAlertView: [
    '- initWithTitle:message:delegate:cancelButtonTitle:otherButtonTitles:',
  ],
  UIAlertController: ['+ alertControllerWithTitle:message:preferredStyle:'],
  UIAlertAction: ['+ actionWithTitle:style:handler:'],
  NSFileManager: [
    '- createFileAtPath:contents:attributes:',
    '- createDirectoryAtPath:withIntermediateDirectories:attributes:error:',
    '- changeCurrentDirectoryPath:',
    '- copyItemAtPath:toPath:error:',
    '- removeItemAtPath:error:',
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
  HMHomeManager: ['+ new', '- registerHandler:handler:'],
}
