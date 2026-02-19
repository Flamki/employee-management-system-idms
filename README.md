# Employee Management System (IDMS Assessment)

MERN-stack Employee Management module built for the IDMS SDE technical assessment using the provided design kit (`SDE-Assessment-Kit`) and Inter font assets.

## Stack
- Frontend: React + Vite + Axios
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT (HTTP-only cookie + bearer token support)
- Uploads: Multer (employee photo upload)

## Assessment Requirements Status
Based on `assessment_pdf_text.txt` (extracted from the provided PDF), the implementation status is:

1. Authentication module: `Done`
- Responsive login screen
- Email/Username + Password
- DB-based credential validation
- Redirect to dashboard after login

2. Dashboard layout: `Done`
- Header
- Sub-header
- Main content area
- Create button

3. Employee creation modal + fields: `Done`
- Full Name
- Date of Birth
- Email
- Department (dropdown)
- Phone Number
- Designation (dropdown)
- Gender
- Employee Photo (file upload)

4. Backend + database: `Done`
- REST APIs with Express
- Structured MongoDB schema
- Backend validations
- Multer image upload
- Data persisted in MongoDB

5. Data display: `Done`
- Employee table rendered from DB
- Data fetched from backend APIs
- Photo clip icon opens uploaded image

6. JWT auth (mandatory): `Done`
- JWT generated on login
- Stored via HTTP-only cookie (and client bearer token for split deployment)
- Employee routes protected by auth middleware
- Logout clears auth cookie/client token
- JWT secret from `.env`
- Token expiry configured (`JWT_EXPIRES_IN`, default `24h`)

7. Search + filters (mandatory): `Done`
- Backend case-insensitive search by name/email/department
- Department filter
- Designation filter
- Gender filter
- Search and filters combined through query params

Note: Pixel-perfect UI is implemented against provided screens/assets, but final visual acceptance is still assessor-driven manual review.

## Project Structure
```text
.
├─ client/                  # React app (UI)
│  ├─ src/
│  └─ public/sde-kit/       # Provided design assets + Inter font files
├─ server/                  # Express API
│  ├─ src/config/           # DB/JWT/admin seed
│  ├─ src/middleware/       # Auth + validation middleware
│  ├─ src/models/           # Mongoose schemas
│  └─ src/routes/           # Auth + employees routes
├─ render.yaml              # Render deployment blueprint
├─ vercel.json              # Vercel build config (root-level)
└─ README.md
```

## Local Setup
1. Install dependencies:
```bash
npm install
npm run install:all
```

2. Create backend env:
```bash
copy server\.env.example server\.env
```

3. (Optional for local, required for split deploy) create frontend env:
```bash
copy client\.env.example client\.env
```

4. Ensure MongoDB is running:
- Local URI expected by default:
  - `mongodb://127.0.0.1:27017/employee_management`

5. Start both apps:
```bash
npm run dev
```

Local URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

## Default Admin (Auto-Seeded)
If admin does not exist, server seeds one at startup:
- Username: `admin`
- Email: `admin@idms.com`
- Password: value from `ADMIN_PASSWORD` (default `admin123`)

## Environment Variables
### Backend (`server/.env`)
- `PORT=5000`
- `MONGO_URI=mongodb://127.0.0.1:27017/employee_management`
- `JWT_SECRET=<strong-secret>`
- `JWT_EXPIRES_IN=24h`
- `COOKIE_NAME=token`
- `CORS_ORIGIN=http://localhost:5173`
- `NODE_ENV=development`
- `ADMIN_USERNAME=admin`
- `ADMIN_EMAIL=admin@idms.com`
- `ADMIN_PASSWORD=<choose-strong-password>`

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

### Backend on Render
Use `render.yaml` (recommended) or manual service with `rootDir=server`.

Required Render env vars:
- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGIN=https://<your-vercel-domain>`
- `ADMIN_PASSWORD`

Also set:
- `NODE_ENV=production`
- `JWT_EXPIRES_IN=24h`
- `COOKIE_NAME=token`
- `ADMIN_USERNAME=admin`
- `ADMIN_EMAIL=admin@idms.com`

### Frontend on Vercel
This repo already includes root `vercel.json`:
- install: `npm install --prefix client`
- build: `npm run build --prefix client`
- output: `client/dist`

Set Vercel env:
- `VITE_API_BASE_URL=https://<your-render-domain>/api`
- `VITE_UPLOADS_BASE_URL=https://<your-render-domain>`

## Troubleshooting
- `CORS blocked`: Render `CORS_ORIGIN` must exactly match your Vercel domain.
- `bad auth : authentication failed`: Atlas username/password or connection string mismatch.
- `vite: command not found` on Vercel: fixed by root `vercel.json` using client-prefixed install/build commands.
- `EADDRINUSE:5000` locally: stop existing process on port 5000 or change backend port.

## Submission Checklist
- Public GitHub repository link
- README with setup instructions (this file)
- Live deployment links (Vercel + Render) or screen recording
