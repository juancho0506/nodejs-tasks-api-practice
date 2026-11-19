# Tasks API: review and fix exercise

A small in-memory NestJS Tasks API. It was written quickly and has problems.
Your job in about 45 minutes: find them, fix them, and show how you verified each fix.

## Run

```bash
npm install
npm test        # run the test suite (many tests fail on purpose)
npm start       # API on http://localhost:3000
```

Requires Node 18+. Dependencies are pinned to Nest 11 and TypeScript 5 so Jest works out of the box.

## Endpoints

| Method | Path | Notes |
|--------|------|-------|
| POST | /tasks | body: `title` (required), `status`, `assignee` |
| GET | /tasks | query: `status`, `limit` (default 50, max 100) |
| GET | /tasks/:id | numeric id |
| PATCH | /tasks/:id | partial update of `title`, `status`, `assignee` |
| DELETE | /tasks/:id | returns 204 |
| GET | /tasks/stats/by-assignee | total and done counts per assignee |

## Tasks

1. Read the code first and list what looks wrong before changing anything.
2. Make the failing tests pass, one fix at a time. Keep each change small.
3. The last test is a performance check. Find out why it is slow and fix it.
4. Add one test of your own for a case you think is missing.

## Rules of the exercise

- Do not edit the tests to make them pass (adding new ones is fine).
- Explain what you checked in every AI-generated change before accepting it.
- Keep it simple: no database, no extra frameworks.

Suggested git flow: work on a branch such as `fix/tasks-api`, one commit per fix.
