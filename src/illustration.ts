import { Class } from './foundation'

type Documentation = string

const Illustration: Record<Class, Record<Selector, Documentation>> = {
  NSURLSession: {
    '- dataTaskWithURL:': '',
    '- dataTaskWithURL:completionHandler:': '',
    '- dataTaskWithRequest:': '',
    '- dataTaskWithRequest:completionHandler:': '',
    '- downloadTaskWithURL:': '',
    '- downloadTaskWithURL:completionHandler:': '',
    '- downloadTaskWithRequest:': '',
    '- downloadTaskWithRequest:completionHandler:': '',
    '- uploadTaskWithRequest:fromData:': '',
    '- uploadTaskWithRequest:fromData:completionHandler:': '',
    '- uploadTaskWithRequest:fromFile:': '',
    '- uploadTaskWithRequest:fromFile:completionHandler:': '',
    '- uploadTaskWithStreamedRequest:': '',
    '- streamTaskWithHostName:port:': '',
    '- streamTaskWithNetService:': '',
    '- webSocketTaskWithURL:': '',
    '- webSocketTaskWithRequest:': '',
    '- webSocketTaskWithURL:protocols:': '',
  },
  ATTrackingManager: {
    '+ requestTrackingAuthorizationWithCompletionHandler:': '',
    '- trackingAuthorizationStatus': '',
  },
  CNContactStore: {
    '- requestAccessForEntityType:completionHandler:': '',
    '+ authorizationStatusForEntityType:': '',
    '- enumerateContactsWithFetchRequest:error:usingBlock:': '',
    '- unifiedMeContactWithKeysToFetch:error:': '',
    '- unifiedContactWithIdentifier:keysToFetch:error:': '',
    '- unifiedContactsMatchingPredicate:keysToFetch:error:': '',
    '- enumeratorForContactFetchRequest:error:': '',
    '- defaultContainerIdentifier': '',
    '- groupsMatchingPredicate:error:': '',
    '- containersMatchingPredicate:error:': '',
    '- enumeratorForChangeHistoryFetchRequest:error:': '',
    '- executeSaveRequest:error:': '',
  },
  UIImagePickerController: {
    '- takePicture': '',
    '- startVideoCapture': '',
    '- stopVideoCapture': '',
    '- viewWillAppear:': '',
  },
  PHPickerViewController: {
    '- setDelegate:': '',
  },
  PHPhotoLibrary: {
    '+ requestAuthorization:': '',
    '+ authorizationStatus': '',
    '+ authorizationStatusForAccessLevel:': '',
    '+ requestAuthorizationForAccessLevel:handler:': '', // trigger authorization for access level
    '- presentLimitedLibraryPickerFromViewController:': '', // show manage dialog
    '- presentLimitedLibraryPickerFromViewController:completionHandler:': '', // show manage dialog (iOS 15)
    '- performChanges:completionHandler:': '', // change album
    '- performChangesAndWait:error:': '', // change album
  },

  PHAsset: {
    '+ fetchAssetsInAssetCollection:options:': '',
    '+ fetchAssetsWithMediaType:options:': '',
    '+ fetchAssetsWithLocalIdentifiers:options:': '',
    '+ fetchKeyAssetsInAssetCollection:options:': '',
    '+ fetchAssetsWithOptions:': '',
    '+ fetchAssetsWithBurstIdentifier:options:': '',
    '+ fetchAssetsWithALAssetURLs:options:': '',
  },

  NSItemProvider: {
    '- loadObjectOfClass:completionHandler:': '',
    '- loadDataRepresentationForTypeIdentifier:completionHandler:': '',
    '- loadItemForTypeIdentifier:options:completionHandler:': '',
    '- loadFileRepresentationForTypeIdentifier:completionHandler:': '',
    '- loadInPlaceFileRepresentationForTypeIdentifier:completionHandler:': '',
    '- loadPreviewImageWithOptions:completionHandler:': '',
  },

  PHAssetCollection: {
    '+ fetchAssetCollectionsWithLocalIdentifiers:options:': '',
    '+ fetchAssetCollectionsWithType:subtype:options:': '',
    '+ fetchAssetCollectionsContainingAsset:withType:options:': '',
    '+ fetchAssetCollectionsWithALAssetGroupURLs:options:': '',
    '+ fetchMomentsInMomentList:options:': '',
    '+ fetchMomentsWithOptions:': '',
  },

  AVCaptureDeviceInput: {
    '+ deviceInputWithDevice:error:': '',
  },
  AVCaptureDevice: {
    '+ authorizationStatusForMediaType:': '',
    '+ requestAccessForMediaType:completionHandler:': '',
  },
  AVCapturePhotoOutput: {
    '- capturePhotoWithSettings:delegate:': '',
  },
  AVAudioSession: {
    '- requestRecordPermission:': '',
  },
  AVAudioRecorder: {
    '- record': '',
    '- recordAtTime:': '',
    '- recordForDuration:': '',
    '- recordAtTime:forDuration:': '',
  },
  RPBroadcastActivityViewController: {
    '+ loadBroadcastActivityViewControllerWithHandler:': '',
    '+ loadBroadcastActivityViewControllerWithPreferredExtension:handler:': '',
  },
  RPBroadcastController: {
    '- startBroadcastWithHandler:': '',
  },
  CLLocationManager: {
    '- requestWhenInUseAuthorization': '',
    '- requestAlwaysAuthorization': '',
    '- setDelegate:': '',
    '- startUpdatingLocationWithPrompt': '',
    '- startUpdatingLocation': '',
  },
  UNUserNotificationCenter: {
    '- requestAuthorizationWithOptions:completionHandler:': '',
    '- addNotificationRequest:withCompletionHandler:': '',
    '- removePendingNotificationRequestsWithIdentifiers:': '',
    '- removeAllPendingNotificationRequests': '',
    '- getPendingNotificationRequestsWithCompletionHandler:': '',
    '- getDeliveredNotificationsWithCompletionHandler:': '',
    '- removeDeliveredNotificationsWithIdentifiers:': '',
    '- removeAllDeliveredNotifications': '',
  },
}
