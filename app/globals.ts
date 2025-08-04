import { get } from "http"

export const endpoints = {
    user: {
        get: (process.env.API_URL ?? '') + (process.env.USER_ENDPOINT ?? ''),
        getAll: (process.env.API_URL ?? '') + (process.env.ALL_USER_ENDPOINT ?? ''),
        create: (process.env.API_URL ?? '') + (process.env.CREATE_USER_ENDPOINT ?? ''),
        update: (process.env.API_URL ?? '') + (process.env.UPDATE_USER_ENDPOINT ?? ''),
        delete: (process.env.API_URL ?? '') + (process.env.DELETE_USER_ENDPOINT ?? ''),
        getPermissions: (process.env.API_URL ?? '') + (process.env.GET_USER_PERMISSIONS_ENDPOINT ?? ''),
    },
    authentication: {
        login: (process.env.API_URL ?? '') + (process.env.LOGIN_ENDPOINT ?? ''),
        verify: (process.env.API_URL ?? '') + (process.env.VERIFY_USER_ENDPOINT ?? ''),
    },
    products: {
        get: (process.env.API_URL ?? '') + (process.env.PRODUCT_ENDPOINT ?? ''),
        getAll: (process.env.API_URL ?? '') + (process.env.ALL_PRODUCT_ENDPOINT ?? ''),
        count: (process.env.API_URL ?? '') + (process.env.PRODUCT_COUNT_ENDPOINT ?? ''),
    },
    role: {
        get: (process.env.API_URL ?? '') + (process.env.ROLE_ENDPOINT ?? ''),
        getAll: (process.env.API_URL ?? '') + (process.env.ALL_ROLE_ENDPOINT ?? ''),
        create: (process.env.API_URL ?? '') + (process.env.CREATE_ROLE_ENDPOINT ?? ''),
        update: (process.env.API_URL ?? '') + (process.env.UPDATE_ROLE_ENDPOINT ?? ''),
        delete: (process.env.API_URL ?? '') + (process.env.DELETE_ROLE_ENDPOINT ?? ''),
    },
    permission: {
        get: (process.env.API_URL ?? '') + (process.env.PERMISSION_ENDPOINT ?? ''),
        getAll: (process.env.API_URL ?? '') + (process.env.ALL_PERMISSION_ENDPOINT ?? ''),
        create: (process.env.API_URL ?? '') + (process.env.CREATE_PERMISSION_ENDPOINT ?? ''),
        update: (process.env.API_URL ?? '') + (process.env.UPDATE_PERMISSION_ENDPOINT ?? ''),
        delete: (process.env.API_URL ?? '') + (process.env.DELETE_PERMISSION_ENDPOINT ?? ''),
    },
    statistics: {
        get: (process.env.API_URL ?? '') + (process.env.STATISTICS_ENDPOINT ?? ''),
        getAll: (process.env.API_URL ?? '') + (process.env.ALL_STATISTICS_ENDPOINT ?? ''),
        create: (process.env.API_URL ?? '') + (process.env.CREATE_STATISTICS_ENDPOINT ?? ''),
        delete: (process.env.API_URL ?? '') + (process.env.DELETE_STATISTICS_ENDPOINT ?? ''),
    }
}

export const keys = {
    session: {
        user: {
            id: "userId",
            username: "userUsername",
            name: "userName",
            email: "userEmail",
            roles: "userRoles",
            permissions: "userPermissions",
        }
    }
}