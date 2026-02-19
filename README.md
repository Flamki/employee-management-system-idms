# Employee Management System (MERN)

Full MERN implementation for the IDMS technical assessment, using the provided design kit (`SDE-Assessment-Kit` assets and Inter font).

## Tech Stack
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer
- Frontend: React (Vite), Axios
- Auth: JWT (HTTP-only cookie + Bearer token fallback for cross-domain deployments)

## Implemented Features
- Login with Email/Username + Password
- JWT generation, auth middleware, protected employee routes, logout
- Dashboard layout with header, sub-header, main content, create button
- Employee create modal with required fields:
  - Full Name, Date of Birth, Email, Department, Phone Number, Designation, Gender, Employee Photo
- Mandatory validations:
  - Valid email
  - Phone number exactly 10 digits
  - Department/Designation dropdown-only selections
  - Required fields cannot be empty
- Employee table (data fetched from DB)
- Photo icon and action icon are functional per employee row
- Employee row actions:
  - Edit employee
  - Delete employee
- Search + combined filters (backend query params):
  - Search by Name/Email/Department
  - Filter by Department/Designation/Gender
- Multer upload and static file serving from `server/uploads`

## Project Structure
- `server/` Express API (routes, middleware, models, config)
- `client/` React app UI
- `SDE-Assessment-Kit/` original assessment assets
- `client/public/sde-kit/` copied assets used by app

## Local Setup
1. Install dependencies:
```bash
npm install
npm run install:all
```

2. Configure backend env:
```bash
copy server\.env.example server\.env
```

3. Configure frontend env (optional for local, required for deployed split frontend/backend):
```bash
copy client\.env.example client\.env
```

4. Ensure MongoDB is running locally on:
- `mongodb://127.0.0.1:27017/employee_management`

5. Start both apps:
```bash
npm run dev
```

- Client: `http://localhost:5173`
- Server: `http://localhost:5000`

## Default Admin Credentials
Seeded automatically on server startup (if not present):
- Username: `admin`
- Email: `admin@idms.com`
- Password: `admin123`

## Key API Endpoints
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/employees?search=John&department=HR&designation=Manager&gender=Male`
- `POST /api/employees` (multipart/form-data)
- `PUT /api/employees/:employeeId` (multipart/form-data)
- `DELETE /api/employees/:employeeId`

## Deployment (Render + Vercel)
### 1) Deploy Backend on Render
- Create a new **Web Service** from repo folder `server`.
- Build command:
```bash
npm install
```
- Start command:
```bash
npm start
```
- Environment variables (Render):
  - `PORT=5000`
  - `MONGO_URI=<your-mongodb-uri>`
  - `JWT_SECRET=<strong-secret>`
  - `JWT_EXPIRES_IN=24h`
  - `COOKIE_NAME=token`
  - `CORS_ORIGIN=https://<your-vercel-domain>`
  - `ADMIN_USERNAME=admin`
  - `ADMIN_EMAIL=admin@idms.com`
  - `ADMIN_PASSWORD=admin123`
  - `NODE_ENV=production`

### 2) Deploy Frontend on Vercel
- Import repo and set root directory to `client`.
- Build command:
```bash
npm run build
```
- Output directory:
```bash
dist
```
- Environment variables (Vercel):
  - `VITE_API_BASE_URL=https://<your-render-domain>/api`
  - `VITE_UPLOADS_BASE_URL=https://<your-render-domain>`

### 3) Verify after deploy
- Login works
- Dashboard loads employees
- Create/Edit/Delete employee works
- Photo icon opens uploaded image
- Search and filters work together

## Submission Checklist (IDMS)
- Public GitHub repository link
- Vercel live link (frontend)
- Render live link (backend)
- This README with setup/deployment steps
