# creationary-backend
A creator platform for selling media content by creators to members


# Database Setup

This README documents the database layer setup for the application. The current milestone covers the PostgreSQL database, Prisma ORM configuration, environment variables, and Docker setup.

---

## Requirements

Ensure the following are installed:

- Docker and Docker Compose
- Node.js and npm

---

## Environment Setup

Copy the example environment file and create your own:

```bash
cp .env.example .env
```

The `.env` file contains your database connection string for Prisma. The default configuration connects to the PostgreSQL instance defined in `docker-compose.yml`.

---

## Docker Database Setup

Start the PostgreSQL container:

```bash
docker compose up -d
```

Stop and remove the container:

```bash
docker compose down
```

Verify the container is running:

```bash
docker ps
```

---

## Prisma Setup

Install dependencies if not already done:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run the initial migration to create the database schema:

```bash
npx prisma migrate dev --name init
```

Open Prisma Studio to interact with the database:

```bash
npx prisma studio
```

---

## Folder Structure (database)

```
prisma/
 ├─ schema.prisma
 └─ migrations/
docker-compose.yml
.env
.env.example
```

---

## What Was Covered

- Prisma schema created
- Docker PostgreSQL container defined
- `.env.example` and `.env` created
- Initial Prisma migration executed

---