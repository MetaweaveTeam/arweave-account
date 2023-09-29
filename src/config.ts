import { ApiConfig as GatewayConfig } from 'arweave/node/lib/api';

export default class Config {
  static PROTOCOL_NAME = ["Account-0.2", "Account-0.3"];
  static GATEWAY: GatewayConfig;
  static DEFAULT_AVATAR_URI: string;
  static DEFAULT_BANNER_URI: string;

  constructor(gatewayConfig: GatewayConfig, defaultAvatarUri: string, defaultBannerUri: string) {
    Config.GATEWAY = gatewayConfig;
    Config.DEFAULT_AVATAR_URI = defaultAvatarUri;
    Config.DEFAULT_BANNER_URI = defaultBannerUri;
  }

  setDefaultAvatarUri(uri: string) {
    Config.DEFAULT_AVATAR_URI = uri;
  }

  setDefaultBannerUri(uri: string) {
    Config.DEFAULT_BANNER_URI = uri;
  }
}