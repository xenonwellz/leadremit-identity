export const appRoutes = {
    auth: {
        login: '/login',
        register: '/register',
    },
    app: {
        home: '/',
        verify: '/verify',
        logout: '/logout',
    },
}

export const adminRoutes = {
    auth: {
        login: '/login',
    },
    app: {
        dashboard: '/',
        users: '/users',
        verifications: '/verifications',
        transactions: '/transactions',
        admins: '/admins',
        logout: '/logout',
        settings: '/settings',
    },
}
