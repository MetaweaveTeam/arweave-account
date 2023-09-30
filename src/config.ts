import { ApiConfig as GatewayConfig } from 'arweave/node/lib/api';

export default class Config {
  static gateway: GatewayConfig;
  static defaultAvatarURI: string;
  static defaultBannerURI: string;

  constructor(gatewayConfig: GatewayConfig, defaultAvatarUri: string, defaultBannerUri: string) {
    Config.gateway = gatewayConfig;
    Config.defaultAvatarURI = defaultAvatarUri;
    Config.defaultBannerURI = defaultBannerUri;
  }

  setDefaultAvatarUri(uri: string) {
    Config.defaultAvatarURI = uri;
  }

  setDefaultBannerUri(uri: string) {
    Config.defaultBannerURI = uri;
  }
}