# Use the official MySQL image as a base image
FROM mysql:8.0

WORKDIR /app

ARG DB_DOWNLOAD_URL="https://github.com/datacharmer/test_db/releases/download/v1.0.7/test_db-1.0.7.tar.gz"

RUN microdnf install -y curl tar

RUN curl -L ${DB_DOWNLOAD_URL} -o test_db.tar.gz

RUN tar xzf test_db.tar.gz

WORKDIR /app/test_db
RUN cp employees.sql /docker-entrypoint-initdb.d/employees.sql

RUN rm -rf test_db.tar.gz test_db && \
    microdnf clean all

EXPOSE 3306
