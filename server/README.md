# SmartHR Backend API

Backend server for the SmartHR job portal application.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Create database and run migrations:
```bash
createdb shb_db
npm run db:migrate
npm run db:seed  # Optional: seed with test data
```

4. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data

## Environment Variables

See `.env.example` for required environment variables.

