import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import react from '@vitejs/plugin-react'
import adonisjs from '@adonisjs/vite/client'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
    plugins: [
        inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.tsx' } }),
        react(),
        adonisjs({ entrypoints: ['inertia/app/app.tsx'], reload: ['resources/views/**/*.edge'] }),
    ],

    css: { postcss: { plugins: [tailwind(), autoprefixer()] } },

    /**
     * Define aliases for importing modules from
     * your frontend code
     */
    resolve: {
        alias: {
            '@/': `${getDirname(import.meta.url)}/inertia/`,
        },
    },

    server: {
        allowedHosts: ['admin.idm.test', 'idm.test', 'de27-105-113-61-231.ngrok-free.app'],
    },
})
