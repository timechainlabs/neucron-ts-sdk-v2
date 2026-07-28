import type { Headers, HttpResponse, IHttpClient, QueryParams } from '../../utils/http/types.js';
import type { PayRequest, PayResponse, PayRequestInput } from './types.js';
import { Authentication } from '../authentication/index.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import { ASSET_IDS } from '../../utils/constants/asset.js';

export class Pay {
    private readonly validator: Validator;
    private readonly httpClient: IHttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = auth.getHttpClient();
    }

    private async executePayment(
        options: PayRequestInput,
        validateFn: (v: Validator, o: PayRequest) => void
    ): Promise<HttpResponse<PayResponse>> {
        try {
            this.auth.validate();

            const asset_id = options.asset_id ?? (options.assetName ? ASSET_IDS[options.assetName] : undefined);
            if (!asset_id) {
                if (options.assetName) {
                    throw new Error(`Unsupported asset: ${options.assetName}`);
                }
                throw new Error('Provide asset_id (or a supported assetName).');
            }

            const normalizedOptions: PayRequest = {
                walletID: options.walletID,
                asset_id,
                transfer_destinations: options.transfer_destinations,
            };

            validateFn(this.validator, normalizedOptions);

            const reqPath = Routes.ASSET.TRANSFER;

            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };

            const params: QueryParams = {
                walletID: options.walletID,
            };

            const payload = {
                asset_id: normalizedOptions.asset_id,
                transfer_destinations: normalizedOptions.transfer_destinations,
            };

            const res = await this.httpClient.post<PayResponse>(reqPath, payload, headers, params);

            this.validator.payResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }

    async payWithAddress(options: PayRequestInput): Promise<HttpResponse<PayResponse>> {
        return this.executePayment(options, (v, o) => v.payWithAddress(o));
    }

    async payWithEmail(options: PayRequestInput): Promise<HttpResponse<PayResponse>> {
        return this.executePayment(options, (v, o) => v.payWithEmail(o));
    }

    async payWithPaymail(options: PayRequestInput): Promise<HttpResponse<PayResponse>> {
        return this.executePayment(options, (v, o) => v.payWithPaymail(o));
    }
}
