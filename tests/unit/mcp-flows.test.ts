import { describe, expect, it } from 'vitest';
import * as flow from '../../src/services/mcp-flows/schema.js';
import { assetListSchema } from '../../src/services/assets/schema.js';
import { businessIdSchema } from '../../src/utils/schema/common.js';

describe('mcp flow schemas', () => {
    it('exposes a schema for every compound flow', () => {
        const expected = [
            'neucronLoginSchema',
            'neucronOauthAuthorizeSchema',
            'neucronOauthExchangeTokenSchema',
            'neucronChooseEntitySchema',
            'neucronCreateBusinessSchema',
            'neucronListWalletsSchema',
            'neucronCreateWalletSchema',
            'neucronGetBalancesSchema',
            'neucronGetTransactionHistorySchema',
            'neucronExportTransactionHistorySchema',
            'neucronGetNotificationLogsSchema',
            'neucronCreateAppSchema',
            'neucronPublishAppSchema',
            'neucronBrowseAppstoreSchema',
            'neucronCreateCollectionLinkSchema',
            'neucronCustomerManageSchema',
            'neucronCreateInvoiceSchema',
            'neucronManageInvoicePaymentCollectionSchema',
            'neucronGetRevenueSchema',
            'neucronManageBillSchema',
            'neucronPayBillSchema',
            'neucronSchedulePaymentSchema',
            'neucronCreatePayoutSchema',
            'neucronGetPayoutHistorySchema',
            'neucronGetExpensesSchema',
            'neucronVendorManageSchema',
            'neucronInscribeDocumentSchema',
            'neucronInscribeTextSchema',
            'neucronInscribeTextArraySchema',
            'neucronCreateSecurityTokenSchema',
            'neucronCreateAsset21CustomerSchema',
            'neucronSecurityTokenOperationsSchema',
        ];
        for (const name of expected) {
            expect(flow[name as keyof typeof flow], name).toBeDefined();
        }
    });

    it('does not use z.unknown() or z.any() anywhere', () => {
        // Walk each schema's def tree; fail on explicit unknown/any field types.
        // Passthrough `catchall` nodes on pre-existing service schemas are ignored
        // (they mean "extra keys allowed", not an untyped declared field).
        const offenders: string[] = [];
        const walk = (node: unknown, path: string, parentKey?: string) => {
            if (!node || typeof node !== 'object') return;
            const record = node as Record<string, unknown>;
            const type = (record.def as Record<string, unknown> | undefined)?.type ?? record.type;
            if ((type === 'unknown' || type === 'any') && parentKey !== 'catchall') {
                offenders.push(path);
            }
            for (const [key, value] of Object.entries(record)) {
                if (key === 'pattern' || key === 'values' || key === 'catchall') continue;
                walk(value, `${path}.${key}`, key);
            }
        };
        for (const [name, schema] of Object.entries(flow)) {
            walk((schema as { _zod?: unknown })._zod ?? schema, name);
        }
        expect(offenders).toEqual([]);
    });

    it('treats an empty businessId string as omitted instead of failing validation', () => {
        expect(businessIdSchema.parse({ businessId: '' })).toEqual({ businessId: undefined });
        expect(businessIdSchema.parse({})).toEqual({ businessId: undefined });
        expect(businessIdSchema.parse({ businessId: 'biz_1' })).toEqual({ businessId: 'biz_1' });
    });

    it('allows asset list queries without a businessId', () => {
        expect(() => assetListSchema.parse({})).not.toThrow();
        expect(() => assetListSchema.parse({ businessId: '' })).not.toThrow();
    });

    it('applies pagination defaults on transaction history flows', () => {
        const parsed = flow.neucronGetTransactionHistorySchema.parse({ walletID: 'w1' });
        expect(parsed.page).toBe(1);
        expect(parsed.limit).toBe(25);
    });

    it('accepts base64 file content for document flows', () => {
        const parsed = flow.neucronInscribeDocumentSchema.parse({
            hashed: undefined,
            file: { fileBase64: Buffer.from('hello').toString('base64'), fileName: 'hello.txt' },
        });
        expect(parsed.file).toMatchObject({ fileName: 'hello.txt' });
    });

    it('routes customer manage actions through a discriminated union', () => {
        const parsed = flow.neucronCustomerManageSchema.parse({
            action: 'list',
            options: { businessId: 'biz_1', page: 1 },
        });
        expect(parsed.action).toBe('list');
        expect(() => flow.neucronCustomerManageSchema.parse({ action: 'nope', options: {} })).toThrow();
    });

    it('routes payout modes through a discriminated union', () => {
        const parsed = flow.neucronCreatePayoutSchema.parse({
            mode: 'transfer',
            options: {
                asset_id: 'asset_1',
                transfer_destinations: [{ email: 'a@b.com', amount: 1 }],
            },
        });
        expect(parsed.mode).toBe('transfer');
        expect(() => flow.neucronCreatePayoutSchema.parse({ mode: 'pay_vendor', options: {} })).toThrow();
    });

    it('exposes backend-supported direct vendor payout via payout vendor_id', () => {
        const parsed = flow.neucronCreatePayoutSchema.parse({
            mode: 'payout',
            trigger: true,
            options: {
                businessId: 'biz_1',
                payload: {
                    amount_in_fiat: 250,
                    asset_id: 'asset_1',
                    currency: 'USD',
                    vendor_id: 'vendor_1',
                    wallet_id: 'wallet_1',
                },
            },
        });

        expect(parsed.mode).toBe('payout');
        expect(parsed.options.payload.vendor_id).toBe('vendor_1');
    });
});
