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

## TODO

1. solve QQMusic call `[NSData dataWithContentsOfURL]` ANR error
2. tree-shaking for builds
