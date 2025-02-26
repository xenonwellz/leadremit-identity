/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { Toaster } from '@/components/ui/sonner'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
    progress: { color: '#5468FF' },

    title: () => `${appName}`,

    resolve: (name) => {
        return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'))
    },

    setup({ el, App, props }) {
        const app = (
            <>
                <App {...props} />
                <Toaster richColors />
            </>
        )
        hydrateRoot(el, app)
    },
})
