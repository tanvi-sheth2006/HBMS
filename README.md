# Hospital Management System — Full Project

This archive contains two folders:

- `hospital-client/` — React + Vite + Tailwind frontend
- `hospital-server/` — Node.js + Express + MySQL backend

## Quickstart

1. Unzip the archive.
2. Open the `hospital-management-system` folder in VS Code.
3. Run the setup script to install dependencies:

- Mac / Linux:
  ```bash
  ./setup.sh
  ```

- Windows:
  ```bat
  setup.bat
  ```

4. Create a MySQL database and run `hospital-server/sql/schema.sql` to create schema and sample data.
5. Copy `.env.example` files in each folder to `.env` and fill values:
   - `hospital-server/.env` → set DB_HOST, DB_USER, DB_PASS, DB_NAME
   - `hospital-client/.env` → set `VITE_API_URL` to backend URL (e.g., http://localhost:5000)

6. Run backend:
```bash
cd hospital-server
npm run dev
```

7. Run frontend:
```bash
cd hospital-client
npm run dev
```

Open the Vite URL (usually http://localhost:5173).

## Deploy
- Frontend: Vercel (set `VITE_API_URL` environment variable)
- Backend: Render / Railway / any Node host (set DB_* environment variables)

