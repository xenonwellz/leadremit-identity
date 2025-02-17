import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const AppController = () => import('#controllers/app_controller')

router
    .group(() => {
        router.get('login', [AuthController, 'login'] as any)
        router.get('register', [AuthController, 'register'] as any)
        router.post('login', [AuthController, 'handleLogin'] as any)
        router.post('register', [AuthController, 'handleRegister'] as any)
    })
    .use(middleware.guest())

router
    .group(() => {
        router.get('', [AppController, 'dashboard'] as any)
        router.get('verify', [AppController, 'verify'] as any)
        router.get('tokens', [AppController, 'tokens'] as any)
        router.get('history', [AppController, 'history'] as any)
        router.get('settings', [AppController, 'settings'] as any)
        router.post('settings/update', [AppController, 'updateSettings'] as any)
        router.post('verify/bvn', [AppController, 'verifyBvn'] as any)
        router.post('verify/nin', [AppController, 'verifyNin'] as any)
        router.delete('logout', [AppController, 'logout'] as any)
    })
    .use(middleware.auth())
