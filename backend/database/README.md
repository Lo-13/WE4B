# Database setup

The backend uses MySQL database `we4x_si40_db`.

## SQL files

```text
backend/database/we4x_si40_db.sql
```

Complete SQL dump compatible with the current NestJS backend. Use this file to recreate the database with tables and test data.

```text
backend/database/original-we4x_si40_project.sql
```

Original SQL file from the previous project. It is kept for traceability, but its table/column names do not fully match the current backend entities.

```text
backend/database/rest-api-demo-users.sql
```

Small helper script that inserts the Angular demo users:

```text
b@gamingrooms.fr
a@gamingrooms.fr
j@gamingrooms.fr
```

These users are already included in `we4x_si40_db.sql`.

## Import database

From the project root:

```powershell
cd D:\UTBM_cours\WE\WE4B\backend
mysql -u root -p < database\we4x_si40_db.sql
```

Then configure local credentials:

```powershell
Copy-Item .env.example .env
```

Edit `.env` if your MySQL password or port is different.

Expected `.env` shape:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=we4x_si40_db
```

## Verify

```powershell
mysql -u root -p we4x_si40_db -e "SHOW TABLES; SELECT COUNT(*) AS rooms FROM room; SELECT COUNT(*) AS users FROM user; SELECT COUNT(*) AS reservations FROM reservation;"
```

## Start backend

```powershell
npm install
npm run start
```
