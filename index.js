(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.at = exports.setterOf = exports.unsafe = exports.argumentOf = exports.danger = exports.inlay = exports.backtrace = exports.positional = exports.ToString = void 0;
var underscore_1 = require("./underscore");
exports.ToString = {
    NSURLRequest: function (request) {
        var req = exports.at(request);
        return "method: " + req.HTTPMethod() + ", url: " + exports.ToString.NSURL(req.URL());
    },
    NSURL: function (url) {
        return "" + exports.at(url);
    },
    NSNetService: function (service) {
        var $service = exports.at(service);
        return "name: " + service.name + " type:" + service.type + " domain:" + service.domain;
    },
    NSArray: function (ary) {
        var $ary = exports.at(ary);
        return "" + $ary;
    },
};
/**
 *
 * @param message shorthand for positional argument recorder
 * @returns
 */
function positional(message) {
    return function () {
        var fn = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fn[_i] = arguments[_i];
        }
        return ({
            symbol: message,
            logger: function () {
                var verbose = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    verbose[_i] = arguments[_i];
                }
                var _a = __read(verbose), rst = _a.slice(6);
                return {
                    args: underscore_1.zip(rst, fn).map(function (_a) {
                        var _b;
                        var _c = __read(_a, 2), rst = _c[0], fn = _c[1];
                        return (_b = fn === null || fn === void 0 ? void 0 : fn(rst)) !== null && _b !== void 0 ? _b : '';
                    }),
                };
            },
        });
    };
}
exports.positional = positional;
/**
 *
 * @param context generate backtrace for current call
 */
function backtrace(context) {
    return Thread.backtrace(context, Backtracer.ACCURATE).map(function (it) { return DebugSymbol.fromAddress(it).name; });
}
exports.backtrace = backtrace;
/**
 * shorthand to convert a symbol to an object with symbol & logger
 */
function inlay(symbol) {
    var callable = function () {
        var logger = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            logger[_i] = arguments[_i];
        }
        return ({ symbol: symbol, logger: logger });
    };
    // shorthand for log self / returns / all params log
    callable.self = { symbol: symbol, logger: ['self'] };
    callable.returns = { symbol: symbol, logger: ['returns'] };
    callable.all = { symbol: symbol, logger: ['*'] };
    return callable;
}
exports.inlay = inlay;
/**
 * marks
 */
var danger = function (src) { return src; };
exports.danger = danger;
/**
 * specify selector and which arguments to hook
 */
var argumentOf = function (clazz, spec, protocol) { return clazz + "#" + spec + "#" + protocol; };
exports.argumentOf = argumentOf;
/**
 * mark this configuration as unsafe a.k.a I dont know how to resolve the target method
 */
var unsafe = function (_a) {
    var _b = __read(_a, 1), f = _b[0];
    return f;
};
exports.unsafe = unsafe;
/**
 * specify the message, we'll infer the only arguments
 */
var setterOf = function (clazz, setter, protocol) {
    return clazz + "#" + setter.replace(/^[+-]\s+|:$/g, '') + "@" + setter + "#" + protocol;
};
exports.setterOf = setterOf;
var Oc = ObjC;
/**
 * like Oc `@` symbol, construct an oc object from js handler
 * @param raw the raw js handler
 * @returns
 */
var at = function (raw) {
    if (!(raw instanceof NativePointer) &&
        !(typeof raw === 'object' && raw.hasOwnProperty('handle'))) {
        return raw;
    }
    else {
        return new Oc.Object(raw);
    }
};
exports.at = at;

},{"./underscore":5}],2:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var foundation_1 = require("./foundation");
var privacy_1 = require("./privacy");
var network_1 = require("./network");
var underscore_1 = require("./underscore");
var Hook = 'Hook';
var Summary = 'Summary';
var Oc = ObjC;
var _a = Oc.classes, DispatchedReporter = _a.DispatchedReporter, NSString = _a.NSString, NSAutoreleasePool = _a.NSAutoreleasePool, NSThread = _a.NSThread;
var Debug = true;
var configuration = __assign(__assign({}, privacy_1.Privacies), network_1.Network);
var nil = '';
function statistics(tag, payload) {
    if (DispatchedReporter) {
        DispatchedReporter['report:for:'](payload, tag);
    }
    else {
        console.log("[" + tag + "]: " + payload);
    }
}
/**
 * method swizzling for both oc-runtime method and native method
 * @param method method representor
 * @param impl replacer
 * @returns
 */
