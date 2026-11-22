import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from './dto/list-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './task-status';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  assignee?: string;
  createdAt: string;
}

const UPDATABLE_FIELDS = ['title', 'status', 'assignee'] as const;

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    { id: 1, title: 'Write design doc', status: 'todo', assignee: 'ana', createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 2, title: 'Review PR', status: 'in_progress', assignee: 'ben', createdAt: '2026-01-02T00:00:00.000Z' },
    { id: 3, title: 'Ship release', status: 'done', assignee: 'ana', createdAt: '2026-01-03T00:00:00.000Z' },
  ];
  private nextId = 4;

  create(data: CreateTaskDto) {
    // Pick known fields explicitly: safe even if the validation pipe is off.
    const { title, status = 'todo', assignee } = data;
    const task: Task = {
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      title,
      status,
      assignee,
    };
    this.tasks.push(task);
    return task;
  }

  findAll(status?: string, limit: number = DEFAULT_PAGE_SIZE) {
    let result = this.tasks;
    if (status) {
      result = result.filter((t) => t.status === status);
    }
    return result.slice(0, Math.min(limit, MAX_PAGE_SIZE));
  }

  findOne(id: number): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  update(id: number, data: UpdateTaskDto): Task {
    const task = this.findOne(id);
    // Only these fields are updatable, whatever the caller passes in.
    for (const key of UPDATABLE_FIELDS) {
      if (data[key] !== undefined) Object.assign(task, { [key]: data[key] });
    }
    return task;
  }

  remove(id: number): void {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException(`Task ${id} not found`);
    this.tasks.splice(index, 1);
  }

  statsByAssignee() {
    // Single pass: O(n). Map keeps first-appearance order of assignees.
    const stats = new Map<string, { assignee: string; total: number; done: number }>();
    for (const task of this.tasks) {
      const name = task.assignee ?? 'unassigned';
      let entry = stats.get(name);
      if (!entry) {
        entry = { assignee: name, total: 0, done: 0 };
        stats.set(name, entry);
      }
      entry.total++;
      if (task.status === 'done') entry.done++;
    }
    return [...stats.values()];
  }
}
