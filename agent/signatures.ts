/**
 * utility type
 */
type ReplaceReturn<T extends (...args: any) => any, Ret> = (
  ...args: Parameters<T>
) => Ret

type Class = string
type Protocol = string
type Abstract = string
type Hidden = string

/**
 * oc instance method signature
 */
type InstanceMethod = `- ${string}`

/**
 * oc class method signature
 */
type ClassMethod = `+ ${string}`

/**
 * oc method signature
 */
type Signature = InstanceMethod | ClassMethod

/**
 * log output type for each call
 */
type RuntimeRecorder = {
  signature: string
  receiver: string
  cmd: string
  args: Array<string>
  returns: string
  description?: string
}

/**
 * callback method type
 */
type RuntimeRecorderType = (
  returns: any,
  receiver: any,
  cmd: any,
  ...params: any[]
) => RuntimeRecorder

/**
 * native symbol signature
 */
type NativeModuleType = string
type NativeSymbol = string
type NativeRecorder = Omit<RuntimeRecorder, 'receiver' | 'cmd'>
type NativeRecorderType = (returns: any, ...params: any[]) => NativeRecorder

type NativeCfg = Record<
  NativeModuleType,
  Array<
    | NativeSymbol
    | {
        name: NativeSymbol
        polish: ReplaceReturn<NativeRecorderType, Partial<NativeRecorder>>
      }
  >
>

/**
 * specify `TrivialSignature` as value to get a normal stringify process
 * specify {name, polish} to customize your partial output, as it will merged into the normal stringify process
 */
type RuntimeCfg = Record<
  Class | Protocol | Abstract | Hidden,
  Array<
    | Signature
    | {
        name: Signature
        polish: ReplaceReturn<RuntimeRecorderType, Partial<RuntimeRecorder>>
      }
  >
>

const protocol = ([literal]: ReadonlyArray<string>) => `$${literal}`
const abstract = ([literal]: ReadonlyArray<string>) => `#${literal}`
const hidden = ([literal]: ReadonlyArray<string>) => `_${literal}`
const defaults = (_: ReadonlyArray<string>) => ``

export const RuntimeSensitives: RuntimeCfg = {
  UINavigationController: ['- pushViewController:animated:'],
  UIViewController: ['- presentViewController:animated:completion:'],
  UNUserNotificationCenter: [
    '- requestAuthorizationWithOptions:completionHandler:',
  ],
  AVCaptureDevice: [
    '+ authorizationStatusForMediaType:',
    '+ requestAccessForMediaType:completionHandler:',
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

const NativeSensitives: NativeCfg = {
  SystemConfiguration: [
    'CNCopySupportedInterfaces',
    'CNCopyCurrentNetworkInfo',
  ],
  [defaults``]: [
    'UIApplicationMain',
    'socket',
    'connect',
    'uname',
    'CFStreamCreatePairWithSocketToHost',
    'CCCrypt',
    'SecKeyEncrypt',
    'SecKeyDecrypt',
  ],
}