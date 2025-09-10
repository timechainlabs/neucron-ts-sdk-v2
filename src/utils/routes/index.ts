export const Routes = {
    AUTH: {
        LOGIN: '/auth/login',
        SIGNUP: '/auth/signup',
    },
    ASSET: {
        REGISTER: '/asset/register',
        UPDATE: '/asset/update',
        MINT: '/asset/mint',
        TRANSFER: '/asset/transfer',
        MERGE: '/asset/merge',
        REDEEM: '/asset/redeem',
        LEDGERLIST: '/asset/ledgerlist',
        ASSETLIST: '/asset/assetlist',
    },
    WALLET: {
        CREATE: '/wallet/create',
        UPDATE_DEFAULT: '/wallet/default',
        LIST: '/wallet/list',
        ADDRESS_CREATE: '/wallet/address/create',
        ADDRESS_LIST: '/wallet/addresses',
    },
    PAYMAIL: {
        CREATE: '/paymail/create',
        LIST: '/paymail/list',
        UPDATE_DEFAULT: '/paymail/default',
        DELETE: '/paymail/delete',
    },
    PAY: {
        ADDRESS: '/pay/address',
        EMAIL: '/pay/email',
        PAYMAIL: '/pay/paymail',
    },
    TEAM: {
        LIST: '/team/list',
        MEMBERS: '/team/members',
    },
} as const;
