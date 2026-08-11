
import fs from 'fs';
import path from 'path';
import { openDb, run, get, dbPath } from './sqlite.js';

const migrationsDir = path.join(process.cwd(), 'migrations');

async function ensureSchemaMigrations(db) {
  await run(db, `CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL)`);
}

async function applied(db, id) {
  const row = await get(db, `SELECT id FROM schema_migrations WHERE id = ?`, [id]);
  return !!row;
}

async function applyMigration(db, id, sql) {
  await run(db, 'BEGIN');
  try {
    await run(db, sql);
    await run(db, `INSERT INTO schema_migrations (id, applied_at) VALUES (?, datetime('now'))`, [id]);
    await run(db, 'COMMIT');
    console.log(`Applied migration ${id}`);
  } catch (e) {
    await run(db, 'ROLLBACK');
    throw e;
  }
}

async function main() {
  if (!fs.existsSync(migrationsDir)) {
    console.error(`Migrations directory not found: ${migrationsDir}`);
    process.exit(1);
  }

  console.log(`Using SQLite database file: ${dbPath}`);

  let db;
  try {
    db = openDb();
  } catch (err) {
    console.error(`Failed to open SQLite database at ${dbPath}`);
    console.error(err);
    process.exit(1);
  }

  await ensureSchemaMigrations(db);

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const id = file;
    if (await applied(db, id)) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    await applyMigration(db, id, sql);
  }

  db.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});