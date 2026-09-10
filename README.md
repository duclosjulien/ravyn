# Ravyn

Ravyn is a full-stack real-time messaging app built around private one-to-one conversations. The web app uses Spring Boot, PostgreSQL, TypeScript, and WebSockets and is deployed on AWS.

**Live app:** [ravynchat.com](https://ravynchat.com)

## About

The web app is kept relatively simple, while most of the project focuses on the architecture underneath it: service boundaries, DTOs, validation, database design, session management, and communication between the frontend and backend.

The project is also starting to explore ideas around more intentional communication. The mobile client will take this further, particularly around notifications and how they are handled.

## Features

* Session-based registration and authentication
* User connections with request and acceptance flows
* Private one-to-one conversations between connected users
* Persistent message history
* Real-time message delivery over WebSockets
* Conversation previews and unread indicators
* Customizable display names

## Architecture & tech stack

Ravyn uses a layered Spring Boot backend. Controllers handle HTTP and WebSocket boundaries, services contain application logic, repositories handle persistence, and DTOs define the data exchanged with clients.

The web frontend is written in TypeScript and served as static resources by Spring Boot. REST is used for authentication, connections, conversations, and message history, while STOMP over WebSockets handles real-time message delivery.

### Backend

* Java 21
* Spring Boot 3
* Spring Security
* Spring Data JPA / Hibernate
* WebSockets with STOMP and SockJS
* PostgreSQL
* Flyway

### Web frontend

* TypeScript
* HTML / CSS
* STOMP.js
* SockJS

### Mobile

* React Native
* Expo
* TypeScript

The mobile client is still in development and currently focuses on the application shell and UI.

### Testing & tooling

* JUnit
* Mockito
* Testcontainers
* Maven
* Docker / Docker Compose
* GitHub Actions

## Deployment

Ravyn is deployed on AWS as a containerized Spring Boot application.

The application runs on Amazon ECS with Fargate behind an Application Load Balancer. PostgreSQL runs separately on Amazon RDS, and sensitive runtime configuration is provided to the ECS task through AWS Systems Manager Parameter Store.

Deployments are automated with GitHub Actions. A push to `main` builds an ARM64 Docker image, authenticates to AWS through GitHub OIDC, pushes the image to Amazon ECR, creates a new ECS task definition revision, and updates the running ECS service. The workflow then waits for the service to stabilize.

The deployment uses:

* **Amazon ECR** for Docker image storage
* **Amazon ECS / Fargate** for running the application
* **Amazon RDS** for PostgreSQL
* **Application Load Balancer** for routing and health checks
* **AWS Certificate Manager** for HTTPS
* **Systems Manager Parameter Store** for sensitive runtime configuration
* **AWS IAM and GitHub OIDC** for deployment authentication
* **GitHub Actions** for continuous deployment

## Project status

Ravyn is under active development and is currently deployed at [ravynchat.com](https://ravynchat.com).

The web app is functional, but the project is still evolving. Current work is focused on refining the application and developing the mobile client.

Longer-term work includes group conversations, more control over notifications, and stronger message privacy.

## Running Ravyn locally

Ravyn can also be run locally with Docker Compose.

### Requirements

* Docker Desktop or Docker Engine
* Docker Compose

Copy the example environment file:

```bash
cp .env.example .env
```

Start the application:

```bash
docker compose up --build
```

Ravyn will be available at:

```text
http://localhost:8080
```

Stop the application with:

```bash
docker compose down
```
