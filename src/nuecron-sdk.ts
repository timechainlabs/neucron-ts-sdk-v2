import { Authentication } from './services/authentication';
import { Config } from './config';
import { Wallet } from './services/wallet';
import { Team } from './services/team';
import { Assets } from './services/assets';

export default class NeucronSDK {
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
