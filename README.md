# Ravyn

Ravyn is a real-time messaging app focused on simple private conversations and a calmer communication experience.

It is built with Spring Boot, PostgreSQL, TypeScript, and WebSockets.

The project is also a way for me to learn how full-stack software is designed properly: backend layers, DTOs, services, repositories, authentication, persistence, deployment, and real-time communication.

The goal is to build a chat app that feels simple on the surface, while being thoughtfully structured underneath.


## Project status

Ravyn is under active development and is not yet intended for production deployment.

The current application supports session-based authentication, private one-to-one conversations, persistent message history, and real-time messaging through WebSockets.


## Running Ravyn locally

### Option 1: Docker Compose

Recommended for running the full app locally.

#### Requirements

- Docker Desktop or Docker Engine
- Docker Compose

No local Java, Maven, or PostgreSQL installation is required.

#### Setup

Copy the example environment file:

```bash
cp .env.example .env
```

The `.env` file is used by Docker Compose to configure the local PostgreSQL container. Do not commit your real `.env` file.

#### Start

```bash
docker compose up --build
```

Open the app at:

```text
http://localhost:8080
```

#### Stop

```bash
docker compose down
```

#### Reset the Docker database

This removes the local Docker PostgreSQL volume. On the next startup, Flyway recreates the schema from the migration files.

```bash
docker compose down -v
docker compose up --build
```

#### Smoke test

After starting the app:

1. Register a user.
2. Log out.
3. Register or log in as another user.
4. Create a conversation.
5. Send a message.
6. Refresh the page and confirm the session and message history still work.

### Option 2: Local development with IntelliJ

Use this if you want to run the Spring Boot app directly from your machine.

#### Requirements

- Java 21
- Node.js 24 LTS
- Local PostgreSQL running with the `ravyn` database and matching credentials, or `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` set explicitly

A separate Maven installation is not required because the Maven wrapper is included in the project.

#### Build the frontend

After a clean clone, install the frontend dependencies and generate the browser-ready JavaScript:

```bash
npm ci
npm run build
```

#### Start

```bash
./mvnw spring-boot:run
```

Open the app at:

```text
http://localhost:8080
```

## Frontend build

Ravyn's frontend is written in TypeScript and compiled into Spring Boot's static resources.

### Requirements

- Node.js 24 LTS

If you use `nvm`, select the supported Node.js version with:

```bash
nvm use
```

Install the exact dependencies from `package-lock.json`:

```bash
npm ci
```

Check the TypeScript without generating JavaScript:

```bash
npm run typecheck
```

Create a clean frontend build:

```bash
npm run build
```

The build generates browser-ready files in:

```text
src/main/resources/static/js/
```

This directory contains generated files and is intentionally excluded from Git. Run the frontend build before starting the Spring Boot application after a clean clone.


## Backend tests

Ravyn's integration tests use Testcontainers to start a temporary PostgreSQL container. A separately configured local PostgreSQL database is not required.

### Requirements

- Java 21
- Docker Desktop or Docker Engine running

Run the backend test suite with:

```bash
./mvnw test
```

Testcontainers creates the PostgreSQL container for the test run and removes it afterward.

## Pull request verification

Pull requests targeting `dev` or `main` automatically run the following checks:

- Type-check and build the TypeScript frontend
- Run the backend test suite with Testcontainers
- Build the complete Docker image

All three checks must pass before the pull request can be merged.
