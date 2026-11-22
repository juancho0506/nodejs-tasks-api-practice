// Single source of truth for task statuses. Add or rename a status here and the
// type, DTO validation and service all follow.
export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
