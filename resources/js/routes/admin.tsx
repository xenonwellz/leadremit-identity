import { RouteObject } from 'react-router-dom'
import VerificationSettings from '../pages/admin/VerificationSettings'

const adminRoutes: RouteObject[] = [
    {
        path: 'verification-settings',
        element: <VerificationSettings />,
    },
]

export default adminRoutes
