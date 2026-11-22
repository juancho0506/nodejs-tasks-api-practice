import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { TasksService } from '../src/tasks/tasks.service';

describe('Tasks API - null / unknown field handling', () => {
  let app: INestApplication;
  let http: any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    http = app.getHttpServer();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /tasks (pipe enabled)', () => {
    it('defaults status to todo when status is omitted', async () => {
      const res = await request(http).post('/tasks').send({ title: 'x' }).expect(201);
      expect(res.body.status).toBe('todo');
    });

    it('rejects null status and null assignee with 400', async () => {
      await request(http).post('/tasks').send({ title: 'x', status: null }).expect(400);
      await request(http).post('/tasks').send({ title: 'x', assignee: null }).expect(400);
    });

    it('rejects a null title with 400', async () => {
      await request(http).post('/tasks').send({ title: null }).expect(400);
    });

    it('does not store unknown fields', async () => {
      const res = await request(http).post('/tasks').send({ title: 'x', isAdmin: true }).expect(201);
      expect(res.body).not.toHaveProperty('isAdmin');
    });
  });

  describe('PATCH /tasks/:id (pipe enabled)', () => {
    it('rejects null for title, status and assignee with 400', async () => {
      await request(http).patch('/tasks/1').send({ title: null }).expect(400);
      await request(http).patch('/tasks/1').send({ status: null }).expect(400);
      await request(http).patch('/tasks/1').send({ assignee: null }).expect(400);
    });

    it('ignores unknown fields and does not store them', async () => {
      const res = await request(http).patch('/tasks/1').send({ title: 'R', foo: 'bar' }).expect(200);
      expect(res.body.title).toBe('R');
      expect(res.body).not.toHaveProperty('foo');
    });

    it('leaves fields untouched when omitted', async () => {
      const res = await request(http).patch('/tasks/1').send({ title: 'R' }).expect(200);
      expect(res.body).toMatchObject({ status: 'todo', assignee: 'ana' });
    });
  });

  describe('TasksService called directly (no validation pipe)', () => {
    it('create ignores id, createdAt and unknown fields', () => {
      const service = app.get(TasksService);
      const task: any = service.create({ title: 'x', id: 999, createdAt: '1999-01-01', isAdmin: true } as any);
      expect(task.id).not.toBe(999);
      expect(task.createdAt).not.toBe('1999-01-01');
      expect(task).not.toHaveProperty('isAdmin');
      expect(task.status).toBe('todo');
    });

    it('update ignores id, createdAt and unknown fields', () => {
      const service = app.get(TasksService);
      const task: any = service.update(1, { title: 'R', id: 50, createdAt: '1999-01-01', foo: 1 } as any);
      expect(task.id).toBe(1);
      expect(task.createdAt).toBe('2026-01-01T00:00:00.000Z');
      expect(task.title).toBe('R');
      expect(task).not.toHaveProperty('foo');
    });
  });
});
