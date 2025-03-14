import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps, PageProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
    /**
     * Path to the Edge view that will be used as the root view for Inertia responses
     */
    rootView: 'main',

    /**
     * Data that should be shared with all rendered pages
     */
    sharedData: {
        user: (ctx) => ctx.auth?.user,
        errors: (ctx) => ctx.inertia.always(() => ctx.session?.flashMessages.get('errors') || {}),
        errorsBag: (ctx) =>
            ctx.inertia.always(() => ctx.session?.flashMessages.get('errorsBag') || {}),
    },

    /**
     * Options for the server-side rendering
     */
    ssr: {
        enabled: true,
        entrypoint: 'inertia/app/ssr.tsx',
    },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
    export interface SharedProps extends InferSharedProps<typeof inertiaConfig>, PageProps {}
}
