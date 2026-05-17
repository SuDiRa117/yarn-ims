# Yarn Inventory Management System

Production-grade **Yarn Inventory Management System** for yarn distribution centers supporting 3-10 concurrent desktop users with real-time stock visibility, audit trails, and advanced analytics.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Frontend (React)                           │
│  - Dashboard with Analytics & KPIs                      │
│  - Tab-based Data Entry (4 modules)                     │
│  - Real-time Stock View with Filters                    │
│  - Reports & Audit Logs                                 │
└──────────────────┬──────────────────────────────────────┘
                   │ REST API
┌──────────────────▼──────────────────────────────────────┐
│         Backend (Node.js/Express)                        │
│  - Authentication & Authorization                       │
│  - Inventory Management APIs                            │
│  - Real-time Stock Calculations                         │
│  - Audit Logging                                        │
│  - Export (Excel/PDF)                                   │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│        Database (MySQL/MariaDB)                          │
│  - Users & Auth                                         │
│  - Received/Issued/Rejected/QC Yarn Records             │
│  - Audit Logs                                           │
└──────────────────────────────────────────────────────────┘
```

## Features

### 1. **Data Entry Module (4 Tabs)**
- **Received Yarn**: Track new yarn acquisitions with lot numbers, styles, weights, colors
- **Issued Yarn**: Record yarn distribution with recipient tracking and expected returns
- **Rejected Yarn**: Log quality failures with severity levels and reusability assessment
- **QC/Unrevealed Yarn**: Manage pending quality tests with status tracking

**Auto-Calculations:**
- Total weight = weight per cone × number of cones
- Available balance = Received - Issued - Rejected
- Real-time inventory validation

### 2. **Stock View Module**
- **Summary Cards**: Total cones, weight, turnover rate, QC items
- **Inventory Table**: Complete view with all states, sortable and filterable
- **Search & Filters**: By lot number, yarn name, style, color, date range
- **Export**: Excel (.xlsx) and PDF formats

### 3. **Analytics Dashboard**
- **KPI Cards**: Received, Issued, Rejected, Under QC metrics
- **Charts**:
  - Status Distribution (Pie/Donut)
  - Weight Distribution (Stacked Bar)
  - Style Distribution (Horizontal Bar)
  - Color Distribution (Treemap)
  - Trend Analysis (Line Chart)
- **Alert System**: Critical, warning, and info alerts

### 4. **Audit & Compliance**
- Complete audit trail of all transactions
- User-tracked actions with timestamps
- Searchable audit logs with filters
- Compliance reporting

## Deployment

### Prerequisites
- Docker & Docker Compose (recommended)
- Node.js 18+ & MySQL 8.0+ (for local deployment)

### Option 1: Docker Deployment (Recommended)

```bash
# From project root
cd docker
docker-compose up -d

# Access the application
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
Database:  localhost:3306
```

### Option 2: Local Development

**Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate     # Initialize database
npm run dev         # Start development server
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm start          # Starts on http://localhost:3000
```

### Database Configuration

**Connection Details:**
- Host: localhost
- Port: 3306
- User: yarn_user (docker) or root (local)
- Password: yarn_password (docker) or your_password
- Database: yarn_ims

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create new user
- `GET /api/auth/users` - Get all users

### Inventory
- `POST /api/inventory/received` - Add received yarn
- `GET /api/inventory/received` - List received yarn
- `POST /api/inventory/issued` - Issue yarn
- `POST /api/inventory/rejected` - Reject yarn
- `POST /api/inventory/qc` - Create QC record
- `PUT /api/inventory/qc/:id` - Update QC status
- `GET /api/inventory/status` - Get inventory status
- `GET /api/inventory/search` - Search inventory
- `GET /api/inventory/analytics` - Get analytics data

### Reports
- `GET /api/reports/audit-logs` - Audit trail
- `GET /api/reports/export/excel` - Export to Excel
- `GET /api/reports/export/pdf` - Export to PDF

## Project Structure

```
ims/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── migrations/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
└── README.md
```

## Development Workflow

### Local Backend Development
```bash
cd backend
npm install
npm run dev    # Uses nodemon for auto-reload
```

### Local Frontend Development
```bash
cd frontend
npm install
npm start      # Uses create-react-app dev server
```

### Database Migrations
```bash
cd backend
npm run migrate    # Initialize schema and default admin
```

## Key Technologies

**Frontend:**
- React 18 with React Router
- Recharts for data visualization
- Zustand for state management
- Axios for API communication

**Backend:**
- Express.js for REST API
- MySQL2 for database
- JWT for authentication
- XLSX & PDFKit for export

**Infrastructure:**
- Docker & Docker Compose
- MySQL 8.0
- Node.js 18

## Production Deployment

### Scaling for 3-10 Concurrent Users
- MySQL connection pooling: 10 connections
- Built-in request queuing
- Real-time inventory calculations cached
- API rate limiting ready (implement as needed)

### Security Considerations
1. Change JWT secret in production
2. Use HTTPS/SSL in production
3. Implement CORS properly for production domain
4. Set strong MySQL passwords
5. Use environment variables for all secrets

### Performance Optimization
- Database indexes on frequently queried columns
- API response caching for analytics
- Frontend component lazy loading
- Image optimization

## Support & Maintenance

### Troubleshooting

**Database Connection Error:**
```bash
# Check MySQL is running
docker ps | grep yarn-ims-db
# Or check local MySQL service
```

**Port Already in Use:**
```bash
# Change ports in docker-compose.yml
# Frontend: 3001:3000
# Backend: 5001:5000
# Database: 3307:3306
```

**Reset Database:**
```bash
docker-compose down -v
docker-compose up -d
```

## Future Enhancements

- [ ] Real-time WebSocket updates for concurrent users
- [ ] Advanced forecasting models
- [ ] Multi-warehouse support
- [ ] Mobile app (React Native)
- [ ] AI-powered quality predictions
- [ ] Barcode/QR code scanning
- [ ] Email report scheduling

---

**Version:** 1.0.0  
**Last Updated:** May 2024  
**License:** MIT
