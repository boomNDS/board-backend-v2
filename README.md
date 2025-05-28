# Board Backend V2

A Board API backend application.

<p align="center">
  <a href="https://github.com/boomNDS/board-backend-v2/actions/workflows/ci.yml" target="_blank">
    <img src="https://github.com/boomNDS/board-backend-v2/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
  </a>
  <a href="https://github.com/boomNDS/board-backend-v2/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/boomNDS/board-backend-v2" alt="License" />
  </a>
</p>

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/) ORM
- **Testing**: [Vitest](https://vitest.dev/) for unit and integration tests
- **Code Quality**:
  - [Biome](https://biomejs.dev/) for formatting and linting
  - [Husky](https://typicode.github.io/husky/) for git hooks
- **API Documentation**: [Swagger/OpenAPI](https://docs.nestjs.com/openapi/introduction)
- **Date Handling**: [Day.js](https://day.js.org/) for date manipulation
- **Containerization**: Docker and Docker Compose

## Prerequisites

- Node.js 20.x
- Docker and Docker Compose
- Yarn package manager

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/boomNDS/board-backend-v2.git
cd board-backend-v2
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/board_db?schema=public"
```

### 4. Database Setup

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

Initialize the database with Prisma:

```bash
# Generate Prisma Client
yarn prisma generate

# Run migrations
yarn prisma migrate dev
```

### 5. Running the Application

Development mode:

```bash
yarn start:dev
```

Production mode:

```bash
yarn build
yarn start:prod
```

## Development

### Code Formatting and Linting

```bash
# Format code
yarn format

# Lint code
yarn lint

# Check code
yarn check
```

### Creating New Data Models

1. Add your model to `prisma/schema.prisma`:

```prisma
model YourModel {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ...
}
```

2. Generate and apply the migration:

```bash
yarn prisma migrate dev --name add_your_model
```

3. Generate Prisma Client:

```bash
yarn prisma generate
```

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:cov

# Run e2e tests
yarn test:e2e
```

### API Documentation

Once the application is running, visit:

```
http://localhost:3000/api
```

for the Swagger API documentation.

## Docker Support

### Building the Docker Image

```bash
docker build -t board-backend-v2 .
```

### Running with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
