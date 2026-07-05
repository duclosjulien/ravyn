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
COPY --from=builder /build/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]