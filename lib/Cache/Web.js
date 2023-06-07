var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../data"));
class LocalStorage {
    constructor(size, expirationTime, gatewayConfig) {
        this.expirationTime = expirationTime;
        this.size = size;
        this.data = new data_1.default(gatewayConfig);
        if (!localStorage.getItem('arweave-account'))
            localStorage.setItem('arweave-account', '[]');
    }
    get(addr) {
        var _a;
        // @ts-ignore localStorage is initialized in constructor
        const cache = JSON.parse(localStorage.getItem('arweave-account'));
        const result = (_a = cache.find((item) => item.addr === addr && Date.now() < item.timestamp + this.expirationTime)) === null || _a === void 0 ? void 0 : _a.account;
        if (result)
            return result;
        else if (result === null)
            return this.data.getDefaultAccount(addr);
    }
    find(uniqueHandle) {
        var _a;
        // @ts-ignore localStorage is initialized in constructor
        const cache = JSON.parse(localStorage.getItem('arweave-account'));
        return (_a = cache.find((record) => { var _a; return ((_a = record.account) === null || _a === void 0 ? void 0 : _a.handle) === uniqueHandle && Date.now() < record.timestamp + this.expirationTime; })) === null || _a === void 0 ? void 0 : _a.account;
    }
    /*
     *  add or update an account timestamp
     */
    hydrate(addr, account) {
        const item = {
            timestamp: Date.now(),
            addr,
            account: account ? account : null,
        };
        // @ts-ignore localStorage is initialized in constructor
        const cache = JSON.parse(localStorage.getItem('arweave-account'));
        const itemIndex = cache.findIndex((record) => record.addr === item.addr);
        // hydrate account data
        if (itemIndex !== -1)
            cache.splice(itemIndex, 1, item);
        else {
            cache.unshift(item); // add account data
            if (cache.length > this.size)
                cache.pop();
        }
        localStorage.setItem('arweave-account', JSON.stringify(cache));
    }
    /*
     *  Debugging purpose only
     */
    reset() {
        localStorage.setItem('arweave-account', '[]');
    }
    dump() {
        // @ts-ignore localStorage is initialized in constructor
        return localStorage.getItem('arweave-account');
    }
}
exports.default = LocalStorage;
