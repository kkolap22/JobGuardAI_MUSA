# JobGuard AI

JobGuard AI is a full-stack application that helps users scan and assess job-related websites for suspicious or risky behavior, including redirects, unsafe URLs, credential collection flows, and suspicious payment patterns.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express + TypeScript
- Database: MongoDB
- AI: Google Gemini
- Browser automation: Playwright

## Features

- User authentication and authorization
- Website scan orchestration
- Risk analysis and findings generation
- Evidence collection and reporting
- AI-assisted insights for suspicious patterns

## Project structure

- `frontend/` — React client app
- `backend/` — Express API and scanner workers
- `docker-compose.yml` — local multi-service setup
- `postman/` — API examples and collection files

## Prerequisites

- Node.js 18+
- npm
- MongoDB running locally or via Docker
- Gemini API key

## Local setup

### 1. Install dependencies

```bash
npm install
cd backend && npm install
```

### 2. Configure environment variables

Copy the example file:

```bash
cp backend/.env.example backend/.env
```

Update the values in `backend/.env` with your actual configuration.

### 3. Start the app

From the root:

```bash
npm run dev
```

This starts the frontend dev server.

For the backend:

```bash
cd backend
npm run dev
```

### 4. Run with Docker

```bash
docker compose up --build
```

## Backend scripts

```bash
cd backend
npm run dev
npm run build
npm run typecheck
npm run test:api
```

## Frontend scripts

```bash
npm run dev
npm run build
npm run preview
```

## Notes

- The backend requires a valid MongoDB URI and JWT secrets.
- The scanner service depends on Docker and Playwright runtime support.
- Do not commit real `.env` files to the repository.

## License

This project is currently licensed under the ISC license in the backend package configuration.
