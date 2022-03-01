import { protocol, RuntimeCfg } from './foundation'

export const privacies: RuntimeCfg = {
  /**
   * category: [[contacts]]
   * todo: hook callback for Notification `CNContactStoreDidChangeNotification` can be triggered
   */
  CNContactStore: [
    '- requestAccessForEntityType:completionHandler:',
    '+ authorizationStatusForEntityType:',
    '- enumerateContactsWithFetchRequest:error:usingBlock:',
    '- unifiedMeContactWithKeysToFetch:error:',
    '- unifiedContactWithIdentifier:keysToFetch:error:',
    '- unifiedContactsMatchingPredicate:keysToFetch:error:',
    '- enumeratorForContactFetchRequest:error:',
    '- defaultContainerIdentifier',
    '- groupsMatchingPredicate:error:',
    '- containersMatchingPredicate:error:',
    '- enumeratorForChangeHistoryFetchRequest:error:',
    '- executeSaveRequest:error:',
  ],

  /**
   * category: [[mediaLibrary]]
   * ref: [[https://developer.apple.com/documentation/photokit/selecting_photos_and_videos_in_ios?language=objc]]
   *
   * no permission required, we deal the delegates
   * since iOS11 UIImagePickerController runs in a separated process for just read-only access
   */
  UIImagePickerController: [], //
  [protocol`UIImagePickerControllerDelegate`]: [
    '- imagePickerController:didFinishPickingMediaWithInfo:', // actually read image or photo
    '- imagePickerController:didFinishPickingImage:editingInfo:', // actually read image or photo
  ],

  /**
   * category: [[mediaLibrary]]
   * ref: [[https://developer.apple.com/videos/play/wwdc2020/10652/]]
   *
   * no permission required, limited collections of albums & photos Since iOS 14, system host it in a separated process
   */
  PHPickerViewController: [],
  [protocol`PHPickerViewControllerDelegate`]: ['- picker:didFinishPicking:'], // actually read meta data

  /**
   * category: [[mediaLibrary]]
   */
  PHPhotoLibrary: [
    '+ requestAuthorization:',
    '+ authorizationStatus',
    '+ authorizationStatusForAccessLevel:', // get authorize state
    '+ requestAuthorizationForAccessLevel:handler:', // trigger authorization for access level
    '- presentLimitedLibraryPicker', // show manage dialog
    '- presentLimitedLibraryPickerFromViewController:', // show manage dialog
    '- presentLimitedLibraryPickerFromViewController:completionHandler:', // show manage dialog
    '- performChanges:completionHandler:', // change album
    '- performChangesAndWait:error:', // change album
  ],

  /**
   * category: [[mediaLibrary]]
   *
   * everything about meta-data not underline image/videos, fetch needs permission if
   */
  PHAsset: [
    '+ fetchAssetsInAssetCollection:options:', // fetch
    '+ fetchAssetsWithMediaType:options:', // fetch
    '+ fetchAssetsWithLocalIdentifiers:options:', // fetch
    '+ fetchKeyAssetsInAssetCollection:options:', // fetch
    '+ fetchAssetsWithOptions:', // fetch
    '+ fetchAssetsWithBurstIdentifier:options:', // fetch
    '+ fetchAssetsWithALAssetURLs:options:', // fetch
  ],

  /**
   * category: [[mediaLibrary]]
   *
   * ref: [[https://developer.apple.com/documentation/foundation/nsitemprovider]]
   */
  NSItemProvider: [
    '- loadObjectOfClass:completionHandler:', // callbacks
    '- loadDataRepresentationForTypeIdentifier:completionHandler:', // load data
    '- loadItemForTypeIdentifier:options:completionHandler:', // load data
    '- loadFileRepresentationForTypeIdentifier:completionHandler:',
    '- loadInPlaceFileRepresentationForTypeIdentifier:completionHandler:',
    '- loadPreviewImageWithOptions:completionHandler:',
  ],

  /**
   * category: [[mediaLibrary]]
   *
   * ref: [[https://developer.apple.com/documentation/photokit/phassetcollection]]
   */
  PHAssetCollection: [
    '+ fetchAssetCollectionsWithLocalIdentifiers:options:',
    '+ fetchAssetCollectionsWithType:subtype:options:',
    '+ fetchAssetCollectionsContainingAsset:withType:options:',
    '+ fetchAssetCollectionsWithALAssetGroupURLs:options:',
    '+ fetchMomentsInMomentList:options:',
    '+ fetchMomentsWithOptions:',
  ],

  /**
   * category: [[camera]]
   */
  AVCaptureDeviceInput: [
    '+ authorizationStatusForMediaType:',
    '+ deviceInputWithDevice:error:',
    '+ requestAccessForMediaType:completionHandler:',
  ],
  AVCapturePhotoOutput: ['- capturePhotoWithSettings:delegate:'],
  AVCaptureDevice: [
    '+ authorizationStatusForMediaType:',
    '+ requestAccessForMediaType:completionHandler:',
  ],

  /**
   * category: [[microphone]]
   */
  AVAudioSession: ['- requestRecordPermission:'],
  AVAudioRecorder: [
    '- record',
    '- recordAtTime:',
    '- recordForDuration:',
    '- recordAtTime:forDuration:',
  ],

  /**
   * category: [[screenRecord]]
   * ref: [[https://devstreaming-cdn.apple.com/videos/wwdc/2018/601nz4m863hyf0/601/601_live_screen_broadcast_with_replaykit.pdf?dl=1]]
   */
  RPBroadcastActivityViewController: [
    '+ loadBroadcastActivityViewControllerWithHandler:', // show list of recording extension
    '+ loadBroadcastActivityViewControllerWithPreferredExtension:handler:', // show specific recording extension
  ],
  RPBroadcastController: [
    '- startBroadcastWithHandler:', // manually start broadcast, for #iOS(<=10)
  ],
  [protocol`RPBroadcastSampleHandler`]: [
    '- broadcastStartedWithSetupInfo:', // automatically start broadcast notification for #iOS(>10)
  ],

  /**
   * category: [[location]]
   *
   * ref: [[https://developer.apple.com/documentation/corelocation/getting_the_user_s_location]]
   */
  CLLocationManager: [
    '- requestWhenInUseAuthorization',
    '- requestAlwaysAuthorization',
  ],
  [protocol`CLLocationManagerDelegate`]: [
    '- locationManager:didUpdateLocations:',
    '- locationManager:didUpdateToLocation:fromLocation:',
    '- locationManager:didEnterRegion:',
    '- locationManager:didExitRegion:',
    '- locationManager:didDetermineState:forRegion:',
    '- locationManager:didStartMonitoringForRegion:',
    '- locationManager:didRangeBeacons:satisfyingConstraint:',
    '- locationManager:didFailRangingBeaconsForConstraint:error:',
    '- locationManager:didVisit:',
  ],

  /**
   * category: [[Notification]]
   *
   */
  UNUserNotificationCenter: [
    '- requestAuthorizationWithOptions:completionHandler:',
    '- addNotificationRequest:withCompletionHandler:',
    '- removePendingNotificationRequestsWithIdentifiers:',
    '- removeAllPendingNotificationRequests',
    '- getPendingNotificationRequestsWithCompletionHandler:',
    '- getDeliveredNotificationsWithCompletionHandler:',
    '- removeDeliveredNotificationsWithIdentifiers:',
    '- removeAllDeliveredNotifications',
  ],
}

export const network: RuntimeCfg = {}
