import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Admin from '#models/admin'
import { createAdminValidator, updateAdminValidator } from '#validators/admin/admins'
import { adminRoutes } from '#shared/routes'

@inject()
export default class AdminsController {
    /**
     * Display list of admins
     */
    async index({ inertia, auth, request }: HttpContext) {
        const currentAdmin = auth.use('admin').user!
        const page = request.input('page', 1)
        const perPage = 10

        const admins = await Admin.query().orderBy('created_at', 'desc').paginate(page, perPage)

        return inertia.render('admin/admins/index', {
            title: 'Manage Administrators',
            admins: admins.all(),
            currentAdmin,
            pagination: {
                currentPage: admins.currentPage,
                totalPages: Math.ceil(admins.total / perPage),
                perPage,
                total: admins.total,
            },
        })
    }

    /**
     * Display form to create a new admin
     */
    async create({ inertia }: HttpContext) {
        return inertia.render('admin/admins/create', {
            title: 'Create Administrator',
        })
    }

    /**
     * Store a new admin
     */
    async store({ request, response, session }: HttpContext) {
        // Validate input
        const payload = await request.validateUsing(createAdminValidator)

        // Check if admin already exists
        const existingAdmin = await Admin.findBy('email', payload.email)
        if (existingAdmin) {
            session.flash('error', `Admin with email ${payload.email} already exists`)
            return response.redirect().back()
        }

        // Create admin
        await Admin.create({
            email: payload.email,
            fullName: payload.fullName,
            password: payload.password,
            role: payload.role || 'admin',
        })

        session.flash('success', 'Administrator created successfully')
        return response.redirect().toPath(adminRoutes.app.admins)
    }

    /**
     * Display admin details
     */
    async show({ inertia, params, auth }: HttpContext) {
        const currentAdmin = auth.use('admin').user!
        const admin = await Admin.findOrFail(params.id)

        return inertia.render('admin/admins/show', {
            title: `Admin: ${admin.fullName}`,
            admin,
            currentAdmin,
        })
    }

    /**
     * Display form to edit an admin
     */
    async edit({ inertia, params, auth }: HttpContext) {
        const currentAdmin = auth.use('admin').user!
        const admin = await Admin.findOrFail(params.id)

        return inertia.render('admin/admins/edit', {
            title: `Edit Admin: ${admin.fullName}`,
            admin,
            currentAdmin,
        })
    }

    /**
     * Update an admin
     */
    async update({ request, params, response, session, auth }: HttpContext) {
        const currentAdmin = auth.use('admin').user!
        const admin = await Admin.findOrFail(params.id)

        // Prevent super admins from being edited by regular admins
        if (admin.role === 'super_admin' && currentAdmin.role !== 'super_admin') {
            session.flash('error', 'You do not have permission to edit a super admin')
            return response.redirect().back()
        }

        // Validate input
        const payload = await request.validateUsing(updateAdminValidator)

        // Update admin
        admin.fullName = payload.fullName

        // Only update email if it changed
        if (payload.email !== admin.email) {
            const existingAdmin = await Admin.findBy('email', payload.email)
            if (existingAdmin && existingAdmin.id !== admin.id) {
                session.flash('error', `Admin with email ${payload.email} already exists`)
                return response.redirect().back()
            }
            admin.email = payload.email
        }

        // Update password if provided
        if (payload.password) {
            admin.password = payload.password
        }

        // Only super admins can change roles
        if (currentAdmin.role === 'super_admin' && payload.role) {
            admin.role = payload.role
        }

        await admin.save()

        session.flash('success', 'Administrator updated successfully')
        return response.redirect().toPath(`${adminRoutes.app.admins}/${admin.id}`)
    }

    /**
     * Delete an admin
     */
    async destroy({ params, response, session, auth }: HttpContext) {
        const currentAdmin = auth.use('admin').user!
        const admin = await Admin.findOrFail(params.id)

        // Prevent admins from deleting themselves
        if (admin.id === currentAdmin.id) {
            session.flash('error', 'You cannot delete your own account')
            return response.redirect().back()
        }

        // Prevent regular admins from deleting super admins
        if (admin.role === 'super_admin' && currentAdmin.role !== 'super_admin') {
            session.flash('error', 'You do not have permission to delete a super admin')
            return response.redirect().back()
        }

        await admin.delete()

        session.flash('success', 'Administrator deleted successfully')
        return response.redirect().toPath(adminRoutes.app.admins)
    }
}
