export const endpoints = {
    user: {
        get: (process.env.API_URL ?? '') + (process.env.USER_ENDPOINT ?? ''),
        create: (process.env.API_URL ?? '') + (process.env.CREATE_USER_ENDPOINT ?? ''),
        update: (process.env.API_URL ?? '') + (process.env.UPDATE_USER_ENDPOINT ?? ''),
        delete: (process.env.API_URL ?? '') + (process.env.DELETE_USER_ENDPOINT ?? ''),
    },
    authentication: {
        login: (process.env.API_URL ?? '') + (process.env.LOGIN_ENDPOINT ?? ''),
        verify: (process.env.API_URL ?? '') + (process.env.VERIFY_USER_ENDPOINT ?? ''),
    },
    products: {
        get: (process.env.API_URL ?? '') + (process.env.PRODUCT_ENDPOINT ?? ''),
        getByEan: (process.env.API_URL ?? '') + (process.env.PRODUCT_EAN_ENDPOINT ?? ''),
        count: (process.env.API_URL ?? '') + (process.env.PRODUCT_COUNT_ENDPOINT ?? ''),
    },
}