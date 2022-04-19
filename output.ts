type AppVersion = string
type AppBuild = string
type Sel = string
type Signature = `${'+' | '-'} [${string} ${Sel}]`
type Selector = `${'+' | '-'} ${Sel}`

type Output = {
  category: 'Hook' | 'Summary'
  sessionId: string

  data: {
    env: {}
    signature: Signature // + [NSObject new]
    receiver?: string
    selector: Selector // + new
    args?: Array<string>
    returns?: string
    stack?: Array<string>
  }

  // below device info
  model: string
  name: string
  systemVersion: string

  // below app info
  bundleId: string
  appVersion: AppVersion
  build: AppBuild
}
