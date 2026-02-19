# Employee Management System (IDMS SDE Assessment)

MERN stack Employee Management module built for the IDMS technical assessment.

## Tech Stack

- Frontend: React + Vite + Axios
- Backend: Node.js + Express + MongoDB + Mongoose
- Authentication: JWT (cookie + bearer token support)
- File Upload: Multer

## Assessment Scope Coverage

This project implements all mandatory items from the provided PDF:

1. Authentication Module

- Responsive login UI
- Email/Username + Password
- Database validation
- Redirect to dashboard on success

2. Dashboard Layout

- Header
- Sub-header
- Main content area
- Create button

3. Employee Creation Feature

- Modal with fields:
  - Full Name
  - Date of Birth
  - Email
  - Department (dropdown)
  - Phone Number
  - Designation (dropdown)
  - Gender
  - Employee Photo (file upload)

4. Backend and Database

- REST APIs in Express
- Mongoose schema and validations
- Multer-based image upload
- Data stored in MongoDB

5. Data Display

- Employee table rendered from database data
- Photo clip icon opens uploaded image

6. JWT Authentication (Mandatory)

- JWT generated on login
- Protected employee routes via middleware
- Logout clears token
- JWT secret from `.env`
- Token expiry configurable (`JWT_EXPIRES_IN`)

7. Search and Filter (Mandatory)

- Backend case-insensitive search by name/email/department
- Filters by department/designation/gender
- Search + filters work together via query params

## Project Structure

```text
.
|-- client/
|   |-- public/sde-kit/           # Provided assets + Inter font files
|   `-- src/
|       |-- components/
|       |-- api.js
|       `-- styles.css
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- middleware/
|   |   |-- models/
|   |   `-- routes/
|   `-- uploads/
|-- render.yaml
|-- vercel.json
`-- README.md
```

## Prerequisites

- Node.js 18+ (tested with Node 22)
- npm
- MongoDB local or MongoDB Atlas

## Local Setup

1. Install dependencies:

```bash
npm install
npm run install:all
```

2. Create backend env file:

```bash
copy server\.env.example server\.env
```

3. (Optional for split deployment) create frontend env file:

```bash
copy client\.env.example client\.env
```

4. Start MongoDB locally (if using local DB):

- Default URI used by this project:
  - `mongodb://127.0.0.1:27017/employee_management`

5. Run both apps:

```bash
npm run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health: `http://localhost:5000/api/health`

## Default Admin

If admin is missing, backend seeds admin on startup:

- Username: `admin`
- Email: `admin@idms.com`
- Password: value from `ADMIN_PASSWORD` (default in example: `admin123`)

## Environment Variables

### Backend (`server/.env`)

- `PORT=5000`
- `MONGO_URI=mongodb://127.0.0.1:27017/employee_management`
- `JWT_SECRET=<strong-secret>`
- `JWT_EXPIRES_IN=24h`
- `COOKIE_NAME=token`
- `CORS_ORIGIN=http://localhost:5173`
- `NODE_ENV=development`
- `UPLOAD_DIR=` (optional; auto-resolves if empty)
- `ADMIN_USERNAME=admin`
- `ADMIN_EMAIL=admin@idms.com`
- `ADMIN_PASSWORD=<set-strong-password>`

### Frontend (`client/.env`)

- `VITE_API_BASE_URL=http://localhost:5000/api`
- `VITE_UPLOADS_BASE_URL=http://localhost:5000`

## API Endpoints

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/employees?search=John&department=HR&designation=Manager&gender=Male`
- `POST /api/employees` (multipart/form-data)
- `PUT /api/employees/:employeeId` (multipart/form-data)
- `DELETE /api/employees/:employeeId`

## Deployment

### Backend (Render)

Use `render.yaml` with `rootDir=server`.

Required env vars on Render:

- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGIN=https://<your-vercel-domain>`
- `ADMIN_PASSWORD`

Recommended:

- `UPLOAD_DIR=/var/data/uploads`

Important for uploaded images persistence:

1. Add Render Persistent Disk
2. Mount path: `/var/data`
3. Set `UPLOAD_DIR=/var/data/uploads`
4. Redeploy

### Frontend (Vercel)

Root `vercel.json` is configured for client build:

- Install: `npm install --prefix client`
- Build: `npm run build --prefix client`
- Output: `client/dist`

Set Vercel env vars:

- `VITE_API_BASE_URL=https://<your-render-domain>/api`
- `VITE_UPLOADS_BASE_URL=https://<your-render-domain>`

## Troubleshooting

- CORS error:
  - Ensure Render `CORS_ORIGIN` exactly matches Vercel domain
- Atlas auth error (`bad auth : authentication failed`):
  - Verify MongoDB username/password and URI
- Local port already in use (`EADDRINUSE:5000`):
  - Stop existing process or change `PORT`
- Upload URLs break after redeploy (`Cannot GET /uploads/...`):
  - Configure persistent disk and `UPLOAD_DIR=/var/data/uploads`

## Notes

- Sidebar items like Leaves/Holidays/etc are visual items from reference layout; assessment-required CRUD/search/filter/auth are implemented in Employee section.
- Inter font from provided kit is used.

## Submission Checklist (from PDF)

- Public GitHub repository link
- Clear README setup instructions
- Live links (Vercel + Render) or screen recording
