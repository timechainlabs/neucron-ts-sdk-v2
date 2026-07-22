import type { HttpResponse, QueryParams, IHttpClient } from '../../utils/http/types.js';
import type {
    CreateWalletBody,
    CreateBSVWalletBody,
    CreateWalletReponse,
    UpdateDefaultWalletBody,
    UpdateDefaultWalletResponse,
    WalletListResponse,
    WalletAddressBody,
    CreateAddressResponse,
    WalletAddressListResponse,
    SyncAsset,
    SyncAssetResponse,
    AvailableAssets,
    AvailableAssetsResponse,
    WalletAssetAction,
    RecoverWallet,
    Transactions,
    TransactionsResponse,
    TransactionDetails,
    TransactionDetailsResponse,
    ImportAsset,
    ImportAssetResponse,
} from './types.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';

export class Wallet {
    private readonly validator: Validator;
    private readonly httpClient: IHttpClient;
    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = auth.getHttpClient();
    }

    async createWallet(options: CreateWalletBody): Promise<HttpResponse<CreateWalletReponse>> {
        try {
            this.auth.validate();
            this.validator.createWallet(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = {
                walletName: options.walletName,
                paymailName: options.paymailName ?? options.walletName,
                walletType: options.walletType,
                custodianProvider: options.custodianProvider,
                customCustodianEndpoint: options.customCustodianEndpoint,
                provider: options.provider,
            };
            const resp = await this.httpClient.post<CreateWalletReponse>(Routes.WALLET.CREATE, {}, headers, params);
            this.validator.createWalletResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async createBSVWallet(options: CreateBSVWalletBody): Promise<HttpResponse<CreateWalletReponse>> {
        try {
            this.auth.validate();
            this.validator.createBSVWallet(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = {
                walletName: options.walletName,
                paymailName: options.walletName,
            };
            const resp = await this.httpClient.post<CreateWalletReponse>(Routes.WALLET.CREATE, {}, headers, params);
            this.validator.createWalletResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async walletList(options?: { businessId?: string }): Promise<HttpResponse<WalletListResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const resp = await this.httpClient.get<WalletListResponse>(Routes.WALLET.LIST, headers);
            this.validator.walletListResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async updateDefaultWallet(options: UpdateDefaultWalletBody): Promise<HttpResponse<UpdateDefaultWalletResponse>> {
        try {
            this.auth.validate();
            this.validator.updateDefaultWallet(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { walletID: options.walletID };
            const resp = await this.httpClient.put<UpdateDefaultWalletResponse>(
                Routes.WALLET.UPDATE_DEFAULT,
                null,
                headers,
                params
            );
            this.validator.updateDefaultWalletResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async createAddress(options: WalletAddressBody): Promise<HttpResponse<CreateAddressResponse>> {
        try {
            this.auth.validate();
            this.validator.walletAddress(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { walletID: options.walletID };
            const resp = await this.httpClient.post<CreateAddressResponse>(
                Routes.WALLET.ADDRESS_CREATE,
                null,
                headers,
                params
            );
            this.validator.createAddressResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async walletAddressList(options?: WalletAddressBody): Promise<HttpResponse<WalletAddressListResponse>> {
        try {
            this.auth.validate();
            if (options) this.validator.walletAddress(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const params: QueryParams = {
                walletID: options?.walletID,
                network: options?.network,
            };
            const resp = await this.httpClient.get<WalletAddressListResponse>(
                Routes.WALLET.ADDRESS_LIST,
                headers,
                params
            );
            this.validator.walletAddressListResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async syncAsset(options: SyncAsset): Promise<HttpResponse<SyncAssetResponse>> {
        try {
            this.auth.validate();
            this.validator.syncAsset(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { walletID: options.walletID, network: options.network };
            const resp = await this.httpClient.post<SyncAssetResponse>(Routes.WALLET.SYNC, {}, headers, params);
            this.validator.syncAssetResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getAvailableAssets(options?: AvailableAssets): Promise<HttpResponse<AvailableAssetsResponse>> {
        try {
            this.auth.validate();
            this.validator.availableAssets(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const params: QueryParams = {
                offset: options?.offset,
                limit: options?.limit,
                walletID: options?.walletID,
                search: options?.search,
                chain: options?.chain === 'All' ? undefined : options?.chain,
                network: options?.network,
            };
            const resp = await this.httpClient.get<AvailableAssetsResponse>(Routes.WALLET.ASSETS, headers, params);
            this.validator.availableAssetsResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async addAssetToWallet(options: WalletAssetAction): Promise<HttpResponse<UpdateDefaultWalletResponse>> {
        try {
            this.auth.validate();
            this.validator.walletAssetAction(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { walletID: options.walletID, assetID: options.assetID };
            const resp = await this.httpClient.post<UpdateDefaultWalletResponse>(
                Routes.WALLET.ASSET_ADD,
                null,
                headers,
                params
            );
            this.validator.updateDefaultWalletResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async removeAssetFromWallet(options: WalletAssetAction): Promise<HttpResponse<UpdateDefaultWalletResponse>> {
        try {
            this.auth.validate();
            this.validator.walletAssetAction(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { walletID: options.walletID, assetID: options.assetID };
            const resp = await this.httpClient.delete<UpdateDefaultWalletResponse>(
                Routes.WALLET.ASSET_REMOVE,
                headers,
                params
            );
            this.validator.updateDefaultWalletResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async recoverWallet(options: RecoverWallet): Promise<HttpResponse<UpdateDefaultWalletResponse>> {
        try {
            this.auth.validate();
            this.validator.recoverWallet(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { walletID: options.walletID };
            const resp = await this.httpClient.post<UpdateDefaultWalletResponse>(
                Routes.WALLET.RECOVER,
                { keyshard: options.keyshard },
                headers,
                params
            );
            this.validator.updateDefaultWalletResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getTransactions(options: Transactions): Promise<HttpResponse<TransactionsResponse>> {
        try {
            this.auth.validate();
            this.validator.transactions(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = {
                walletID: options.walletID,
                page: options.page,
                limit: options.limit,
                chain: options.chain,
                network: options.network,
            };
            const resp = await this.httpClient.get<TransactionsResponse>(Routes.WALLET.HISTORY, headers, params);
            this.validator.transactionsResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getTransactionDetails(options: TransactionDetails): Promise<HttpResponse<TransactionDetailsResponse>> {
        try {
            this.auth.validate();
            this.validator.transactionDetails(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = {
                txid: options.txid,
                chain: options.chain,
                network: options.network,
                walletID: options.walletID,
            };
            const resp = await this.httpClient.get<TransactionDetailsResponse>(
                Routes.WALLET.TRANSACTION,
                headers,
                params
            );
            this.validator.transactionDetailsResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async importAsset(options: ImportAsset): Promise<HttpResponse<ImportAssetResponse>> {
        try {
            this.auth.validate();
            this.validator.importAsset(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const payload = {
                asset_name: options.asset_name,
                chain: options.chain,
                contract_address: options.contract_address,
                network: options.network,
                symbol: options.symbol,
                wallet_id: options.wallet_id,
                decimals: options.decimals,
            };
            const resp = await this.httpClient.post<ImportAssetResponse>(Routes.WALLET.ASSET_IMPORT, payload, headers);
            this.validator.importAssetResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