function swizzle(clazz, method, impl) {
    var fn = Oc.classes[clazz][method];
    var original = fn.implementation;
    fn.implementation = Oc.implement(fn, function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return impl(original, clazz, method, args);
    });
    return fn.implementation;
}
/**
 * rebinding implementations,
 * you can employ this function for cases
 * do not need return value but backtrace
 *
 *
 *
 */
function rebinding(clazz, method, impl) {
    var _a, _b;
    if ((_b = (_a = Oc.classes[clazz]) === null || _a === void 0 ? void 0 : _a[method]) === null || _b === void 0 ? void 0 : _b.implementation) {
        Interceptor.attach(Oc.classes[clazz][method].implementation, {
            onEnter: function (args) {
                impl(args, this.context);
            },
        });
    }
}
/**
 * construct an @autoreleasepool for scope `fn`, every autorelease NSObject marked inside `fn` will receive a `release` message while scope exit
 * thus to avoid memory leak for autorelease object
 * @param fn
 */
var autoreleasepool = function (fn) {
    var pool = NSAutoreleasePool.alloc().init();
    try {
        fn();
    }
    finally {
        pool.release();
    }
};
/**
 * log designated parts of the calling frame,
 *
 * @param labels user defined param keys to log
 * @param _env extra environment for calling stack,
 * @param _clazz  frame class
 * @param _method  frame method
 * @param returns  frame return value
 * @param receiver frame receiver
 * @param _selector frame selector from calling context
 * @param args frame arguments
 * @returns the log object
 */
var designated = function (labels, _env, _clazz, _method, returns, receiver, _selector) {
    var args = [];
    for (var _i = 7; _i < arguments.length; _i++) {
        args[_i - 7] = arguments[_i];
    }
    var uniques = new (Set.bind.apply(Set, __spreadArray([void 0], __read(labels))))();
    if (uniques.delete('*')) {
        return {
            returns: foundation_1.at(returns).toString(),
            receiver: foundation_1.at(receiver).toString(),
            args: args.map(function (it) { return foundation_1.at(it).toString(); }),
        };
    }
    else {
        var messy = Object.create({});
        if (uniques.delete('returns')) {
            Object.assign(messy, { returns: foundation_1.at(returns).toString() });
        }
        if (uniques.delete('self')) {
            Object.assign(messy, { receiver: foundation_1.at(receiver).toString() });
        }
        // mapping arguments
        var declared_1 = _method.replace(/^[-+]\s*/g, '').split(':');
        // remove the last empty group or the only leading group
        declared_1.pop();
        var positions = labels
            .map(function (it) { return declared_1.indexOf(it); })
            .filter(function (it) { return it >= 0; });
        return __assign(__assign({}, messy), { args: positions.map(function (position) { return foundation_1.at(args[position]).toString(); }) });
    }
};
/**
 * simple logger for calling frame, just log env, signature and selector,
 * for most cases this should be enough
 *
 * @param env
 * @param clazz
 * @param method
 * @param _returns
 * @param _receiver
 * @param selector
 * @param _args
 * @returns
 */
