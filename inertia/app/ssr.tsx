import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import { Toaster } from '@/components/ui/sonner'

export default function render(page: any) {
    return createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        resolve: (name) => {
            const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
            return pages[`../pages/${name}.tsx`]
        },
        setup: ({ App, props }) => (
            // <main>
            // </main>
            // {/* <Toaster richColors /> */}
            <App {...props} />
        ),
    })
}
