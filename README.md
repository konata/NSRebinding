## Build

```sh
npm run build
```

## Workflow

to continuously recompile on change, keep this running in a terminal:

```sh
$ npm run watch
```

to load a playground

```sh
$ npm run play
```

## Notes

1. method hook may be inaccurate like `+[MPMediaQuery new]` will hook at `+[NSObject new]`, we filtered those specs out by inspecting whether those
   implementations are at own definition and report dropped spec by tag `Summary`

2. receiver / args / returns can be converted from ptr to object by `new Oc.Object(self)`, while non-NativePointer & non-handler value can not be, thus we leave them as it is

3. hook information are reported by tag `Hook`

4. protocol hooks configuration can be added using helper key generator `setterOf` `argumentOf`

5. some callbacks/classes can not be found as its registered in `info.plist`, thus those should be marked as `unsafe`

6. hooks are categorized as `privacy.ts` and `network.ts`, following the apple app activity privacy report format

## TODO

[DONE] 1. solve QQMusic call `[NSData dataWithContentsOfURL]` ANR error
[DONE] 2. tree-shaking for builds
[DONE] 3. trim fat dylib to arm64 only
[DONE] 4. mrc for frida code

5. multi hook invocation for protocol instance
6. utilize `NSProxy` to handle native invoke
7. test protocol callbacks
8. post payloads to http server
9. category network hook
10. c function hook


## ISSUE
1. 
   `/System/Library/Frameworks/WebKit.framework/XPCServices/com.apple.WebKit.Networking.xpc/com.apple.WebKit.Networking` 
   `/System/Library/Frameworks/WebKit.framework/XPCServices/com.apple.WebKit.WebContent.xpc/com.apple.WebKit.WebContent`
   `/Applications/MobileSlideShow.app/PlugIns/PhotoPicker.appex/PhotoPicker`
   `/System/Library/Frameworks/ImageCaptureCore.framework/XPCServices/icprefd-xpc.xpc/icprefd-xpc`
   `/System/Library/Frameworks/ImageCaptureCore.framework/XPCServices/mscamerad-xpc.xpc/mscamerad-xpc`


     
   



