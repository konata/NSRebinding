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
        var req = (0, exports.at)(request);
        return "method: ".concat(req.HTTPMethod(), ", url: ").concat(exports.ToString.NSURL(req.URL()));
    },
    NSURL: function (url) {
        return "".concat((0, exports.at)(url));
    },
    NSNetService: function (service) {
        var $service = (0, exports.at)(service);
        return "name: ".concat(service.name, " type:").concat(service.type, " domain:").concat(service.domain);
    },
    NSArray: function (ary) {
        var $ary = (0, exports.at)(ary);
        return "".concat($ary);
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
                    args: (0, underscore_1.zip)(rst, fn).map(function (_a) {
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
var argumentOf = function (clazz, spec, protocol) { return "".concat(clazz, "#").concat(spec, "#").concat(protocol); };
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
    return "".concat(clazz, "#").concat(setter.replace(/^[+-]\s+|:$/g, ''), "@").concat(setter, "#").concat(protocol);
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
        console.log("[".concat(tag, "]: ").concat(payload));
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
    var uniques = new (Set.bind.apply(Set, __spreadArray([void 0], __read(labels), false)))();
    if (uniques.delete('*')) {
        return {
            returns: (0, foundation_1.at)(returns).toString(),
            receiver: (0, foundation_1.at)(receiver).toString(),
            args: args.map(function (it) { return (0, foundation_1.at)(it).toString(); }),
        };
    }
    else {
        var messy = Object.create({});
        if (uniques.delete('returns')) {
            Object.assign(messy, { returns: (0, foundation_1.at)(returns).toString() });
        }
        if (uniques.delete('self')) {
            Object.assign(messy, { receiver: (0, foundation_1.at)(receiver).toString() });
        }
        // mapping arguments
        var declared_1 = _method.replace(/^[-+]\s*/g, '').split(':');
        // remove the last empty group or the only leading group
        declared_1.pop();
        var positions = labels
            .map(function (it) { return declared_1.indexOf(it); })
            .filter(function (it) { return it >= 0; });
        return __assign(__assign({}, messy), { args: positions.map(function (position) { return (0, foundation_1.at)(args[position]).toString(); }) });
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
    var signature = "".concat(sign, "[").concat(clazz, " ").concat(name, "]");
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
                    var returns = (_a = this.data.target)[ele.symbol].apply(_a, __spreadArray([], __read(args), false));
                    var _b = __read(args), self = _b[0], param = _b.slice(2); // calling convention -> self, cmd, ...args
                    ele.logger.apply(// calling convention -> self, cmd, ...args
                    ele, __spreadArray([{},
                        protocol,
                        method,
                        returns,
                        self,
                        ele.symbol], __read(param.map(function (it) { return it; })), false));
                    return returns;
                }, _a)));
            }, {}),
        }))(src);
        // replace designated param
        params[order] = $proxy;
        return origin.apply(void 0, __spreadArray([], __read(params), false));
    });
};
rpc.exports = {
    init: function () {
        /**
         * normalize `trivial` | `by-label-argument-record` | `fully-customization-logger` configurations to the same shape
         */
        var normalized = (0, underscore_1.mapValues)(configuration, function (ary) {
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
                                return __assign(__assign({}, trivial.apply(void 0, __spreadArray([], __read(args), false))), designated.apply(void 0, __spreadArray([labels_1], __read(args), false)));
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
                                return __assign(__assign({}, trivial.apply(void 0, __spreadArray([], __read(args), false))), logger_1.apply(void 0, __spreadArray([], __read(args), false)));
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
                console.error("missing class: ".concat(key));
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
                        console.error("missing ".concat(key, ":").concat(JSON.stringify(value)));
                        return value.symbol;
                    }
                    else {
                        var fun = Oc.classes[key][value.symbol];
                        swizzle(key, value.symbol, function (origin, clazz, method, _a) {
                            var _b = __read(_a), self = _b[0], cmd = _b[1], args = _b.slice(2);
                            var returns = origin.apply(void 0, __spreadArray([self, cmd], __read(args), false));
                            autoreleasepool(function () {
                                var env = {};
                                var output = value.logger.apply(value, __spreadArray([env,
                                    clazz,
                                    method,
                                    returns,
                                    self,
                                    Oc.selectorAsString(cmd)], __read(args.map(function (it) { return it; })), false));
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
        var picked = (0, underscore_1.pickBy)(combination, function (it) { return it.length; });
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
        (0, foundation_1.positional)('- dataTaskWithURL:')(foundation_1.ToString.NSURL),
        (0, foundation_1.positional)('- dataTaskWithURL:completionHandler:')(foundation_1.ToString.NSURL),
        (0, foundation_1.positional)('- dataTaskWithRequest:')(foundation_1.ToString.NSURLRequest),
        (0, foundation_1.positional)('- dataTaskWithRequest:completionHandler:')(foundation_1.ToString.NSURLRequest),
        (0, foundation_1.positional)('- downloadTaskWithURL:')(foundation_1.ToString.NSURL),
        (0, foundation_1.positional)('- downloadTaskWithURL:completionHandler:')(foundation_1.ToString.NSURL),
        (0, foundation_1.positional)('- downloadTaskWithRequest:')(foundation_1.ToString.NSURLRequest),
        (0, foundation_1.positional)('- downloadTaskWithRequest:completionHandler:')(foundation_1.ToString.NSURLRequest),
        // TODO
        // positional('- downloadTaskWithResumeData:')(),
        // positional('- downloadTaskWithResumeData:completionHandler:')(),
        (0, foundation_1.positional)('- uploadTaskWithRequest:fromData:')(foundation_1.ToString.NSURLRequest),
        (0, foundation_1.positional)('- uploadTaskWithRequest:fromData:completionHandler:')(foundation_1.ToString.NSURLRequest),
        (0, foundation_1.positional)('- uploadTaskWithRequest:fromFile:')(foundation_1.ToString.NSURLRequest),
        (0, foundation_1.positional)('- uploadTaskWithRequest:fromFile:completionHandler:')(foundation_1.ToString.NSURLRequest),
        (0, foundation_1.positional)('- uploadTaskWithStreamedRequest:')(foundation_1.ToString.NSURLRequest),
        (0, foundation_1.inlay)('- streamTaskWithHostName:port:')('streamTaskWithHostName', 'port'),
        (0, foundation_1.positional)('- streamTaskWithNetService:')(foundation_1.ToString.NSNetService),
        (0, foundation_1.positional)('- webSocketTaskWithURL:')(foundation_1.ToString.NSURL),
        (0, foundation_1.positional)('- webSocketTaskWithRequest:')(foundation_1.ToString.NSURLRequest),
        (0, foundation_1.positional)('- webSocketTaskWithURL:protocols:')(foundation_1.ToString.NSURLRequest, foundation_1.ToString.NSArray),
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
     * category: [[ads]]
     */
    ATTrackingManager: [
        '+ requestTrackingAuthorizationWithCompletionHandler:',
        '- trackingAuthorizationStatus',
    ],
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
    _a[(0, foundation_1.setterOf)("UIImagePickerController", '- setDelegate:', "UIImagePickerControllerDelegate")] = [
        '- imagePickerController:didFinishPickingMediaWithInfo:',
        '- imagePickerController:didFinishPickingImage:editingInfo:', // actually read image or photo
    ],
    _a[(0, foundation_1.setterOf)("PHPickerViewController", '- setDelegate:', 'PHPickerViewControllerDelegate')] = ['- picker:didFinishPicking:'],
    /**
     * category: [[screenRecord]]
     *
     * TODO
     * dont known what is the invocation,
     */
    _a[(0, foundation_1.unsafe)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["RPBroadcastSampleHandler"], ["RPBroadcastSampleHandler"])))] = [
        '- broadcastStartedWithSetupInfo:', // automatically start broadcast notification for #iOS(>10)
    ],
    /**
     * category: [[location]]
     */
    _a[(0, foundation_1.setterOf)('CLLocationManager', '- setDelegate:', "CLLocationManagerDelegate")] = [
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
    return __spreadArray([], __read(Array(size).keys()), false).map(function (idx) { return [fst[idx], snd[idx]]; });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZm91bmRhdGlvbi50cyIsInNyYy9pbmRleC50cyIsInNyYy9uZXR3b3JrLnRzIiwic3JjL3ByaXZhY3kudHMiLCJzcmMvdW5kZXJzY29yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSwyQ0FBa0M7QUE2SHJCLFFBQUEsUUFBUSxHQUFHO0lBQ3RCLFlBQVksRUFBWixVQUFhLE9BQVk7UUFDdkIsSUFBTSxHQUFHLEdBQUcsSUFBQSxVQUFFLEVBQUMsT0FBTyxDQUFDLENBQUE7UUFDdkIsT0FBTyxrQkFBVyxHQUFHLENBQUMsVUFBVSxFQUFFLG9CQUFVLGdCQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFFLENBQUE7SUFDekUsQ0FBQztJQUNELEtBQUssRUFBTCxVQUFNLEdBQVE7UUFDWixPQUFPLFVBQUcsSUFBQSxVQUFFLEVBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQTtJQUNyQixDQUFDO0lBQ0QsWUFBWSxFQUFaLFVBQWEsT0FBWTtRQUN2QixJQUFNLFFBQVEsR0FBRyxJQUFBLFVBQUUsRUFBQyxPQUFPLENBQUMsQ0FBQTtRQUM1QixPQUFPLGdCQUFTLE9BQU8sQ0FBQyxJQUFJLG1CQUFTLE9BQU8sQ0FBQyxJQUFJLHFCQUFXLE9BQU8sQ0FBQyxNQUFNLENBQUUsQ0FBQTtJQUM5RSxDQUFDO0lBQ0QsT0FBTyxFQUFQLFVBQVEsR0FBUTtRQUNkLElBQU0sSUFBSSxHQUFHLElBQUEsVUFBRSxFQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3BCLE9BQU8sVUFBRyxJQUFJLENBQUUsQ0FBQTtJQUNsQixDQUFDO0NBQ0YsQ0FBQTtBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixVQUFVLENBQUMsT0FBaUI7SUFDMUMsT0FBTztRQUFDLFlBQW1DO2FBQW5DLFVBQW1DLEVBQW5DLHFCQUFtQyxFQUFuQyxJ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
