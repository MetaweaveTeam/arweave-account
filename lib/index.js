var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arweave_1 = __importDefault(require("arweave"));
const ardb_1 = __importDefault(require("ardb"));
const Cache_1 = __importDefault(require("./Cache"));
const data_1 = __importDefault(require("./data"));
const config_1 = require("./config");
class Account {
    constructor({ cacheIsActivated = true, cacheSize = 100, cacheTime = 60000, gateway = {
        host: 'arweave.net',
        port: 443,
        protocol: 'https',
        timeout: 20000,
        logging: false,
    }, } = {}) {
        this.walletAddr = null;
        this.debug = {
            resetCache: () => {
                var _a;
                (_a = this.cache) === null || _a === void 0 ? void 0 : _a.reset();
            },
            printCache: () => {
                var _a;
                const now = new Date();
                // tslint:disable-next-line
                console.log(` > Cache content at ${now.toISOString().replace(/T/, ' ').replace(/\..+/, '')}\n`);
                // tslint:disable-next-line
                console.log((_a = this.cache) === null || _a === void 0 ? void 0 : _a.dump());
            },
        };
        this.arweave = arweave_1.default.init(gateway);
        this.ardb = new ardb_1.default(this.arweave);
        this.data = new data_1.default(gateway);
        if (cacheIsActivated) {
            if (typeof window !== 'undefined') {
                this.cache = new Cache_1.default('web', cacheSize, cacheTime, gateway);
            }
            else
                this.cache = new Cache_1.default('node', cacheSize, cacheTime, gateway);
        }
        else
            this.cache = null;
    }
    connect(jwk = 'use_wallet') {
        return __awaiter(this, void 0, void 0, function* () {
            this.walletAddr = yield this.arweave.wallets.getAddress(jwk);
        });
    }
    updateProfile(profile) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.walletAddr)
                throw Error('Method connect() should be called before updateProfile().');
            if (!this.data.isProfile(profile))
                throw Error(`Object "${JSON.stringify(profile)}" doesn't match with the shape of a T_profile object.\nTypescript tip: import { T_profile } from 'arweave-account'`);
            const encodedAccount = this.data.encode(profile);
            const data = JSON.stringify(encodedAccount);
            const tx = yield this.arweave.createTransaction({ data });
            tx.addTag('Protocol-Name', config_1.PROTOCOL_NAME[config_1.PROTOCOL_NAME.length - 1]);
            tx.addTag('handle', profile.handleName);
            let result = tx;
            try {
                if (window.arweaveWallet) {
                    // @ts-ignore try bundlr first
                    result = yield window.arweaveWallet.dispatch(tx);
                }
                else
                    throw 'no window.arweaveWallet';
            }
            catch (e) {
                try {
                    yield this.arweave.transactions.sign(tx);
                    yield this.arweave.transactions.post(tx);
                }
                catch (e) {
                    throw e;
                }
            }
            if (encodedAccount) {
                const accountObj = this.data.decode(tx.id, this.walletAddr, encodedAccount);
                (_a = this.cache) === null || _a === void 0 ? void 0 : _a.hydrate(this.walletAddr, accountObj);
            }
            return result;
        });
    }
    get(addr) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            addr = addr.trim();
            if (!/^[a-zA-Z0-9\-_]{43}$/.test(addr))
                throw 'Invalid wallet address argument';
            const cacheResponse = (_a = this.cache) === null || _a === void 0 ? void 0 : _a.get(addr);
            if (cacheResponse)
                return cacheResponse;
            else {
                const tx = yield this.ardb
                    .search('transactions')
                    .exclude('anchor')
                    .tag('Protocol-Name', config_1.PROTOCOL_NAME)
                    .from(addr)
                    .limit(1)
                    .find();
                const txid = tx[0] ? tx[0].id : null;
                const data = txid
                    ? (yield this.arweave.api.get(txid).catch(() => {
                        return { data: null };
                    })).data
                    : { data: null };
                try {
                    const accountObj = this.data.decode(txid, addr, data);
                    (_b = this.cache) === null || _b === void 0 ? void 0 : _b.hydrate(addr, accountObj);
                    return accountObj;
                }
                catch (e) {
                    // if JSON.parse(data) throw an error because data is not a valid JSON
                    return this.data.getDefaultAccount(addr);
                }
            }
        });
    }
    search(handle) {
        return __awaiter(this, void 0, void 0, function* () {
            const txs = yield this.ardb
                .search('transactions')
                .exclude('anchor')
                .tag('Protocol-Name', config_1.PROTOCOL_NAME)
                .tag('handle', handle)
                .limit(100)
                .find();
            const formattedAccounts = txs.map((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const txid = tx.id;
                const addr = 'owner' in tx ? tx.owner.address : 'anonymous';
                const data = (yield this.arweave.api.get(txid).catch(() => {
                    return { data: null };
                })).data;
                try {
                    const accountObj = this.data.decode(txid, addr, JSON.parse(data));
                    (_a = this.cache) === null || _a === void 0 ? void 0 : _a.hydrate(addr, accountObj);
                    return accountObj;
                }
                catch (e) {
                    // if JSON.parse(data) throw an error because data is not a valid JSON
                    return this.data.getDefaultAccount(addr);
                }
            }));
            const accounts = yield Promise.all(formattedAccounts);
            return accounts.filter((v, i, a) => v !== null &&
                // remove address duplicates: https://stackoverflow.com/a/56757215
                a.findIndex((t) => (t === null || t === void 0 ? void 0 : t.addr) === (v === null || v === void 0 ? void 0 : v.addr)) === i);
        });
    }
    find(uniqueHandle) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            uniqueHandle = uniqueHandle.trim();
            // check if format is handle#xxxxxx
            if (!/^(.+)#[a-zA-Z0-9\-\_]{6}$/.test(uniqueHandle))
                return null;
            const cacheResponse = (_a = this.cache) === null || _a === void 0 ? void 0 : _a.find(uniqueHandle);
            if (cacheResponse !== undefined)
                return cacheResponse;
            else {
                const txs = yield this.ardb
                    .search('transactions')
                    .exclude('anchor')
                    .tag('Protocol-Name', config_1.PROTOCOL_NAME)
                    .tag('handle', uniqueHandle.slice(0, -7))
                    .limit(100)
                    .find();
                const formattedAccounts = txs.map((tx) => __awaiter(this, void 0, void 0, function* () {
                    var _b;
                    const txid = tx.id;
                    const addr = 'owner' in tx ? tx.owner.address : 'anonymous';
                    const data = (yield this.arweave.api.get(txid).catch(() => {
                        return { data: null };
                    })).data;
                    try {
                        const accountObj = this.data.decode(txid, addr, JSON.parse(data));
                        (_b = this.cache) === null || _b === void 0 ? void 0 : _b.hydrate(addr, accountObj);
                        return accountObj;
                    }
                    catch (e) {
                        // if JSON.parse(data) throw an error because data is not a valid JSON
                        return this.data.getDefaultAccount(addr);
                    }
                }));
                const a = yield Promise.all(formattedAccounts);
                const accounts = a.filter((e) => e !== undefined);
                accounts.forEach((ac) => {
                    var _a;
                    (_a = this.cache) === null || _a === void 0 ? void 0 : _a.hydrate(ac.addr, ac);
                });
                const result = accounts.find((ac) => ac.handle.includes(uniqueHandle));
                return result || null;
            }
        });
    }
}
exports.default = Account;
