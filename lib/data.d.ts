import { ArAccount, ArAccountEncoded, T_addr, T_profile, T_txid } from "./types";
import { ApiConfig as GatewayConfig } from 'arweave/node/lib/api';
export default class Data {
    private gatewayConfig;
    constructor(gatewayConfig: GatewayConfig);
    private getURLfromURI;
    private getUniqueHandle;
    private isEncodedAccount;
    isProfile(obj: any): obj is T_profile;
    getDefaultAccount(addr: T_addr): ArAccount;
    encode(profile: T_profile): ArAccountEncoded | null;
    decode(txid: T_txid | null, addr: T_addr, data: ArAccountEncoded): ArAccount;
}
