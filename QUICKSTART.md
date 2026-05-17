# Yarn Inventory Management System

## Overview

This is a **production-grade Inventory Management System** for yarn distribution centers. Designed for 3-10 concurrent desktop users with support for 50,000+ inventory records, real-time stock visibility, comprehensive audit trails, and advanced analytics/reporting.

## Key Features

✅ **4-Tab Data Entry Interface**
- Received Yarn (acquisitions tracking)
- Issued Yarn (distribution with recipient tracking)
- Rejected Yarn (QC failures with severity levels)
- Unrevealed/QC Yarn (pending quality tests)

✅ **Real-Time Stock View**
- Live inventory status across all states
- Summary cards (total cones, weight, turnover rate)
- Advanced search and filtering
- Export to Excel & PDF

✅ **Analytics Dashboard**
- KPI metrics (Received, Issued, Rejected, Under QC)
- 5 interactive charts (Status, Weight, Style, Color, Trends)
- Smart alert system for critical issues
- Seasonal pattern analysis

✅ **Audit & Compliance**
- Complete transaction audit trail
- User-tracked actions with timestamps
- Audit log search and filtering
- Compliance reporting

✅ **Multi-User Support**
- User authentication & roles (Admin, Operator, Viewer)
- Concurrent user support (3-10 users)
- Session management
- User activity tracking

## Quick Start

### Docker Deployment (Recommended - 2 minutes)

```bash
cd docker
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Login: admin / admin123
```

### Local Development Setup

**Backend:**
```bash
cd backend
npm install
npm run migrate
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions.

## System Requirements

- **Users:** 3-10 concurrent desktop users
- **Records:** Support for 50,000+ inventory items
- **Browser:** Modern browser (Chrome, Firefox, Safari, Edge)
- **Deployment:** Docker/Local Network or Cloud

## Technology Stack

- **Frontend:** React 18, Recharts, Zustand, Axios
- **Backend:** Node.js/Express, MySQL 8.0, JWT Auth
- **Infrastructure:** Docker, Docker Compose
- **Export:** Excel (XLSX), PDF

## Project Structure

```
ims/
├── backend/           # Express API server
├── frontend/          # React application
├── docker/            # Docker configuration
├── README.md          # This file
└── DEPLOYMENT.md      # Deployment guide
```

## API Documentation

All endpoints require JWT authentication token in header:
```
Authorization: Bearer <token>
```

### Core Endpoints

**Auth:**
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/users`

**Inventory:**
- `POST /api/inventory/received` - Add received yarn
- `POST /api/inventory/issued` - Issue yarn
- `POST /api/inventory/rejected` - Reject yarn
- `POST /api/inventory/qc` - Create QC record
- `GET /api/inventory/status` - Get inventory
- `GET /api/inventory/analytics` - Get analytics

**Reports:**
- `GET /api/reports/audit-logs`
- `GET /api/reports/export/excel`
- `GET /api/reports/export/pdf`

## Default Credentials

- **Username:** admin
- **Password:** admin123

## Features in Detail

### Data Entry (4 Modules)

**1. Received Yarn**
- Fields: Lot #, Style, Yarn Name, Weight, Cones, Color, Date, Notes
- Auto-calculates: Total weight
- Validation: Unique lot numbers

**2. Issued Yarn**
- Fields: Recipient, Quantity, Purpose, Expected Return Date
- Logic: Validates available stock before issuing
- Creates audit trail

**3. Rejected Yarn**
- Fields: Rejection Reason, Severity, Reusability, Details
- Severity Levels: Minor, Major, Critical
- Status: Marks as non-sellable

**4. QC Yarn**
- Fields: Test Type, Status, Expected Completion, Result
- Test Types: Tensile Strength, Color Fastness, Shrinkage, Count
- Status Transitions: Pending → In Progress → Completed/Failed

### Stock View

- Real-time inventory balance: (Received - Issued - Rejected)
- 10 columns: Lot, Name, Style, Color, Received, Issued, Rejected, Available, Date, Updated
- Filters: Style, Color, Status, Date Range
- Pagination: 10 items per page
- Export: Excel & PDF

### Dashboard Analytics

**KPI Cards:**
- Total Received (cones + weight)
- Total Issued (cones + % turnover)
- Total Rejected (cones + rejection rate)
- Under QC (pending items)

**Charts:**
1. Status Distribution (Pie) - Green/Blue/Red/Amber
2. Weight Distribution (Stacked Bar)
3. Style Distribution (Horizontal Bar)
4. Color Distribution (Treemap/Bubble)
5. Trend Analysis (Line) - 7-day/30-day trends

**Alerts:**
- Critical: High rejection (>10%), Overdue QC (>60 days), Low stock (<30 cones)
- Info: Upcoming returns, New inventory, Items expiring

### Audit System

- Logs every action: CREATE, UPDATE, DELETE
- Tracks: User, Timestamp, Old Value, New Value
- Searchable by: User, Date Range, Module
- Compliance ready

## Configuration

See `.env.example` files in backend and frontend for all configuration options.

### Key Environment Variables

**Backend:**
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`, `JWT_EXPIRE`
- `SMTP_*` for email reports

**Frontend:**
- `REACT_APP_API_URL`

## Performance

- **Database:** Connection pooling (10 connections)
- **API:** Response caching for analytics
- **Frontend:** Lazy loading, code splitting
- **Scale:** Handles 3-10 concurrent users easily
- **Records:** Supports 50,000+ inventory items

## Security

- JWT-based authentication
- Role-based access control
- Password hashing (bcrypt)
- SQL injection prevention
- CORS protection
- Audit logging for compliance

## Troubleshooting

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting guide.

Quick commands:
```bash
# Check services
docker-compose ps

# View logs
docker-compose logs -f backend

# Reset database
docker-compose down -v && docker-compose up -d

# Test API health
curl http://localhost:5000/api/health
```

## Future Enhancements

- WebSocket real-time updates
- Mobile app (React Native)
- Advanced forecasting
- Multi-warehouse support
- Barcode scanning
- AI quality predictions

## Support

For issues:
1. Check browser console (F12) for frontend errors
2. Check backend logs: `docker-compose logs backend`
3. Verify database connection: `docker-compose logs db`
4. Refer to [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section

## License

MIT

---

**Built with ❤️ for yarn distribution excellence**

Version 1.0.0 | May 2024
