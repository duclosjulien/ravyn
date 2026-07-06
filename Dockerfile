# Dependencies
FROM eclipse-temurin:21-jdk-alpine AS dependencies
WORKDIR /build
COPY mvnw pom.xml ./
COPY .mvn ./.mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Build
FROM dependencies AS builder
COPY src ./src
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
