import { Injectable } from '@nestjs/common';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  assignee?: string;
  createdAt: string;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    { id: 1, title: 'Write design doc', status: 'todo', assignee: 'ana', createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 2, title: 'Review PR', status: 'in_progress', assignee: 'ben', createdAt: '2026-01-02T00:00:00.000Z' },
    { id: 3, title: 'Ship release', status: 'done', assignee: 'ana', createdAt: '2026-01-03T00:00:00.000Z' },
  ];
  private nextId = 4;

  create(data: any) {
    const task = {
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      status: 'todo',
      ...data,
    };
    this.tasks.push(task);
    return task;
  }

  findAll(status?: string, limit?: string) {
    let result = this.tasks;
    if (status) {
      result = result.filter((t) => (t.status = status as TaskStatus));
    }
    return result.slice(0, limit as any);
  }

  findOne(id: any) {
    return this.tasks.find((t) => t.id === id);
  }

  update(id: any, data: any) {
    const task = this.tasks.find((t) => t.id == id);
    Object.assign(task, data);
    return task;
  }

  remove(id: any) {
    const index = this.tasks.findIndex((t) => t.id == id);
    this.tasks.splice(index, 1);
  }

  statsByAssignee() {
    const assignees = [...new Set(this.tasks.map((t) => t.assignee ?? 'unassigned'))];
    return assignees.map((name) => ({
      assignee: name,
      total: this.tasks.filter((t) => (t.assignee ?? 'unassigned') === name).length,
      done: this.tasks.filter((t) => (t.assignee ?? 'unassigned') === name && t.status === 'done').length,
    }));
  }
}
