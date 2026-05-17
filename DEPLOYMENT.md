# Yarn Inventory Management System - Setup & Deployment Guide

## Quick Start (5 minutes)

### Prerequisites
- Docker & Docker Compose installed
- Or Node.js 18+, MySQL 8.0+ for local deployment

### Start with Docker (Recommended)

```bash
cd docker
docker-compose up -d

# Wait 30 seconds for services to initialize
# Then access:
# Frontend:  http://localhost:3000
# Backend:   http://localhost:5000
# Admin:     username: admin, password: admin123
```

### Access the Application

1. **Open Frontend:** http://localhost:3000
2. **Login:** Use admin/admin123
3. **Navigate:** Dashboard → Data Entry → Stock View → Reports

## Local Development Setup

### Backend (Node.js/Express)

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure .env
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=yarn_ims

# Initialize database
npm run migrate

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

### Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
# App opens on http://localhost:3000
```

## System Architecture

### Database Schema

**Users**
- id, username, password, email, department, role

**Received Yarn**
- Lot number (unique), style, yarn name, weight, cones, color, date received, notes

**Issued Yarn**
- Lot reference, issued to, quantity, purpose, dates, recipient info

**Rejected Yarn**
- Lot reference, rejection reason, severity, reusability flag, rejector info

**QC Yarn**
- Lot reference, test type, status, expected completion, result, tester info

**Audit Log**
- Action, module, record ID, user, old value, new value, timestamp

## Configuration

### Backend (.env)

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=yarn_ims

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d

# SMTP (optional - for email reports)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v

# Restart specific service
docker-compose restart backend

# View running containers
docker-compose ps
```

## Default Credentials

- **Admin Username:** admin
- **Admin Password:** admin123

Create additional users via admin panel.

## Testing

### Test Data Entry
1. Go to Data Entry tab
2. Create a received yarn record with:
   - Lot Number: LOT-2024-001
   - Style: Cobalt
   - Yarn Name: Premium Blue Yarn
   - Weight: 50 kg
   - Cones: 100
   - Color: Blue

3. View in Stock View to see real-time inventory

### Test Export
1. Go to Reports tab
2. Click "Export to Excel" or "Export to PDF"
3. Verify file download

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :5000      # Backend
lsof -i :3000      # Frontend
lsof -i :3306      # Database

# Kill process or change port in docker-compose.yml
```

### Database Connection Error

```bash
# Check MySQL is running
docker-compose ps

# Check logs
docker-compose logs db

# Verify credentials in .env
```

### Frontend Can't Connect to Backend

```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check REACT_APP_API_URL in frontend/.env
# Should be: http://localhost:5000/api
```

### Clear Everything and Start Fresh

```bash
cd docker
docker-compose down -v
docker-compose up -d
# Wait 30 seconds for initialization
```

## Performance Tuning

### For 10 Concurrent Users
- Connection pool size: 10 (already configured)
- Query optimization: Database indexes in place
- Cache layer: Ready for Redis integration
- Load balancing: Use Nginx for multiple backend instances

### Database Optimization
- Indexes on lot_number, style, colour, date fields
- Partitioning by date (optional for >100k records)
- Regular VACUUM and ANALYZE

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS/TLS in production
- [ ] Set strong database password
- [ ] Enable MySQL USER with minimal privileges
- [ ] Implement CORS for production domain
- [ ] Add rate limiting middleware
- [ ] Enable audit logging
- [ ] Regular database backups

## Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend availability
curl http://localhost:3000

# Database connection test
curl http://localhost:5000/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Logs

```bash
# Backend logs
docker-compose logs backend -f

# Database logs
docker-compose logs db -f

# All logs
docker-compose logs -f
```

## Backup & Restore

```bash
# Backup database
docker-compose exec db mysqldump -u yarn_user -p yarn_ims > backup.sql

# Restore database
docker-compose exec db mysql -u yarn_user -p yarn_ims < backup.sql
```

## Production Deployment

### Using AWS/Azure/GCP

1. **Create VM/Instance:** Ubuntu 20.04 LTS
2. **Install Docker:** Follow official guide
3. **Clone repository:** git clone <repo>
4. **Update configuration:**
   - Change JWT_SECRET
   - Update CORS origin
   - Configure HTTPS
5. **Deploy:** `docker-compose up -d`
6. **Use Nginx reverse proxy** for SSL/TLS

### Using Kubernetes

```bash
# Build images
docker build -f docker/Dockerfile.backend -t yarn-ims-backend .
docker build -f docker/Dockerfile.frontend -t yarn-ims-frontend .

# Push to registry, then deploy with provided k8s manifests
```

## Support

For issues or questions, refer to:
- Backend logs: `docker-compose logs backend`
- Frontend console: Browser developer tools (F12)
- Database: `docker-compose exec db mysql -u root -p`

---

**Happy Yarn Inventory Management! 📦**
