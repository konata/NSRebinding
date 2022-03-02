import {
  RuntimeCfg,
  inlay,
  positional,
  ToString,
  at,
  RuntimeSnapshot,
  Selector,
} from './foundation'

export const Network: RuntimeCfg = {
  NSURLSession: [
    positional('- dataTaskWithURL:')(ToString.NSURL),
    positional('- dataTaskWithURL:completionHandler:')(ToString.NSURL),
    positional('- dataTaskWithRequest:')(ToString.NSURLRequest),
    positional('- dataTaskWithRequest:completionHandler:')(
      ToString.NSURLRequest
    ),
    positional('- downloadTaskWithURL:')(ToString.NSURL),
    positional('- downloadTaskWithURL:completionHandler:')(ToString.NSURL),
    positional('- downloadTaskWithRequest:')(ToString.NSURLRequest),
    positional('- downloadTaskWithRequest:completionHandler:')(
      ToString.NSURLRequest
    ),

    // TODO
    // positional('- downloadTaskWithResumeData:')(),
    // positional('- downloadTaskWithResumeData:completionHandler:')(),

    positional('- uploadTaskWithRequest:fromData:')(ToString.NSURLRequest),
    positional('- uploadTaskWithRequest:fromData:completionHandler:')(
      ToString.NSURLRequest
    ),
    positional('- uploadTaskWithRequest:fromFile:')(ToString.NSURLRequest),
    positional('- uploadTaskWithRequest:fromFile:completionHandler:')(
      ToString.NSURLRequest
    ),
    positional('- uploadTaskWithStreamedRequest:')(ToString.NSURLRequest),
    inlay('- streamTaskWithHostName:port:')('streamTaskWithHostName', 'port'),
    positional('- streamTaskWithNetService:')(ToString.NSNetService),
    positional('- webSocketTaskWithURL:')(ToString.NSURL),
    positional('- webSocketTaskWithRequest:')(ToString.NSURLRequest),
    positional('- webSocketTaskWithURL:protocols:')(
      ToString.NSURLRequest,
      ToString.NSArray
    ),
  ],
}
