import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import env from '#start/env'

const AuthController = () => import('#controllers/auth_controller')
const AppController = () => import('#controllers/app_controller')
const AdminAuthController = () => import('#controllers/admin/auth_controller')
const AdminDashboardController = () => import('#controllers/admin/dashboard_controller')
const AdminUsersController = () => import('#controllers/admin/users_controller')
const AdminsController = () => import('#controllers/admin/admins_controller')
const SettingsController = () => import('#controllers/admin/settings_controller')

// User routes
router
    .group(() => {
        router.get('login', [AuthController, 'login'])
        router.get('register', [AuthController, 'register'])
        router.post('login', [AuthController, 'handleLogin'])
        router.post('register', [AuthController, 'handleRegister'])
    })
    .use(middleware.guest())

router
    .group(() => {
        router.get('', [AppController, 'dashboard'])
        router.get('verify', [AppController, 'verify'])
        router.get('tokens', [AppController, 'tokens'])
        router.get('history', [AppController, 'history'])
        router.get('settings', [AppController, 'settings'])
        router.post('settings/update', [AppController, 'updateSettings'])
        router.post('verify/bvn', [AppController, 'verifyBvn'])
        router.post('verify/nin', [AppController, 'verifyNin'])
        router.delete('logout', [AppController, 'logout'])
    })
    .use(middleware.auth())

// Admin routes with subdomain
router
    .group(() => {
        router.get('login', [AdminAuthController, 'login'])
        router.post('login', [AdminAuthController, 'handleLogin'])
    })
    .use(middleware.guest({ guards: ['admin'] }))
    .domain(`admin.${env.get('DOMAIN')}`)

router
    .group(() => {
        // Dashboard
        router.get('', [AdminDashboardController, 'index'])

        // Users management
        router.get('users', [AdminDashboardController, 'users'])
        router.get('users/:id', [AdminUsersController, 'show'])
        router.post('users/:id/toggle-suspension', [AdminUsersController, 'toggleSuspension'])
        router.post('users/:id/add-tokens', [AdminUsersController, 'addTokens'])
        router.get('verifications', [AdminDashboardController, 'verifications'])
        router.get('transactions', [AdminDashboardController, 'transactions'])

        // Admin management
        router
            .group(() => {
                router.get('/', [AdminsController, 'index']).as('admin.admins.index')
                router.get('/create', [AdminsController, 'create']).as('admin.admins.create')
                router.post('/', [AdminsController, 'store']).as('admin.admins.store')
                router.get('/:id', [AdminsController, 'show']).as('admin.admins.show')
                router.get('/:id/edit', [AdminsController, 'edit']).as('admin.admins.edit')
                router.put('/:id', [AdminsController, 'update']).as('admin.admins.update')
                router.delete('/:id', [AdminsController, 'destroy']).as('admin.admins.destroy')
            })
            .prefix('admins')

        router.delete('logout', [AdminAuthController, 'logout'])

        // Settings routes
        router.get('/settings', [SettingsController, 'index'])
        router.post('/settings', [SettingsController, 'updatePassword'])
    })
    .use(middleware.admin({ guards: ['admin'] }))
    .domain(`admin.${env.get('DOMAIN')}`)
