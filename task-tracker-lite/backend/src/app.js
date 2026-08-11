
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { openDb, all, run, get } from './db/sqlite.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Ensure data folder exists
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  function errorPayload(code, message, details = []) {
    return { error: { code, message, details } };
  }

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.get('/api/tasks', async (req, res) => {
    const db = openDb();
    try {
      const { q, status, sortBy = 'createdAt', sortDir = 'desc' } = req.query;

      const where = [];
      const params = [];

      if (q) {
        where.push('(title LIKE ? OR description LIKE ?)');
        params.push(`%${q}%`, `%${q}%`);
      }
      if (status && status !== 'All') {
        where.push('status = ?');
        params.push(status);
      }

      const allowedSort = new Set(['createdAt', 'title']);
      const sBy = allowedSort.has(sortBy) ? sortBy : 'createdAt';
      const sDir = (String(sortDir).toLowerCase() === 'asc') ? 'asc' : 'desc';

      const sql = `SELECT * FROM tasks ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY ${sBy} ${sDir}`;
      const tasks = await all(db, sql, params);
      res.json({ tasks });
    } catch (e) {
      res.status(500).json(errorPayload('INTERNAL_ERROR', 'Failed to list tasks'));
    } finally {
      db.close();
    }
  });

  app.post('/api/tasks', async (req, res) => {
    const db = openDb();
    try {
      const { title, description = '', status = 'Todo', dueDate = null } = req.body || {};
      if (!title || !String(title).trim()) {
        return res.status(400).json(errorPayload('VALIDATION_ERROR', 'Title is required'));
      }
      const st = ['Todo', 'In Progress', 'Done'].includes(status) ? status : 'Todo';

      const result = await run(db,
        `INSERT INTO tasks (title, description, status, dueDate) VALUES (?, ?, ?, ?)`,
        [String(title).trim(), String(description || ''), st, dueDate]
      );
      const task = await get(db, `SELECT * FROM tasks WHERE id = ?`, [result.lastID]);
      res.status(201).json({ task });
    } catch (e) {
      res.status(500).json(errorPayload('INTERNAL_ERROR', 'Failed to create task'));
    } finally {
      db.close();
    }
  });

  app.put('/api/tasks/:id', async (req, res) => {
    const db = openDb();
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json(errorPayload('VALIDATION_ERROR', 'Invalid id'));

      const existing = await get(db, `SELECT * FROM tasks WHERE id = ?`, [id]);
      if (!existing) return res.status(404).json(errorPayload('NOT_FOUND', 'Task not found'));

      const { title, description, status, dueDate } = req.body || {};
      const nextTitle = (title !== undefined) ? String(title).trim() : existing.title;
      if (!nextTitle) return res.status(400).json(errorPayload('VALIDATION_ERROR', 'Title is required'));

      const nextStatus = (status !== undefined)
        ? (['Todo', 'In Progress', 'Done'].includes(status) ? status : existing.status)
        : existing.status;

      const nextDesc = (description !== undefined) ? String(description || '') : existing.description;
      const nextDue = (dueDate !== undefined) ? dueDate : existing.dueDate;

      await run(db,
        `UPDATE tasks SET title = ?, description = ?, status = ?, dueDate = ? WHERE id = ?`,
        [nextTitle, nextDesc, nextStatus, nextDue, id]
      );

      const task = await get(db, `SELECT * FROM tasks WHERE id = ?`, [id]);
      res.json({ task });
    } catch (e) {
      res.status(500).json(errorPayload('INTERNAL_ERROR', 'Failed to update task'));
    } finally {
      db.close();
    }
  });

  app.delete('/api/tasks/:id', async (req, res) => {
    const db = openDb();
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json(errorPayload('VALIDATION_ERROR', 'Invalid id'));
      const existing = await get(db, `SELECT * FROM tasks WHERE id = ?`, [id]);
      if (!existing) return res.status(404).json(errorPayload('NOT_FOUND', 'Task not found'));

      await run(db, `DELETE FROM tasks WHERE id = ?`, [id]);
      res.status(204).send();
    } catch (e) {
      res.status(500).json(errorPayload('INTERNAL_ERROR', 'Failed to delete task'));
    } finally {
      db.close();
    }
  });

  return app;
}