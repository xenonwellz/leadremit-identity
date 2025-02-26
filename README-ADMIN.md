# Admin Functionality Setup

This document provides instructions for setting up and using the admin functionality in the application.

## Features

- Admin authentication with separate session guard
- Domain-based routing for admin pages
- User management (view, suspend/activate, add tokens)
- Verification management
- Transaction management
- Dashboard with statistics

## Setup Instructions

### 1. Run the Migration

Run the migration to create the admins table:

```bash
node ace migration:run
```

### 2. Create an Admin User

Use the provided command to create an admin user:

```bash
node ace create:admin admin@example.com "Admin Name" password123
```

You can also specify a role (default is 'admin'):

```bash
node ace create:admin admin@example.com "Admin Name" password123 --role=super_admin
```

### 3. Configure Domain

Make sure your domain configuration is set up correctly for the admin subdomain. 

In your `.env` file, set the `DOMAIN` variable:

```
DOMAIN=yourdomain.com
```

This will allow the admin interface to be accessed at `admin.yourdomain.com`.

For local development, you can add an entry to your hosts file:

```
127.0.0.1 admin.localhost
```

And then access the admin interface at `http://admin.localhost:3333`.

## Admin Routes

The following routes are available in the admin interface:

- `/login` - Admin login page
- `/dashboard` - Admin dashboard
- `/users` - User management
- `/users/:id` - User details
- `/verifications` - Verification management
- `/transactions` - Transaction management

## Admin API

The following API endpoints are available for admin actions:

- `POST /users/:id/toggle-suspension` - Toggle user suspension status
- `POST /users/:id/add-tokens` - Add tokens to user balance
- `DELETE /logout` - Admin logout

## Security Considerations

- Admin routes are protected by the admin middleware
- Admin authentication uses a separate session guard
- Admin routes are only accessible through the admin subdomain 
