# MinIO / S3 Presigned URL API

This project is a Node.js Express API that generates presigned URLs for uploading and downloading objects from any S3-compatible storage (AWS S3, MinIO, DigitalOcean Spaces, etc).

---

## Prerequisites

- [Node.js](https://nodejs.org/) (for local development)
- [Docker](https://www.docker.com/get-started) installed (for containerization)
- Access to an S3-compatible service with credentials

---

## Environment Variables

Create a `.env` file in the project root with the following:

```env
API_KEY=your-secure-api-key-here
PORT=8080
```

## Build and start the container

```sh
docker compose up --build
```
