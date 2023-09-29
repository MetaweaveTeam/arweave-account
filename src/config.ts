export const PROTOCOL_NAME = ["Account-0.2", "Account-0.3"];

export let DEFAULT_AVATAR_URI: string;
export let DEFAULT_BANNER_URI: string;

export const set_DEFAULT_AVATAR_URI = (uri: string) => {
  DEFAULT_AVATAR_URI = uri;
}
export const set_DEFAULT_BANNER_URI = (uri: string) => {
  DEFAULT_BANNER_URI = uri;
}