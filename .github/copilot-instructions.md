# Copilot Instructions for HomeEase Project

Welcome to the HomeEase codebase! This document provides essential guidance for AI coding agents to be productive in this project. It outlines the architecture, workflows, conventions, and integration points specific to this repository.

---

## Project Overview

HomeEase is a Node.js-based web application designed for basic apartment management. The application includes the following key features:
- **Resident Management**: Manage resident information.
- **Invoice Management**: Generate and track monthly invoices.
- **Maintenance Requests**: Allow residents to submit maintenance requests.
- **Notifications**: Send announcements to residents.

### Key Technologies:
- **Backend**: Express.js, Prisma ORM, PostgreSQL
- **Frontend**: EJS (Template Engine), TailwindCSS, Vanilla JavaScript
- **Development Tools**: Nodemon, dotenv, morgan, helmet, cors

---

## Codebase Structure

The project follows a modular structure for scalability and maintainability:

```
homeease/
├── controllers/       # Business logic for routes
├── routes/            # Route definitions
├── views/             # EJS templates for frontend
├── public/            # Static assets (CSS, JS, images)
├── prisma/            # Prisma schema and migrations
├── .env               # Environment variables
├── app.js             # Main entry point
└── package.json       # Project metadata and dependencies
```

### Key Files:
- **`app.js`**: Initializes the Express app, applies middleware, and sets up routes.
- **`routes/`**: Contains route handlers (e.g., `home.js`, `resident.js`, `invoice.js`).
- **`controllers/`**: Implements the logic for each route.
- **`prisma/schema.prisma`**: Defines the database schema.

---

## Developer Workflows

### Running the Application
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server with Nodemon:
   ```bash
   npm run dev
   ```
3. Access the application at `http://localhost:3000`.

### Database Migrations
1. Modify the schema in `prisma/schema.prisma`.
2. Run the migration:
   ```bash
   npx prisma migrate dev --name <migration_name>
   ```
3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

### Debugging
- Use `console.log` for quick debugging.
- Check HTTP request logs via `morgan` middleware.
- Ensure `.env` is correctly configured for database and server settings.

---

## Project-Specific Conventions

### Middleware
- Middleware is centralized in `middlewares.js` and applied globally in `app.js`.
- Common middleware includes `morgan`, `cors`, `helmet`, `express.json`, and `express.urlencoded`.

### Route and Controller Patterns
- Routes are defined in `routes/` and delegate logic to controllers in `controllers/`.
- Example:
  - **Route**: `routes/resident.js`
  - **Controller**: `controllers/residentController.js`

### Environment Variables
- Stored in `.env` and loaded using `dotenv`.
- Example variables:
  ```plaintext
  PORT=3000
  DATABASE_URL=postgresql://username:password@localhost:5432/homeease
  ```

---

## Integration Points

### Database
- **PostgreSQL**: Used for persistent data storage.
- **Prisma ORM**: Manages database schema and queries.

### Frontend
- **EJS Templates**: Render dynamic HTML pages.
- **Static Assets**: Served from the `public/` directory.

---

## Notes for AI Agents
- Follow the modular structure to maintain separation of concerns.
- Use Prisma for all database interactions.
- Ensure middleware is applied globally in `app.js`.
- Adhere to the existing route-controller pattern.

---

If you have any questions or need clarification, feel free to ask!