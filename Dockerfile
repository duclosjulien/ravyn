# Dependencies
FROM eclipse-temurin:21-jdk-alpine AS dependencies
WORKDIR /build
COPY mvnw pom.xml ./
COPY .mvn ./.mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Build

# Node
FROM node:24-alpine AS frontend-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY frontend ./frontend
RUN npm run build

# Maven
FROM dependencies AS builder
COPY src ./src
COPY --from=frontend-builder /app/src/main/resources/static/js /build/src/main/resources/static/js
RUN ./mvnw clean package -DskipTests

# Run
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

RUN addgroup -S ravyn && adduser -S ravyn -G ravyn

COPY --from=builder /build/target/*.jar app.jar

RUN chown ravyn:ravyn app.jar

USER ravyn

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -q --spider http://localhost:8080/ || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
