Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
class Data {
    constructor(gatewayConfig) {
        this.gatewayConfig = gatewayConfig;
    }
    getURLfromURI(URI) {
        let ressource;
        const gc = this.gatewayConfig;
        // Look for simple txids to be compatible with arweave account protocol v0.2
        if (/^[a-zA-Z0-9\-_]{43}$/.test(URI))
            return `${gc.protocol}://${gc.host}:${gc.port}/${URI}`;
        // ar://<txid>
        else if (ressource = URI.match(/^ar:\/\/([a-zA-Z0-9\-_]{43})$/))
            return `${gc.protocol}://${gc.host}:${gc.port}/${ressource[1]}`;
        // http URLs
        else if (/^https?:\/\/.+$/.test(URI))
            return URI;
        // corrupted data (default avatar)
        else
            return `${gc.protocol}://${gc.host}:${gc.port}/${config_1.DEFAULT_AVATAR_URI}`;
    }
    getUniqueHandle(addr, handleName) {
        if (handleName && typeof handleName === 'string')
            return `@${handleName}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`;
        else
            return `${addr.slice(0, 5)}...${addr.slice(addr.length - 5)}`;
    }
    isEncodedAccount(obj) {
        return obj.handle !== undefined
            && obj.handle.length > 0;
    }
    isProfile(obj) {
        return obj.handleName !== undefined
            && obj.handleName.length > 0
            && obj.links !== undefined;
    }
    getDefaultAccount(addr) {
        return {
            txid: null,
            addr,
            handle: this.getUniqueHandle(addr),
            profile: {
                handleName: "",
                avatar: config_1.DEFAULT_AVATAR_URI,
                avatarURL: this.getURLfromURI(config_1.DEFAULT_AVATAR_URI),
                banner: config_1.DEFAULT_BANNER_URI,
                bannerURL: this.getURLfromURI(config_1.DEFAULT_BANNER_URI),
                name: "",
                bio: "",
                email: "",
                links: {},
                wallets: {}
            }
        };
    }
    encode(profile) {
        let data = { handle: profile.handleName };
        if (profile.avatar)
            data = Object.assign(Object.assign({}, data), { avatar: profile.avatar });
        if (profile.banner)
            data = Object.assign(Object.assign({}, data), { banner: profile.banner });
        if (profile.name)
            data = Object.assign(Object.assign({}, data), { name: profile.name });
        if (profile.bio)
            data = Object.assign(Object.assign({}, data), { bio: profile.bio });
        if (profile.email)
            data = Object.assign(Object.assign({}, data), { email: profile.email });
        if (profile.links)
            data = Object.assign(Object.assign({}, data), { links: profile.links });
        if (profile.wallets)
            data = Object.assign(Object.assign({}, data), { wallets: profile.wallets });
        return data;
    }
    /*
     *  return default account object if no account or corrupted data
     */
    decode(txid, addr, data) {
        /* default account data */
        return this.isEncodedAccount(data)
            ?
                {
                    txid,
                    addr,
                    handle: this.getUniqueHandle(addr, data.handle),
                    profile: {
                        handleName: data.handle ? data.handle : "",
                        avatar: data.avatar ? data.avatar : config_1.DEFAULT_AVATAR_URI,
                        avatarURL: data.avatar ? this.getURLfromURI(data.avatar) : this.getURLfromURI(config_1.DEFAULT_AVATAR_URI),
                        banner: data.banner ? data.banner : config_1.DEFAULT_BANNER_URI,
                        bannerURL: data.banner ? this.getURLfromURI(data.banner) : this.getURLfromURI(config_1.DEFAULT_BANNER_URI),
                        name: data.name ? data.name : "",
                        bio: data.bio ? data.bio : "",
                        email: data.email ? data.email : "",
                        links: data.links ? data.links : {},
                        wallets: data.wallets ? data.wallets : {}
                    }
                }
            : this.getDefaultAccount(addr);
    }
}
exports.default = Data;
;
