# Task API

> আমার আসল GitHub অ্যাকাউন্টে এখন প্রবেশ করতে পারতেছি না, কারণ সেই অ্যাকাউন্টের Two-Factor Authentication-এর সাথে যুক্ত সিম কার্ডটি হারিয়ে গেছে।
> অ্যাসাইনমেন্ট জমা দেওয়ার জন্য  অ্যাকাউন্টটি ব্যবহার করেছি।

A REST API built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.

## Features

| Endpoint | Method | Description |
|---|---|---|
| `/api/tasks` | POST | Create a task (validation, 201 / 400) |
| `/api/tasks` | GET | List tasks with pagination & status filter |

## Task Model

| Field | Type | Notes |
|---|---|---|
| `title` | String | **Required** |
| `status` | String | `pending` \| `in-progress` \| `done` (default: `pending`) |
| `dueDate` | Date | Optional |
| `userId` | ObjectId | Reference to User (optional) |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

## Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd task-api

# 2. Install dependencies
npm install

# 3. Create .env from example
cp .env.example .env
# Edit .env with your MONGO_URI and PORT

# 4. Start the server
npm start          # production
npm run dev        # development (nodemon)
```

## API Usage

### POST /api/tasks

**Request body (JSON)**
```json
{
  "title": "Finish assignment",
  "status": "in-progress",
  "dueDate": "2024-12-31",
  "userId": "60d5ec49f1b2c8b1f8e4e1a1"
}
```

**Success – 201**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Finish assignment",
    "status": "in-progress",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "userId": "60d5ec49f1b2c8b1f8e4e1a1",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Validation error – 400**
```json
{
  "success": false,
  "errors": [{ "msg": "Title is required", "path": "title" }]
}
```

### GET /api/tasks?page=1&limit=10&status=done

**Response – 200**
```json
{
  "success": true,
  "total": 42,
  "page": 1,
  "limit": 10,
  "data": [ /* array of task objects */ ]
}
```

