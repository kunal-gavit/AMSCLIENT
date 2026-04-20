# AMS Client

Frontend application for the AMS (Attendance Management System), built with React and Vite.

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 3
- Axios
- React Router DOM
- Framer Motion
- Recharts

## Prerequisites

- Node.js 18+
- npm 9+

## Environment Variables

Create a `.env` file in this folder using `.env.example` as a reference.

Required:

- `VITE_API_BASE_URL` (example: `http://localhost:5000/api`)

## Installation

```bash
npm install
```

## Run in Development

```bash
npm run dev
```

By default, Vite runs on `http://localhost:5173`.

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Project Structure

```text
src/
	components/      Reusable UI and layout components
	context/         Auth state and hooks
	pages/           Route-level pages (student, teacher, admin, auth)
	services/        API client and request helpers
```

## Notes

- Authentication uses cookies (`withCredentials: true`) and refresh-token flow in `src/services/api.js`.
- Ensure the backend allows CORS for the client origin.
