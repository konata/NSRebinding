import { danger, protocol, RuntimeCfg, $ } from './foundation'

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
    $('+ authorizationStatusForMediaType:')('authorizationStatusForMediaType'),
    $('+ requestAccessForMediaType:completionHandler:')(
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
    $('- loadRequest:')('loadRequest'),
    $('- loadHTMLString:baseURL:')('loadHTMLString', 'baseURL'),
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
  ],
  HMHomeManager: ['- setDelegate:'],
}
