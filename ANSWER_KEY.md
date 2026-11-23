# Answer key (do not read before you try)

Reference solution: `solution/` folder (copy over `src/` to apply; verified 19/19 tests pass).

| # | Where | Problem | Fix |
|---|-------|---------|-----|
| 1 | `create` | `...data` spread lets clients set `id`, `createdAt`, anything (mass assignment) | DTO with `class-validator` plus `ValidationPipe({ whitelist: true })` in `app.setup.ts` |
| 2 | `create`/`update` | No validation: missing title, bad status accepted | DTO decorators (`@IsNotEmpty`, `@IsIn`) |
| 3 | `findAll` | `t.status = status` is an assignment, not a comparison: it overwrites every task and the filter is always truthy | `t.status === status` |
| 4 | `findAll` | `limit` unparsed and unvalidated, no default or cap, `abc` gives an empty list | Parse integer, 1 to 100, default 50, 400 on invalid |
| 5 | `findOne` | `===` between a number id and a string param never matches; missing task returns 200 with empty body | `ParseIntPipe`, throw `NotFoundException` |
| 6 | `update` | Crashes with 500 when the task is missing; client can overwrite `id` | Look up with `findOne` (404), whitelist DTO |
| 7 | `remove` | `findIndex` returns -1, then `splice(-1, 1)` deletes the last task | Check for -1 and return 404 |
| 8 | controller `remove` | Returns 200 with a body | `@HttpCode(204)`, no body |
| 9 | `statsByAssignee` | Re-filters the whole array for every assignee: O(n x assignees) | Single pass with a `Map`: O(n) |

## Review questions an interviewer may ask

- Why does whitelist matter for security? (mass assignment)
- Why is ordering of `stats/by-assignee` before `:id` in the controller important? (route matching)
- What would change if this were backed by a database? (indexes, pagination by cursor, unique constraints, transactions)
- What would you do next with more time? (more tests, error filter, auth, rate limiting, observability)
