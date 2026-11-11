# Product POC

A small full-stack product management app with JWT authentication, product CRUD, and sales statistics. The same API is implemented twice, as REST and as GraphQL, on a shared MongoDB database.

## Structure

| Folder | Description | Default port |
| --- | --- | --- |
| `frontend/` | React 19 + Vite, Redux Toolkit, React Router, Axios | 5173 |
| `backend/` | REST API: Express 5, Mongoose, JWT | 5001 |
| `graphql-backend/` | GraphQL API: Apollo Server 5, Express 5, Mongoose, JWT | 5002 |

The frontend currently talks to the REST `backend/` (Vite proxies `/api` to it). `graphql-backend/` is a standalone alternative exposing the same features.

## Prerequisites

- Node.js 20+
- MongoDB running locally (the example config expects `root:password@127.0.0.1:27017`)

## Setup

Run the following in each of the three folders:

```bash
cp .env.example .env   # then adjust values (set a real JWT_SECRET)
npm install
```

### Environment variables

**backend / graphql-backend**

| Variable | Example | Notes |
| --- | --- | --- |
| `PORT` | `5001` / `5002` | Server port |
| `MONGO_URI` | `mongodb://root:password@127.0.0.1:27017/product_poc?authSource=admin` | Shared database |
| `JWT_SECRET` | `change_me` | Change for any real use |
| `JWT_EXPIRES_IN` | `1d` | Token lifetime |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin |

**frontend**

| Variable | Default | Notes |
| --- | --- | --- |
| `VITE_API_URL` | `/api` | Axios base URL |
| `VITE_BACKEND_URL` | `http://localhost:5001` | Vite dev proxy target |
| `VITE_PORT` | `5173` | Dev server port |

## Running

```bash
# 1. Seed sample data (wipes users and products)
cd backend && npm run seed

# 2. Start the REST API
npm run dev            # http://localhost:5001

# 3. Start the frontend (new terminal)
cd frontend && npm run dev   # http://localhost:5173

# Optional: GraphQL API (new terminal)
cd graphql-backend && npm run dev   # http://localhost:5002/graphql
```

Seeded login: `admin@example.com` / `admin123`

`graphql-backend` has its own `npm run seed` with the same behaviour.

## API

### REST (`backend`, base path `/api`)

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Create an account |
| POST | `/auth/login` | No | Log in, returns JWT |
| GET | `/auth/me` | Yes | Current user |
| GET | `/products` | Yes | List products |
| POST | `/products` | Yes | Create product |
| PUT | `/products/:id` | Yes | Update product |
| DELETE | `/products/:id` | Yes | Delete product |
| GET | `/products/stats` | Yes | Total count and average sales figures |

Send the token as `Authorization: Bearer <token>`.

### GraphQL (`graphql-backend`, `/graphql`)

- Queries: `me`, `products`, `productStats`
- Mutations: `register`, `login`, `createProduct`, `updateProduct`, `deleteProduct`

A `/health` endpoint is also available.

## Scripts

| Folder | Scripts |
| --- | --- |
| `backend`, `graphql-backend` | `npm start`, `npm run dev` (watch mode), `npm run seed` |
| `frontend` | `npm run dev`, `npm run build`, `npm run lint`, `npm run preview` |
