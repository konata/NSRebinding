import { Class } from './foundation'

type Documentation = string
type Sel = string
type Selector = `${'+' | '-'} ${Sel}`

const Illustration: Record<Class, Record<Selector, Documentation>> = {
  NSURLSession: {
    '- dataTaskWithURL:': '设置URL发起前台网络请求',
    '- dataTaskWithURL:completionHandler:': '设置URL发起前台网络请求并设回调',
    '- dataTaskWithRequest:': '设置Request发起前台网络请求',
    '- dataTaskWithRequest:completionHandler:':
      '设置Request发起前台网络请求并设回调',
    '- downloadTaskWithURL:': '设置URL发起后台下载请求',
    '- downloadTaskWithURL:completionHandler:':
      '设置URL发起后台下载请求并设置回调',
    '- downloadTaskWithRequest:': '设置Request发起后台下载请求',
    '- downloadTaskWithRequest:completionHandler:':
      '设置Request发起后台下载请求并设置回调',
    '- uploadTaskWithRequest:fromData:': '设置Request发起后台上传请求',
    '- uploadTaskWithRequest:fromData:completionHandler:':
      '设置Request发起后台上传请求并设置回调',
    '- uploadTaskWithRequest:fromFile:': '设置Request发起后台上传文件请求',
    '- uploadTaskWithRequest:fromFile:completionHandler:':
      '设置Request发起后台上传文件请求并设置回调',
    '- uploadTaskWithStreamedRequest:': '设置Request发起后台上传Stream请求',
    '- streamTaskWithHostName:port:': '设置主机/端口发起后台Stream请求',
    '- streamTaskWithNetService:': '使用网络服务发起Stream请求',
    '- webSocketTaskWithURL:': '使用URL发起WebSocket请求',
    '- webSocketTaskWithRequest:': '使用Request发起WS请求',
    '- webSocketTaskWithURL:protocols:': '使用指定URL与协议发起WS请求',
  },
  ATTrackingManager: {
    '+ requestTrackingAuthorizationWithCompletionHandler:': '请求App跟踪授权',
    '- trackingAuthorizationStatus': '获取App跟踪授权状态',
  },
  CNContactStore: {
    '- requestAccessForEntityType:completionHandler:': '请求获取用户联系人数据',
    '+ authorizationStatusForEntityType:': '获取联系人授权状态',
    '- enumerateContactsWithFetchRequest:error:usingBlock:':
      '按条件获取联系人数据',
    '- unifiedMeContactWithKeysToFetch:error:': '获取`我的`联系人相关数据',
    '- unifiedContactWithIdentifier:keysToFetch:error:':
      '获取特定联系人详细数据',
    '- unifiedContactsMatchingPredicate:keysToFetch:error:':
      '获取特定联系人详细数据',
    '- enumeratorForContactFetchRequest:error:': '获取特定条件的所有联系人',
    '- defaultContainerIdentifier': '获取联系人默认群组',
    '- groupsMatchingPredicate:error:': '获取特定联系人群组',
    '- containersMatchingPredicate:error:': '获取特定的所有联系人群组',
    '- enumeratorForChangeHistoryFetchRequest:error:': '获取联系人记录修改历史',
    '- executeSaveRequest:error:': '添加/修改/删除联系人',
  },
  UIImagePickerController: {
    '- takePicture': '拍照',
    '- startVideoCapture': '开始录像',
    '- stopVideoCapture': '停止录像',
    '- viewWillAppear:': '选择相册内容',
  },
  PHPickerViewController: {
    '- setDelegate:': '选择多媒体相册内容',
  },
  PHPhotoLibrary: {
    '+ requestAuthorization:': '请求用户授权相册',
    '+ authorizationStatus': '获取相册授权状态',
    '+ authorizationStatusForAccessLevel:': '获取用户相册特定操作授权状态',
    '+ requestAuthorizationForAccessLevel:handler:':
      '请求用户相册的特定操作授权', // trigger authorization for access level
    '- presentLimitedLibraryPickerFromViewController:':
      '请求管理相册授权内容页面', // show manage dialog
    '- presentLimitedLibraryPickerFromViewController:completionHandler:':
      '请求管理相册授权内容页面', // show manage dialog (iOS 15)
    '- performChanges:completionHandler:': '异步修改相册内容', // change album
    '- performChangesAndWait:error:': '同步修改相册内容', // change album
  },

  PHAsset: {
    '+ fetchAssetsInAssetCollection:options:': '获取特定相册内所有数据',
    '+ fetchAssetsWithMediaType:options:': '获取相册内所有特定类型数据',
    '+ fetchAssetsWithLocalIdentifiers:options:': '获取特定相册内资源内容',
    '+ fetchKeyAssetsInAssetCollection:options:': '获取特定相册集中的关键资源',
    '+ fetchAssetsWithOptions:': '获取所有符合条件的相册数据',
    '+ fetchAssetsWithBurstIdentifier:options:': '获取特定的LivePhoto',
    '+ fetchAssetsWithALAssetURLs:options:': '使用URL获取相册特定内容',
  },

  NSItemProvider: {
    '- loadObjectOfClass:completionHandler:': '获取媒体数据',
    '- loadDataRepresentationForTypeIdentifier:completionHandler:':
      '异步获取媒体数据',
    '- loadItemForTypeIdentifier:options:completionHandler:':
      '异步获取特定类型媒体数据',
    '- loadFileRepresentationForTypeIdentifier:completionHandler:':
      '异步获取特定类型文件数据',
    '- loadInPlaceFileRepresentationForTypeIdentifier:completionHandler:':
      '获取媒体数据',
    '- loadPreviewImageWithOptions:completionHandler:': '获取媒体数据',
  },

  PHAssetCollection: {
    '+ fetchAssetCollectionsWithLocalIdentifiers:options:':
      '读取本地媒体资源库',
    '+ fetchAssetCollectionsWithType:subtype:options:': '读取媒体资源库',
    '+ fetchAssetCollectionsContainingAsset:withType:options:':
      '获取特定资源所在的所有资源库',
    '+ fetchAssetCollectionsWithALAssetGroupURLs:options:':
      '使用URL获取相册特定内容',
    '+ fetchMomentsInMomentList:options:': '获取时刻相册集',
    '+ fetchMomentsWithOptions:': '获取时刻照片',
  },

  AVCaptureDeviceInput: {
    '+ deviceInputWithDevice:error:': '开始录像',
  },
  AVCaptureDevice: {
    '+ authorizationStatusForMediaType:': '检查录像授权',
    '+ requestAccessForMediaType:completionHandler:': '请求录像授权',
  },
  AVCapturePhotoOutput: {
    '- capturePhotoWithSettings:delegate:': '拍照',
  },
  AVAudioSession: {
    '- requestRecordPermission:': '请求录音授权',
  },
  AVAudioRecorder: {
    '- record': '录音',
    '- recordAtTime:': '延迟录音',
    '- recordForDuration:': '录音',
    '- recordAtTime:forDuration:': '录音',
  },
  RPBroadcastActivityViewController: {
    '+ loadBroadcastActivityViewControllerWithHandler:': '显示录屏选择框',
    '+ loadBroadcastActivityViewControllerWithPreferredExtension:handler:':
      '显示录屏选择框',
  },
  RPBroadcastController: {
    '- startBroadcastWithHandler:': '开始录屏',
  },
  CLLocationManager: {
    '- requestWhenInUseAuthorization': '请求`使用中`地理位置授权',
    '- requestAlwaysAuthorization': '请求`始终`地址位置授权',
    '- setDelegate:': '开始获取地理位置',
    '- startUpdatingLocationWithPrompt': '获取地理位置',
    '- startUpdatingLocation': '获取地理位置以及更新',
  },
  UNUserNotificationCenter: {
    '- requestAuthorizationWithOptions:completionHandler:': '请求通知授权',
    '- addNotificationRequest:withCompletionHandler:': '发送本地通知',
    '- removePendingNotificationRequestsWithIdentifiers:': '删除未发送通知',
    '- removeAllPendingNotificationRequests': '删除所有未发送通知',
    '- getPendingNotificationRequestsWithCompletionHandler:':
      '获取所有未发送通知',
    '- getDeliveredNotificationsWithCompletionHandler:': '获取所有已发通知',
    '- removeDeliveredNotificationsWithIdentifiers:': '删除特定通知',
    '- removeAllDeliveredNotifications': '删除所有通知',
  },
}

// to generate `illustration.json`

// console.log(
//   JSON.stringify(
//     Object.fromEntries(
//       Object.entries(Illustration).flatMap(([clazz, value]) =>
//         Object.entries(value).map(([selector, illustration]) => {
//           const [sign, name] = selector.split(/\s+/g)
//           return [`${sign} [${clazz} ${name}]`, illustration]
//         })
//       )
//     ),
//     null,
//     2
//   )
// )
