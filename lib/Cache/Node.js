var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("../data"));
class Memory {
    constructor(size, expirationTime, gatewayConfig) {
        this.store = new Map();
        this.expirationTime = expirationTime;
        this.size = size;
        this.data = new data_1.default(gatewayConfig);
    }
    get(addr) {
        var _a;
        const item = this.store.get(addr);
        if (item && Date.now() < item.timestamp + this.expirationTime) {
            const result = (_a = this.store.get(addr)) === null || _a === void 0 ? void 0 : _a.account;
            if (result)
                return result;
            else if (result === null)
                return this.data.getDefaultAccount(addr);
        }
    }
    find(uniqueHandle) {
        var _a, _b;
        for (const [addr, item] of this.store) {
            const handle = (_b = (_a = item.account) === null || _a === void 0 ? void 0 : _a.profile) === null || _b === void 0 ? void 0 : _b.handleName;
            if (uniqueHandle === handle && Date.now() < item.timestamp + this.expirationTime)
                return item.account;
        }
    }
    hydrate(addr, account) {
        const item = {
            timestamp: Date.now(),
            addr,
            account: account ? account : null,
        };
        // add or hydrate account data
        this.store.set(item.addr, item);
        if (this.store.size >= this.size)
            this.store.delete(this.store.keys().next().value);
    }
    reset() {
        this.store.clear();
    }
    dump() {
        return this.store;
    }
}
exports.default = Memory;