var trivial = function (env, clazz, method, _returns, _receiver, selector) {
    var _args = [];
    for (var _i = 6; _i < arguments.length; _i++) {
        _args[_i - 6] = arguments[_i];
    }
    var _a = __read(method.split(/(?<=^[+-])\s*/), 2), sign = _a[0], name = _a[1];
    var signature = sign + "[" + clazz + " " + name + "]";
    var data = {
        env: env,
        signature: signature,
        selector: selector,
    };
    return data;
};
/**
 * compile configuration to dynamic proxy object
 * 1. find the setter method call
 * 2. hook corresponding method,
 * 3. while invoking, dynamic create a proxy to delegate for designate protocol
 *   3.1 generate methods object to handle protocol message per configuration
 *   3.2 invoke configuration callbacks when protocol message received
 * 4. replace argument with generated proxy
 */
var dynamicProxy = function (clazz, spec, protocol, messages) {
    var _a = __read(spec.split('@'), 2), label = _a[0], selector = _a[1];
    var order = selector
        .replace(/[+-]\s|:$/g, '')
        .split(':')
        .indexOf(label); // -1,0,1 etc
    swizzle(clazz, selector, function (origin, clazz, method, args) {
        var params = args;
        var src = args[order];
        var $proxy = new (Oc.registerProxy({
            protocols: [Oc.protocols[protocol]],
            methods: messages.reduce(function (acc, ele) {
                var _a;
                return (__assign(__assign({}, acc), (_a = {}, _a[ele.symbol] = function () {
                    var _a;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var returns = (_a = this.data.target)[ele.symbol].apply(_a, __spreadArray([], __read(args)));
                    var _b = __read(args), self = _b[0], param = _b.slice(2); // calling convention -> self, cmd, ...args
                    ele.logger.apply(// calling convention -> self, cmd, ...args
                    ele, __spreadArray([{},
                        protocol,
                        method,
                        returns,
                        self,
                        ele.symbol], __read(param.map(function (it) { return it; }))));
                    return returns;
                }, _a)));
            }, {}),
        }))(src);
        // replace designated param
        params[order] = $proxy;
        return origin.apply(void 0, __spreadArray([], __read(params)));
    });
};
rpc.exports = {
    init: function () {
        /**
         * normalize `trivial` | `by-label-argument-record` | `fully-customization-logger` configurations to the same shape
         */
        var normalized = underscore_1.mapValues(configuration, function (ary) {
            return ary.map(function (it) {
                // `trivial` logger
                if (typeof it === 'string') {
                    return { symbol: it, logger: trivial };
                }
                else {
                    // expand `by-label-argument` array to labels of current message and log the corresponding parts, then merge with trivial version
                    if (Array.isArray(it.logger)) {
                        var symbol = it.symbol, labels_1 = it.logger;
                        return {
                            symbol: symbol,
                            logger: function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                return __assign(__assign({}, trivial.apply(void 0, __spreadArray([], __read(args)))), designated.apply(void 0, __spreadArray([labels_1], __read(args))));
                            },
                        };
                    }
                    else {
                        // fully customized logger callback, it's users' responsibility to log whatever they want
                        var symbol = it.symbol, logger_1 = it.logger;
                        return {
                            symbol: symbol,
                            logger: function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                return __assign(__assign({}, trivial.apply(void 0, __spreadArray([], __read(args)))), logger_1.apply(void 0, __spreadArray([], __read(args))));
                            },
                        };
                    }
                }
            });
        });
        /**
         * install hooks for presented classes and configured messages,
         * report `missed` classes & methods by tag [[Summary]]
         */
        var missed = Object.entries(normalized).map(function (_a) {
            var _b, _c, _d, _e;
            var _f, _g;
            var _h = __read(_a, 2), key = _h[0], values = _h[1];
            var clazz = Oc.classes[key];
            if (!clazz) {
                console.error("missing class: " + key);
                // handle protocol delegates
                if (key.split('#').length === 3) {
                    var _j = __read(key.split('#'), 3), clazz_1 = _j[0], tuples = _j[1], protocol = _j[2];
                    var _k = __read(tuples.split('@'), 2), message = _k[1];
                    if ((_g = (_f = ObjC.classes[clazz_1]) === null || _f === void 0 ? void 0 : _f.$ownMethods) === null || _g === void 0 ? void 0 : _g.includes(message)) {
                        dynamicProxy(clazz_1, tuples, protocol, values);
                        return _b = {}, _b[key] = [], _b;
                    }
                    else {
                        return _c = {}, _c[key] = [message], _c;
                    }
                }
                else {
                    // missing classes
                    return _d = {}, _d[key] = '*', _d;
                }
            }
            else {
                var missed_1 = values.map(function (value) {
                    // filter out all non-own methods, coz it may hook other sub classes
                    if (!clazz.$ownMethods.includes(value.symbol)) {
                        console.error("missing " + key + ":" + JSON.stringify(value));
                        return value.symbol;
                    }
                    else {
                        var fun = Oc.classes[key][value.symbol];
                        swizzle(key, value.symbol, function (origin, clazz, method, _a) {
                            var _b = __read(_a), self = _b[0], cmd = _b[1], args = _b.slice(2);
                            var returns = origin.apply(void 0, __spreadArray([self, cmd], __read(args)));
                            autoreleasepool(function () {
                                var env = {};
                                var output = value.logger.apply(value, __spreadArray([env,
                                    clazz,
                                    method,
                                    returns,
                                    self,
                                    Oc.selectorAsString(cmd)], __read(args.map(function (it) { return it; }))));
                                var serialized = JSON.stringify(output);
                                if (!output.skip) {
                                    statistics(Hook, serialized);
                                }
                            });
                            return returns;
                        });
                        return '';
                    }
                });
                return _e = {}, _e[key] = missed_1.filter(function (it) { return !it; }), _e;
            }
        });
        var combination = missed.reduce(function (acc, ele) { return (__assign(__assign({}, acc), ele)); }, {});
        var picked = underscore_1.pickBy(combination, function (it) { return it.length; });
        var serialized = JSON.stringify(picked);
        autoreleasepool(function () {
            statistics(Summary, serialized);
        });
    },
    dispose: function () { },
};

},{"./foundation":1,"./network":3,"./privacy":4,"./underscore":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
var foundation_1 = require("./foundation");
exports.Network = {
    NSURLSession: [
        foundation_1.positional('- dataTaskWithURL:')(foundation_1.ToString.NSURL),
        foundation_1.positional('- dataTaskWithURL:completionHandler:')(foundation_1.ToString.NSURL),
        foundation_1.positional('- dataTaskWithRequest:')(foundation_1.ToString.NSURLRequest),
        foundation_1.positional('- dataTaskWithRequest:completionHandler:')(foundation_1.ToString.NSURLRequest),
        foundation_1.positional('- downloadTaskWithURL:')(foundation_1.ToString.NSURL),
        foundation_1.positional('- downloadTaskWithURL:completionHandler:')(foundation_1.ToString.NSURL),
        foundation_1.positional('- downloadTaskWithRequest:')(foundation_1.ToString.NSURLRequest),
        foundation_1.positional('- downloadTaskWithRequest:completionHandler:')(foundation_1.ToString.NSURLRequest),
        // TODO
        // positional('- downloadTaskWithResumeData:')(),
        // positional('- downloadTaskWithResumeData:completionHandler:')(),
        foundation_1.positional('- uploadTaskWithRequest:fromData:')(foundation_1.ToString.NSURLRequest),
        foundation_1.positional('- uploadTaskWithRequest:fromData:completionHandler:')(foundation_1.ToString.NSURLRequest),
        foundation_1.positional('- uploadTaskWithRequest:fromFile:')(foundation_1.ToString.NSURLRequest),
        foundation_1.positional('- uploadTaskWithRequest:fromFile:completionHandler:')(foundation_1.ToString.NSURLRequest),
        foundation_1.positional('- uploadTaskWithStreamedRequest:')(foundation_1.ToString.NSURLRequest),
        foundation_1.inlay('- streamTaskWithHostName:port:')('streamTaskWithHostName', 'port'),
        foundation_1.positional('- streamTaskWithNetService:')(foundation_1.ToString.NSNetService),
        foundation_1.positional('- webSocketTaskWithURL:')(foundation_1.ToString.NSURL),
        foundation_1.positional('- webSocketTaskWithRequest:')(foundation_1.ToString.NSURLRequest),
        foundation_1.positional('- webSocketTaskWithURL:protocols:')(foundation_1.ToString.NSURLRequest, foundation_1.ToString.NSArray),
    ],
};

},{"./foundation":1}],4:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyProtocols = exports.Privacies = void 0;
var foundation_1 = require("./foundation");
exports.Privacies = {
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
    UIImagePickerController: [
        '- takePicture',
        '- startVideoCapture',
        '- stopVideoCapture',
        '- viewWillAppear:',
    ],
    /**
     * category: [[mediaLibrary]]
     * ref: [[https://developer.apple.com/videos/play/wwdc2020/10652/]]
     *
     * no permission required, limited collections of albums & photos Since iOS 14, system host it in a separated process
     */
    PHPickerViewController: ['- setDelegate:'],
    /**
     * category: [[mediaLibrary]]
     */
    PHPhotoLibrary: [
        '+ requestAuthorization:',
        '+ authorizationStatus',
        '+ authorizationStatusForAccessLevel:',
        '+ requestAuthorizationForAccessLevel:handler:',
        '- presentLimitedLibraryPickerFromViewController:',
        '- presentLimitedLibraryPickerFromViewController:completionHandler:',
        '- performChanges:completionHandler:',
        '- performChangesAndWait:error:', // change album
    ],
    /**
     * category: [[mediaLibrary]]
     *
     * everything about meta-data not underline image/videos, fetch needs permission if
     */
    PHAsset: [
        '+ fetchAssetsInAssetCollection:options:',
        '+ fetchAssetsWithMediaType:options:',
        '+ fetchAssetsWithLocalIdentifiers:options:',
        '+ fetchKeyAssetsInAssetCollection:options:',
        '+ fetchAssetsWithOptions:',
        '+ fetchAssetsWithBurstIdentifier:options:',
        '+ fetchAssetsWithALAssetURLs:options:', // fetch
    ],
    /**
     * category: [[mediaLibrary]]
     *
     * ref: [[https://developer.apple.com/documentation/foundation/nsitemprovider]]
     */
    NSItemProvider: [
        '- loadObjectOfClass:completionHandler:',
        '- loadDataRepresentationForTypeIdentifier:completionHandler:',
        '- loadItemForTypeIdentifier:options:completionHandler:',
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
    AVCaptureDeviceInput: ['+ deviceInputWithDevice:error:'],
    AVCaptureDevice: [
        '+ authorizationStatusForMediaType:',
        '+ requestAccessForMediaType:completionHandler:',
    ],
    AVCapturePhotoOutput: ['- capturePhotoWithSettings:delegate:'],
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
        '+ loadBroadcastActivityViewControllerWithHandler:',
        '+ loadBroadcastActivityViewControllerWithPreferredExtension:handler:', // show specific recording extension
    ],
    RPBroadcastController: [
        '- startBroadcastWithHandler:', // manually start broadcast, for #iOS(<=10)
    ],
    /**
     * category: [[location]]
     *
     * ref: [[https://developer.apple.com/documentation/corelocation/getting_the_user_s_location]]
     */
    CLLocationManager: [
        '- requestWhenInUseAuthorization',
        '- requestAlwaysAuthorization',
        '- setDelegate:',
        '- startUpdatingLocationWithPrompt',
        '- startUpdatingLocation',
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
};
exports.PrivacyProtocols = (_a = {},
    /**
     * category: [[mediaLibrary]]
     */
    _a[foundation_1.setterOf("UIImagePickerController", '- setDelegate:', "UIImagePickerControllerDelegate")] = [
        '- imagePickerController:didFinishPickingMediaWithInfo:',
        '- imagePickerController:didFinishPickingImage:editingInfo:', // actually read image or photo
    ],
    _a[foundation_1.setterOf("PHPickerViewController", '- setDelegate:', 'PHPickerViewControllerDelegate')] = ['- picker:didFinishPicking:'],
    /**
     * category: [[screenRecord]]
     *
     * TODO
     * dont known what is the invocation,
     */
    _a[foundation_1.unsafe(templateObject_1 || (templateObject_1 = __makeTemplateObject(["RPBroadcastSampleHandler"], ["RPBroadcastSampleHandler"])))] = [
        '- broadcastStartedWithSetupInfo:', // automatically start broadcast notification for #iOS(>10)
    ],
    /**
     * category: [[location]]
     */
    _a[foundation_1.setterOf('CLLocationManager', '- setDelegate:', "CLLocationManagerDelegate")] = [
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
    _a);
var templateObject_1;

},{"./foundation":1}],5:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickBy = exports.mapValues = exports.zip = void 0;
/**
 * zip the shortest path
 * @param fst
 * @param snd
 * @returns
 */
