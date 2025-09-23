import { Authentication } from './services/authentication/index.js';
import type { Config } from './config.js';
import { Wallet } from './services/wallet/index.js';
import { Team } from './services/team/index.js';
import { Assets } from './services/assets/index.js';
import { Utility } from './services/utility/index.js';
import { DataIntegrity } from './services/data-integrity/index.js';
import { Pay } from './services/pay/index.js';

export class NeucronSDK {
    readonly auth: Authentication;
    readonly wallet: Wallet;
    readonly dataIntegrity: DataIntegrity;
    readonly team: Team;
    readonly assets: Assets;
    readonly utility: Utility;
    readonly pay: Pay;

    constructor(config?: Config) {
        this.auth = new Authentication(config);
        this.wallet = new Wallet(this.auth);
        this.team = new Team(this.auth);
        this.dataIntegrity = new DataIntegrity(this.auth);
        this.assets = new Assets(this.auth);
        this.utility = new Utility(this.auth);
        this.pay = new Pay(this.auth);
    }
}
