# Smart Leads Dashboard

A full-stack **Lead Management Dashboard** built with the **MERN** stack and **TypeScript end-to-end**.

> Built as the Full Stack Internship Assignment for ServiceHive.

---

## ✨ Features

### Authentication
- JWT-based auth (register / login / `/me`)
- Password hashing with **bcrypt**
- Auth middleware + protected routes
- **Role-Based Access Control** — `admin` (full access incl. delete) and `sales` (own leads only)

### Leads Management (CRUD)
- Fields: `name`, `email`, `status`, `source`, `createdAt`
- Status: `New | Contacted | Qualified | Lost`
- Source: `Website | Instagram | Referral`
- Create / Update / Delete (admin-only delete)

### Advanced Filtering, Search, Sort
- Filter by **Status** and **Source**
- **Debounced** search by name or email (400 ms)
- Sort by **Latest / Oldest**
- All filters combine on the backend

### Backend Pagination
- Mandatory backend pagination (`skip` / `limit`), 10 per page
- Rich pagination metadata in every response

### Extras (all mandatory features delivered)
- ✅ Debounced search
- ✅ CSV Export (respects current filters)
- ✅ Role-Based Access Control (admin/sales)
- ✅ Docker setup (`docker-compose up`)
- ✅ Dark mode (bonus)

---

## 🧱 Tech Stack

| Layer    | Stack                                                    |
|----------|----------------------------------------------------------|
| Frontend | React 18 · TypeScript · TailwindCSS · React Router · Axios |
| Backend  | Node.js · Express · TypeScript · Mongoose · Zod · JWT     |
| DB       | MongoDB                                                   |
| DevOps   | Docker + docker-compose                                   |

---

## 📁 Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/db.ts
│   │   ├── controllers/{auth,lead}.controller.ts
│   │   ├── middleware/{auth,error,validate}.ts
│   │   ├── models/{User,Lead}.ts
│   │   ├── routes/{auth,lead}.routes.ts
│   │   ├── validators/index.ts        # Zod schemas
│   │   ├── utils/{csv,seed}.ts
│   │   ├── types/index.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/{axios,auth,leads}.ts
│   │   ├── components/{ui,leads,layout}/...
│   │   ├── context/{AuthContext,ThemeContext}.tsx
│   │   ├── hooks/useDebounce.ts
│   │   ├── pages/{Login,Register,Dashboard}.tsx
│   │   ├── types/index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Option A — Docker (recommended)

```bash
docker compose up --build
# Frontend → http://localhost:8080
# Backend  → http://localhost:5000/api
# Mongo    → mongodb://localhost:27017
```

Then seed demo data:
```bash
docker compose exec backend npm run seed
```

### Option B — Local

**1. MongoDB** — have a local Mongo running, or use Atlas.

**2. Backend**
```bash
cd backend
cp .env.example .env        # adjust MONGO_URI & JWT_SECRET
npm install
npm run seed                # creates demo users + 35 leads
npm run dev                 # http://localhost:5000
```

**3. Frontend**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

### Demo Credentials (after seed)
| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@demo.com  | admin123  |
| Sales | sales@demo.com  | sales123  |

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint            | Auth | Body                                       |
|--------|---------------------|------|--------------------------------------------|
| POST   | `/auth/register`    | —    | `{ name, email, password, role? }`         |
| POST   | `/auth/login`       | —    | `{ email, password }`                      |
| GET    | `/auth/me`          | ✅   | —                                          |

Response (success):
```json
{ "success": true, "data": { "token": "...", "user": { "id": "...", "name": "...", "email": "...", "role": "admin" } } }
```

### Leads

All endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint            | Role         | Description                       |
|--------|---------------------|--------------|-----------------------------------|
| GET    | `/leads`            | any          | List + filter + paginate          |
| POST   | `/leads`            | any          | Create lead                       |
| PATCH  | `/leads/:id`        | owner/admin  | Update lead                       |
| DELETE | `/leads/:id`        | **admin**    | Delete lead                       |
| GET    | `/leads/export`     | any          | CSV export (honors filters)       |

**Query params for `/leads`:**
- `status` — `New | Contacted | Qualified | Lost`
- `source` — `Website | Instagram | Referral`
- `search` — string (name or email, case-insensitive)
- `sort` — `latest | oldest`
- `page` — number (default 1)
- `limit` — number (default 10, max 100)

**List response:**
```json
{
  "success": true,
  "data": [ { "_id": "...", "name": "...", "email": "...", "status": "New", "source": "Website", "createdAt": "..." } ],
  "meta": { "page": 1, "limit": 10, "total": 35, "totalPages": 4, "hasNext": true, "hasPrev": false }
}
```

**Example combined filter:**
```
GET /api/leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1
```

### Errors

Centralized handler returns:
```json
{ "success": false, "message": "...", "errors": { "field": ["..."] } }
```
- `401` no/invalid token · `403` forbidden role · `404` not found · `409` duplicate · `422` validation

---

## 🧪 Quality Checklist (matches assignment rubric)

- ✅ TypeScript both ends, no `any` in business logic
- ✅ Interfaces / types properly defined (`/backend/src/types`, `/frontend/src/types`)
- ✅ Reusable components (`Button`, `Input`, `Select`, `Modal`, `StatusBadge`, `Pagination`)
- ✅ Clean folder structure (controllers / routes / middleware / validators / models)
- ✅ Loading states, empty states, error UI
- ✅ Form validation (client + server with Zod)
- ✅ Centralized error handling
- ✅ RESTful, proper status codes, clean response envelope
- ✅ Responsive UI + dark mode
- ✅ Docker setup
- ✅ `.env.example` provided for both apps

---

## 📦 Build for Production

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm run preview
```

---

## 📝 License
MIT — built for the ServiceHive Full Stack Internship Assignment.
