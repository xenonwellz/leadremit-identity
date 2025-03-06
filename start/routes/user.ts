import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const VerificationsController = () => import('#controllers/verifications_controller')
const TokensController = () => import('#controllers/tokens_controller')
const UserSettingsController = () => import('#controllers/user_settings_controller')

// User routes
router
    .group(() => {
        router.get('login', [AuthController, 'login'])
        router.get('register', [AuthController, 'register'])
        router.post('login', [AuthController, 'handleLogin'])
        router.post('register', [AuthController, 'handleRegister'])
        router.post('tokens/webhook', [TokensController, 'webhook'])
    })
    .use(middleware.guest())

router
    .group(() => {
        // Dashboard
        router.get('', [DashboardController, 'index'])

        // Verifications
        router.get('verify', [VerificationsController, 'show'])
        router.post('verify', [VerificationsController, 'verify'])
        router.get('history', [VerificationsController, 'history'])

        // Tokens
        router.get('tokens', [TokensController, 'index'])
        router.post('tokens/purchase', [TokensController, 'purchase'])

        // Settings
        router.get('settings', [UserSettingsController, 'show'])
        router.post('settings/update', [UserSettingsController, 'update'])

        // Auth
        router.delete('logout', [AuthController, 'handleLogout'])
    })
    .use(middleware.auth())
