# GitHub for Beginners
[גרסה בעברית](README.he.md)

An interactive guide that teaches the basics of Git and GitHub, lesson by lesson.
Built as a full stack project: React frontend, Express API, SQLite database.

![Screenshot](docs/screenshot.png)

## Features

- Browse lessons: repository, commit, push and pull, branch, pull request
- Open a lesson to read the full explanation
- Mark lessons as completed
- Progress bar that updates automatically and is saved in the database

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** SQLite (better-sqlite3)

## Getting Started

You need Node.js installed. You will run two terminals, one for the server and one for the client.

**1. Clone the project**

```bash
git clone https://github.com/Avigailv/github-guide.git
cd github-guide
```

**2. Start the server (terminal 1)**

```bash
cd server
npm install
node index.js
```

The API runs on http://localhost:3000

**3. Start the client (terminal 2)**

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## API Endpoints

| Method | Endpoint                    | Description                    |
| ------ | --------------------------- | ------------------------------ |
| GET    | `/api/lessons`              | List all lessons               |
| GET    | `/api/lessons/:id`          | Get a single lesson            |
| PATCH  | `/api/lessons/:id/complete` | Mark a lesson done or not done |
| GET    | `/api/progress`             | Get completion progress        |

## Future Improvements

- Quiz at the end of each lesson
- User registration and login
- Deployment