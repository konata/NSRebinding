import { NativeCfg } from "./native";

const configuration: NativeCfg = {
    null: [
      'socket',
      {
        symbol: 'connect',
        logger: () => ({}),
      },
      'uname',
    ],
  }
