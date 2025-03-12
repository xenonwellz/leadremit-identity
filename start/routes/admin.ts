import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import env from '#start/env'

const AdminAuthController = () => import('#controllers/admin/auth_controller')
const AdminDashboardController = () => import('#controllers/admin/dashboard_controller')
const AdminUsersController = () => import('#controllers/admin/users_controller')
const AdminsController = () => import('#controllers/admin/admins_controller')
const SettingsController = () => import('#controllers/admin/settings_controller')
const VerificationSettingsController = () =>
    import('#controllers/admin/verification_settings_controller')

// Admin routes with subdomain
router
    .group(() => {
        router.get('login', [AdminAuthController, 'login'])
        router.post('login', [AdminAuthController, 'handleLogin'])
    })
    .use(middleware.guest({ guards: ['admin'] }))
    .domain(env.get('ADMIN_DOMAIN'))

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

        // Verification Settings Routes
        router
            .group(() => {
                router.get('/', [VerificationSettingsController, 'index'])
                router.put('/:id', [VerificationSettingsController, 'update'])
            })
            .prefix('verification-settings')

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
    .domain(env.get('ADMIN_DOMAIN'))
