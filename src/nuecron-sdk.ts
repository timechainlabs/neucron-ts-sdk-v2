import { Authentication } from './services/authentication/index.js';
import type { Config } from './config.js';
import { Wallet } from './services/wallet/index.js';
import { Team } from './services/team/index.js';
import { Assets } from './services/assets/index.js';

export class NeucronSDK {
    readonly auth: Authentication;
    readonly wallet: Wallet;
    readonly team: Team;
    readonly assets: Assets;
    constructor(config?: Config) {
        this.auth = new Authentication(config);
        this.wallet = new Wallet(this.auth);
        this.team = new Team(this.auth);
        this.assets = new Assets(this.auth);
    }
}
