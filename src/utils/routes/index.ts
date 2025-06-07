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
        LIST: '/wallet/list',
        PAYMAIL_CREATE: '/wallet/paymail/create',
        PAYMAIL_LIST: '/wallet/paymail/list',
    },

    TEAM: {
        LIST: '/team/list',
        MEMBERS: '/team/members',
    },
} as const;
