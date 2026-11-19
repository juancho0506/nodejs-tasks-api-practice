import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { TasksService } from '../src/tasks/tasks.service';

describe('Tasks API', () => {
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

  describe('POST /tasks', () => {
    it('creates a task with defaults', async () => {
      const res = await request(http).post('/tasks').send({ title: 'New task' }).expect(201);
      expect(res.body).toMatchObject({ title: 'New task', status: 'todo' });
      expect(typeof res.body.id).toBe('number');
    });

    it('ignores client-supplied id and createdAt', async () => {
      const res = await request(http)
        .post('/tasks')
        .send({ title: 'Sneaky', id: 999, createdAt: '1999-01-01' })
        .expect(201);
      expect(res.body.id).not.toBe(999);
      expect(res.body.createdAt).not.toBe('1999-01-01');
    });

    it('rejects a missing or empty title with 400', async () => {
      await request(http).post('/tasks').send({}).expect(400);
      await request(http).post('/tasks').send({ title: '' }).expect(400);
    });

    it('rejects an invalid status with 400', async () => {
      await request(http).post('/tasks').send({ title: 'x', status: 'banana' }).expect(400);
    });
  });

  describe('GET /tasks', () => {
    it('filters by status without changing any data', async () => {
      const res = await request(http).get('/tasks?status=done').expect(200);
      expect(res.body.map((t) => t.id)).toEqual([3]);

      const all = await request(http).get('/tasks').expect(200);
      expect(all.body.map((t) => t.status)).toEqual(['todo', 'in_progress', 'done']);
    });

    it('respects limit', async () => {
      const res = await request(http).get('/tasks?limit=2').expect(200);
      expect(res.body).toHaveLength(2);
    });

    it('rejects an invalid limit with 400', async () => {
      await request(http).get('/tasks?limit=abc').expect(400);
      await request(http).get('/tasks?limit=-1').expect(400);
    });

    it('caps the default page size at 50', async () => {
      const service = app.get(TasksService);
      for (let i = 0; i < 60; i++) service.create({ title: `t${i}` });
      const res = await request(http).get('/tasks').expect(200);
      expect(res.body).toHaveLength(50);
    });
  });

  describe('GET /tasks/:id', () => {
    it('returns the task', async () => {
      const res = await request(http).get('/tasks/2').expect(200);
      expect(res.body).toMatchObject({ id: 2, title: 'Review PR' });
    });

    it('returns 404 for an unknown id', async () => {
      await request(http).get('/tasks/9999').expect(404);
    });

    it('returns 400 for a non-numeric id', async () => {
      await request(http).get('/tasks/abc').expect(400);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('updates allowed fields', async () => {
      const res = await request(http).patch('/tasks/1').send({ status: 'done' }).expect(200);
      expect(res.body).toMatchObject({ id: 1, status: 'done' });
    });

    it('does not allow changing the id', async () => {
      const res = await request(http).patch('/tasks/1').send({ id: 50, title: 'Renamed' }).expect(200);
      expect(res.body.id).toBe(1);
      expect(res.body.title).toBe('Renamed');
    });

    it('returns 404 for an unknown id', async () => {
      await request(http).patch('/tasks/9999').send({ title: 'x' }).expect(404);
    });

    it('rejects an invalid status with 400', async () => {
      await request(http).patch('/tasks/1').send({ status: 'banana' }).expect(400);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('deletes the requested task and returns 204', async () => {
      await request(http).delete('/tasks/2').expect(204);
      const res = await request(http).get('/tasks').expect(200);
      expect(res.body.map((t) => t.id)).toEqual([1, 3]);
    });

    it('returns 404 and deletes nothing for an unknown id', async () => {
      await request(http).delete('/tasks/9999').expect(404);
      const res = await request(http).get('/tasks').expect(200);
      expect(res.body).toHaveLength(3);
    });
  });

  describe('GET /tasks/stats/by-assignee', () => {
    it('returns totals and done counts per assignee', async () => {
      const res = await request(http).get('/tasks/stats/by-assignee').expect(200);
      const byName = Object.fromEntries(res.body.map((r) => [r.assignee, r]));
      expect(byName.ana).toMatchObject({ total: 2, done: 1 });
      expect(byName.ben).toMatchObject({ total: 1, done: 0 });
    });

    it('stays fast with a large data set (performance)', async () => {
      const service = app.get(TasksService);
      for (let i = 0; i < 20000; i++) {
        service.create({ title: `t${i}`, assignee: `user${i % 5000}`, status: i % 3 === 0 ? 'done' : 'todo' });
      }
      const start = Date.now();
      await request(http).get('/tasks/stats/by-assignee').expect(200);
      expect(Date.now() - start).toBeLessThan(150);
    });
  });
});
