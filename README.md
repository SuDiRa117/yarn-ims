# Yarn IMS — Inventory Management System

A full-stack web application for managing yarn inventory — tracking received, issued, rejected, and QC yarn with real-time stock visibility, analytics, and audit trails.

**Live App:** [https://yarn-ims-production.up.railway.app](https://yarn-ims-production.up.railway.app)

---

## Features

- **Data Entry** — Log received, issued, rejected, and QC yarn with lot-level tracking
- **Stock View** — Real-time inventory table with search, filters, and pagination
- **Dashboard** — KPI cards and charts for status and style distribution
- **Reports** — Audit logs, Excel and PDF export
- **Auth** — JWT-based login with role-based access (admin / operator / viewer)
- **Mobile Responsive** — Works on phone, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Zustand, Recharts, Axios |
| Backend | Node.js, Express.js |
| Database | SQLite (via better-sqlite3) |
| Auth | JWT |
| Hosting | Railway |

---

## Project Structure

```
ims/
├── backend/
│   ├── migrations/        # Schema creation & seed
│   ├── src/
│   │   ├── config/        # SQLite database connection
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth & error handling
│   │   ├── models/        # User, InventoryItem, AuditLog
│   │   ├── routes/        # auth, inventory, reports
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Header (with mobile nav)
│   │   ├── pages/         # Login, Dashboard, DataEntry, StockView, Reports
│   │   ├── services/      # Axios API client
│   │   ├── store/         # Zustand state (auth, inventory)
│   │   └── styles/        # CSS per page
│   └── package.json
├── railway.json
└── package.json
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Create user |
| GET | `/api/auth/users` | List users (auth required) |

### Inventory
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/inventory/received` | Add received yarn |
| GET | `/api/inventory/received` | List received yarn |
| POST | `/api/inventory/issued` | Issue yarn |
| POST | `/api/inventory/rejected` | Reject yarn |
| POST | `/api/inventory/qc` | Create QC record |
| PUT | `/api/inventory/qc/:id` | Update QC status |
| GET | `/api/inventory/status` | Stock status with balances |
| GET | `/api/inventory/search` | Search & filter inventory |
| GET | `/api/inventory/analytics` | Analytics data |

### Reports
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/audit-logs` | Audit trail (admin only) |
| GET | `/api/reports/export/excel` | Export Excel |
| GET | `/api/reports/export/pdf` | Export PDF |

---

## Local Development

**Requirements:** Node.js 18+

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Configure backend environment
cp backend/.env.example backend/.env
# Edit backend/.env — set JWT_SECRET and JWT_EXPIRE=7d

# Start backend (port 5001)
cd backend && npm run dev

# Start frontend (port 3000)
cd frontend && npm start
```

The backend serves both the API and (in production) the built React frontend.

---

## Deployment (Railway)

The app is configured to deploy on [Railway](https://railway.app) via `railway.json`.

**Required environment variables on Railway:**

| Variable | Value |
|---|---|
| `JWT_SECRET` | A strong random string |
| `JWT_EXPIRE` | `7d` |
| `NODE_ENV` | `production` |
| `DB_PATH` | *(optional)* Path to SQLite file — set to a volume mount for persistence |

```bash
# Deploy
railway login
railway init
railway up --service yarn-IMS
```

---

## Default Credentials

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | admin |

> Change the password after first login.

---

## License

MIT
