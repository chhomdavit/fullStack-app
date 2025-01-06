#
# Build stage
#
FROM maven:3-openjdk-21 AS build
WORKDIR /app
COPY . /app/
RUN mvn clean package

#
# Package stage
#
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY target/*.jar /app/backend-byspring.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "backend-byspring.jar"]


# CMD
# docker build -t backend-byspring.jar .
# docker tag backend-byspring.jar chhomdavit/dev:backend-byspring.jar
# docker push chhomdavit/dev:backend-byspring.jar
