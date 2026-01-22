# Project Overview

This is a web application for **CC Rentals**, a company that appears to manage and lease assets, likely camera and production equipment. It's built as a single-page application using a modern frontend stack.

- **Frontend Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Backend/Database:** Supabase (inferred from `vite.config.ts` and `package.json`)
- **Testing:** Vitest and React Testing Library

The application features a sophisticated user interface for tracking asset utilization, managing returns, and viewing detailed audit logs for each piece of equipment.

# Building and Running

## Prerequisites

- Node.js and npm (or a compatible package manager)
- A Supabase project with the required environment variables.

## Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file in the root of the project and add the following variables:

    ```
    VITE_SUPABASE_URL=your-supabase-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```
    *Note: These are required to connect to the Supabase backend.*

## Key Commands

- **Run in development mode:**
  ```bash
  npm run dev
  ```
  This will start the Vite development server, typically at `http://localhost:3000`.

- **Build for production:**
  ```bash
  npm run build
  ```
  This command bundles the application into the `dist/` directory, optimized for deployment.

- **Run tests:**
  ```bash
  npm run test
  ```
  This executes the test suite using Vitest.

- **Lint the code:**
  ```bash
  npm run lint
  ```
  This command checks the codebase for style and syntax errors using ESLint.

# Development Conventions

- **Component-Based Architecture:** The project is structured around React components, located in the `components/` directory.
- **Styling:** Utility-first styling is handled by Tailwind CSS. Custom theme configurations can be found in `tailwind.config.js`.
- **State Management:** Local component state is managed with React hooks (`useState`, `useEffect`).
- **File Naming:** Components use PascalCase (e.g., `BookingCalendar.tsx`), while other files use camelCase or kebab-case.
- **Testing:** Tests are co-located with the components they test (e.g., `components/__tests__/`).
- **Modularity:** The application is broken down into modules for hooks, libraries, and API interactions.
