import { Injectable, NotFoundException } from '@nestjs/common';

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

  create(data: { title: string; status?: TaskStatus; assignee?: string }): Task {
    const task: Task = {
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      status: data.status ?? 'todo',
      title: data.title,
      assignee: data.assignee,
    };
    this.tasks.push(task);
    return task;
  }

  findAll(status?: string, limit = 50): Task[] {
    const result = status ? this.tasks.filter((t) => t.status === status) : this.tasks;
    return result.slice(0, limit);
  }

  findOne(id: number): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  update(id: number, data: Partial<Pick<Task, 'title' | 'status' | 'assignee'>>): Task {
    const task = this.findOne(id);
    Object.assign(task, data);
    return task;
  }

  remove(id: number): void {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException(`Task ${id} not found`);
    this.tasks.splice(index, 1);
  }

  statsByAssignee() {
    const stats = new Map<string, { assignee: string; total: number; done: number }>();
    for (const t of this.tasks) {
      const name = t.assignee ?? 'unassigned';
      let row = stats.get(name);
      if (!row) stats.set(name, (row = { assignee: name, total: 0, done: 0 }));
      row.total++;
      if (t.status === 'done') row.done++;
    }
    return [...stats.values()];
  }
}
