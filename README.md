# Connection Source Control

## Description

The Connection Source Control is a backend service built with NestJS that allows you to manage database source
connections (
MySQL and PostgreSQL) and retrieve schema information. It provides endpoints for creating, testing, updating, and
deleting source connections, as well as for retrieving lists of tables, table schemas, and sample data.

## Features

- **Source Connection Management:**
    - Create, retrieve, update, and delete source connections.
    - Supports MySQL and PostgreSQL.
    - Test connection before saving.
- **Schema Retrieval:**
    - Retrieve a list of tables for a source connection.
    - Retrieve the schema of a table (column names, data types, primary keys).
- **Sample Data Retrieval:**
    - Retrieve sample data from a table.
    - Control the number of rows returned.
- **Database Support:**
    - MySQL (5.5, 8+)
    - PostgreSQL (10+)
- **API Documentation:**
    - Swagger integration for API documentation and exploration.

## Environment Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)
- [Docker](https://www.docker.com/) (version 20.10 or later)
- [Docker Compose](https://docs.docker.com/compose/) (version 1.28 or later)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mokocup/connection-source-control
   cd connection-source-control
   ```

2. **Set up environment variables:**

    - Copy`.env.example` file in the project root directory.
    - Modifying them as necessary for your local setup:

3. **Start the databases and application using Docker Compose:**

   ```bash
   docker-compose up -d
   ```

   This command will:

    - Start the MySQL and PostgreSQL databases as Docker containers.
    - Build and start the NestJS application container.
    - The `-d` flag runs the containers in detached mode (in the background).

## Running the Application

Once the Docker Compose setup is complete, the API will be running at `http://localhost:3000`.

- **API:** The main API endpoints will be available at this address.
- **Swagger:** The Swagger API documentation will be available at `http://localhost:3000/api`. You can use this to
  explore the available endpoints and test them directly.

## Database Configuration

The Docker Compose include seeding data for both MySQL and PostgreSQL databases.

### MySQL Configuration

```json
{
  "host": "db-seed-pg",
  "port": 3306,
  "username": "root",
  "password": "seed_root_password",
  "database": "employees"
}
```

### PostgresQL Configuration

```json
{
  "host": "db-seed-pg",
  "port": 5432,
  "username": "postgres",
  "password": "postgres",
  "database": "tcb",
  "schema": "tcb"
}
```