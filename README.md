# ERCS EOC Platform

A React application [ERCS EOC](https://eoc-ercs.redcrosseth.org/) website.

---

## Development

### Prerequisites

Before you start, create a `.env.local` file:

```bash
touch .env.local
```

Set the following environment variables:

```env
PORT=3056
APP_GRAPHQL_ENDPOINT=<api-endpoint>
APP_GRAPHQL_CODEGEN_ENDPOINT=<graphql-api-endpoint>
APP_TITLE=<app-title>
APP_ENVIRONMENT="app-env"
APP_MAPBOX_TOKEN="token"
APP_GO_API=<go-api-url>
APP_GO_URL=<go-website-url>
APP_GO_RISK_API_ENDPOINT=<go-risk-api>
```

---

## Local Development (Using Docker, with Backend)

This project uses Git submodules. After cloning, initialize and update them:

```bash
git submodule update --init --recursive
```

We use a `docker-compose.yml` file located at `./backend/docker-compose.yml`.

To run it, add the following to your `.env.local`:

```env
# Include the backend services
COMPOSE_FILE=./backend/docker-compose.yaml:docker-compose.yml
# Use the same .env file for both backend and web-app
BACKEND_ENV_FILE=../.env
```

Then start the full stack:

```bash
docker compose up
```

> **Note:** `../` refers to the ERCS EOC Platform folder, relative to `./backend/docker-compose.yml`
> (the main Docker Compose file).

---