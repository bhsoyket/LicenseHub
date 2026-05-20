# LicenseHub

Centralized software license management platform. Manage products, customers, licenses, and payments from a single dashboard.

## Features

### Core
- **Dashboard** — Key metrics, license growth chart, daily activations, recent activity
- **Products** — Create/manage products with auto-generated API keys and webhook URLs
- **Feature Flags** — Per-product feature flag management (create, edit, delete)
- **Customers** — Customer management with suspend, license assignment
- **Packages** — Product-grouped package cards with pricing (free trial, basic, standard, custom)
- **Licenses** — Full license lifecycle with package selector, auto-expiry (monthly/yearly/lifetime), currency, activation tracking
- **License Detail** — Package badge, amount, validations, activations table

### Payments
- **Card Payment** — Mock card form, auto-approved on submit
- **Custom Payment** — Custom amount + transaction ID, requires admin approval
- **Payment Approval** — Admin panel to approve/reject pending payments

### System
- **API Console** — Interactive API docs with cURL examples (validate, activate, deactivate)
- **Activity Logs** — Searchable event history across the platform
- **Settings** — Company profile, API key management, security settings
- **Authentication** — Login / Register / Reset password (mock)
- **Theme** — Dark/light mode with system preference detection

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **UI**: shadcn/ui-style components (custom)
- **Charts**: Recharts
- **Routing**: React Router v6
- **Data**: Mock API (JSON/local state, no backend required)

## Getting Started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/`.

## Login

| Email | Password |
|-------|----------|
| john@licensehub.io | password |

## Build

```bash
npx vite build
```

Output in `dist/`.