function zip(fst, snd) {
    var size = Math.min(fst.length, snd.length);
    return __spreadArray([], __read(Array(size).keys())).map(function (idx) { return [fst[idx], snd[idx]]; });
}
exports.zip = zip;
function mapValues(value, fn) {
    return Object.keys(value).reduce(function (acc, ele) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[ele] = fn(value[ele]), _a)));
    }, Object.create({}));
}
exports.mapValues = mapValues;
function pickBy(src, fn) {
    Object.keys(src).reduce(function (acc, ele) {
        var _a;
        return (fn(src[ele]) ? __assign(__assign({}, acc), (_a = {}, _a[ele] = src[ele], _a)) : __assign({}, acc));
    }, {});
}
exports.pickBy = pickBy;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZm91bmRhdGlvbi50cyIsInNyYy9pbmRleC50cyIsInNyYy9uZXR3b3JrLnRzIiwic3JjL3ByaXZhY3kudHMiLCJzcmMvdW5kZXJzY29yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSwyQ0FBa0M7QUE2SHJCLFFBQUEsUUFBUSxHQUFHO0lBQ3RCLFlBQVksRUFBWixVQUFhLE9BQVk7UUFDdkIsSUFBTSxHQUFHLEdBQUcsVUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3ZCLE9BQU8sYUFBVyxHQUFHLENBQUMsVUFBVSxFQUFFLGVBQVUsZ0JBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFHLENBQUE7SUFDekUsQ0FBQztJQUNELEtBQUssRUFBTCxVQUFNLEdBQVE7UUFDWixPQUFPLEtBQUcsVUFBRSxDQUFDLEdBQUcsQ0FBRyxDQUFBO0lBQ3JCLENBQUM7SUFDRCxZQUFZLEVBQVosVUFBYSxPQUFZO1FBQ3ZCLElBQU0sUUFBUSxHQUFHLFVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUM1QixPQUFPLFdBQVMsT0FBTyxDQUFDLElBQUksY0FBUyxPQUFPLENBQUMsSUFBSSxnQkFBVyxPQUFPLENBQUMsTUFBUSxDQUFBO0lBQzlFLENBQUM7SUFDRCxPQUFPLEVBQVAsVUFBUSxHQUFRO1FBQ2QsSUFBTSxJQUFJLEdBQUcsVUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3BCLE9BQU8sS0FBRyxJQUFNLENBQUE7SUFDbEIsQ0FBQztDQUNGLENBQUE7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFDLE9BQWlCO0lBQzFDLE9BQU87UUFBQyxZQUFtQzthQUFuQyxVQUFtQyxFQUFuQyxxQkFBbUMsRUFBbkMsSUFBbUM7WUFBbkMsdUJBQW1DOztRQUFLLE9BQUEsQ0FBQztZQUMvQyxNQUFN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
