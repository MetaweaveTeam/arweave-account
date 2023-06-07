var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Web_1 = __importDefault(require("./Web"));
const Node_1 = __importDefault(require("./Node"));
class Cache {
    constructor(env, size, expirationTime, gatewayConfig) {
        // Environments list
        this.select = {
            web: () => new Web_1.default(this.size, this.expirationTime, this.gatewayConfig),
            node: () => new Node_1.default(this.size, this.expirationTime, this.gatewayConfig),
        };
        this.get = (addr) => this.cacheObj.get(addr);
        this.find = (uniqueHandle) => this.cacheObj.find(uniqueHandle);
        this.hydrate = (addr, account) => this.cacheObj.hydrate(addr, account);
        this.reset = () => this.cacheObj.reset();
        this.dump = () => this.cacheObj.dump();
        this.size = size;
        this.expirationTime = expirationTime;
        this.gatewayConfig = gatewayConfig;
        if (typeof env === 'object')
            this.cacheObj = env;
        else if (this.select[env])
            this.cacheObj = this.select[env]();
        else
            throw new Error(`Cache for the '${env}' environment is not implemented.`);
    }
}
exports.default = Cache;
