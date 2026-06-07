# 🚀 LeadCRM Pro — Full Stack Lead Management System

A production-ready CRM application for managing leads and customers, built with React, Node.js, Express, and MongoDB.

## ✨ Features

- **Dashboard** — At-a-glance stats: total leads, conversion rate, pipeline status breakdown, recent activity
- **Lead Management** — Add, view, edit, and delete leads with a sleek modal interface
- **Status Tracking** — New → Contacted → Qualified → Converted / Lost pipeline stages
- **Search & Filter** — Instant search by name, email, or company; filter by status
- **Sorting** — Sort by name, company, status, or date created (asc/desc)
- **Pagination** — Server-side pagination (10 leads/page)
- **Analytics** — Charts showing status distribution, lead source breakdown, and monthly trends
- **Responsive** — Works on desktop, tablet, and mobile

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, React Router, Recharts, Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Styling | Pure CSS with CSS variables (dark theme) |
| HTTP Client | Axios with interceptors |

## 📁 Project Structure

```
crm/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # MongoDB connection
│   │   ├── controllers/
│   │   │   └── leadController.js # Business logic
│   │   ├── models/
│   │   │   └── Lead.js           # Mongoose schema
│   │   ├── routes/
│   │   │   └── leads.js          # API routes
│   │   └── server.js             # Express app entry
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx         # Sidebar navigation
    │   │   ├── LeadForm.jsx       # Add/Edit modal
    │   │   ├── StatusBadge.jsx    # Status indicator
    │   │   └── ConfirmDialog.jsx  # Delete confirmation
    │   ├── pages/
    │   │   ├── Dashboard.jsx      # Main dashboard
    │   │   ├── Leads.jsx          # Lead list with filters
    │   │   ├── AddLead.jsx        # Add lead page
    │   │   └── Analytics.jsx      # Charts & analytics
    │   ├── utils/
    │   │   ├── api.js             # Axios instance + API calls
    │   │   └── constants.js       # Shared constants
    │   └── App.jsx                # Router setup
    └── package.json
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local) or MongoDB Atlas (cloud)
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/lead-crm.git
cd lead-crm
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm_leads
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

> **MongoDB Atlas:** Replace `MONGODB_URI` with your Atlas connection string:
> `mongodb+srv://<user>:<password>@cluster.mongodb.net/crm_leads`

Start the backend:

```bash
npm run dev     # development (with nodemon)
npm start       # production
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/leads` | Get all leads (with search, filter, sort, pagination) |
| `GET` | `/leads/stats` | Get dashboard statistics |
| `GET` | `/leads/:id` | Get single lead |
| `POST` | `/leads` | Create new lead |
| `PUT` | `/leads/:id` | Update lead |
| `DELETE` | `/leads/:id` | Delete lead |

### Query Parameters for `GET /leads`

| Param | Type | Description | Example |
|-------|------|-------------|---------|
| `search` | string | Search name, email, company | `?search=john` |
| `status` | string | Filter by status | `?status=New` |
| `sortBy` | string | Sort field | `?sortBy=createdAt` |
| `sortOrder` | string | `asc` or `desc` | `?sortOrder=desc` |
| `page` | number | Page number | `?page=2` |
| `limit` | number | Items per page (max 100) | `?limit=10` |

### Lead Object

```json
{
  "_id": "64abc...",
  "name": "Jane Smith",
  "email": "jane@acme.com",
  "phone": "+91 98765 43210",
  "company": "Acme Inc.",
  "status": "Qualified",
  "source": "Website",
  "notes": "Interested in enterprise plan",
  "createdAt": "2024-06-01T10:00:00.000Z",
  "updatedAt": "2024-06-02T11:30:00.000Z"
}
```

### Create / Update Payload

```json
{
  "name": "Jane Smith",         // required
  "email": "jane@acme.com",     // required, must be valid email
  "phone": "+91 98765 43210",   // required
  "company": "Acme Inc.",       // required
  "status": "New",              // New | Contacted | Qualified | Converted | Lost
  "source": "Website",          // Website | Referral | Cold Call | Social Media | Email | Other
  "notes": "..."                // optional
}
```

---

## 🌐 Deployment

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set root to `backend/`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI` = your Atlas connection string
   - `FRONTEND_URL` = your Vercel frontend URL
   - `NODE_ENV` = `production`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your repo, set root to `frontend/`
3. Framework: Vite
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL + `/api`
5. Deploy!

---

## 📸 Screenshots

| Dashboard | All Leads |
|-----------|-----------|
| Stats + pipeline overview | Search, filter, sort, paginate |

| Add Lead | Analytics |
|----------|-----------|
| Modal form with validation | Charts: status, source, monthly trend |

---

## 🧩 Bonus Features Implemented

- ✅ Lead statistics dashboard with charts (Recharts)
- ✅ Server-side pagination
- ✅ Multi-field sorting (name, company, status, date)
- ✅ Multi-field filtering (status + full-text search)
- ✅ Responsive design (mobile + tablet + desktop)
- ✅ Lead source tracking
- ✅ Monthly trend chart
- ✅ Conversion rate calculation
- ✅ Debounced search input

---

## 👤 Author

Built for the Full Stack Developer Internship Assignment — websites.co.in
