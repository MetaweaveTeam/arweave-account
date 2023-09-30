const
  PROTOCOL_NAMES = ["Account-0.2", "Account-0.3"],
  NO_AVATAR_FLAG = "ar://OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA",
  NO_BANNER_FLAG = "ar://a0ieiziq2JkYhWamlrUCHxrGYnHWUAMcONxRmfkWt-k";

/**
 * Explaination of NO_AVATAR_FLAG and NO_BANNER_FLAG values:
 * 
 * The arweave-account protocol used these txids as default values when the user didn't set a custom avatar or banner.
 * It turns out that when the users updated their profile, those data got written as part of their profile data 😅.
 * 
 * With the update of being able to set different default avatars and banners, I turned those values into flags
 * indicating if the user has an avatar or banner set so the library update compatible with the protocol without
 * breaking change.
 */

export {
  PROTOCOL_NAMES,
  NO_AVATAR_FLAG,
  NO_BANNER_FLAG
};
