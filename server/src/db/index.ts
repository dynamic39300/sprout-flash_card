import Database from 'better-sqlite3';
import fs from 'node:fs';
import { env } from '../lib/env.js';

let instance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (instance) return instance;
  fs.mkdirSync(env.dataDir, { recursive: true });
  const db = new Database(env.dbFile);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  initSchema(db);
  instance = db;
  return db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      front_text   TEXT NOT NULL DEFAULT '',
      back_text    TEXT NOT NULL DEFAULT '',
      created_at   TEXT NOT NULL,
      updated_at   TEXT NOT NULL,
      deleted_at   TEXT
    );

    CREATE TABLE IF NOT EXISTS card_images (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id    INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
      side       TEXT NOT NULL CHECK(side IN ('front','back')),
      file_path  TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS tags (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS card_tags (
      card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
      tag_id  INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (card_id, tag_id)
    );

    CREATE INDEX IF NOT EXISTS idx_card_images_card ON card_images(card_id);
    CREATE INDEX IF NOT EXISTS idx_cards_deleted ON cards(deleted_at);

    CREATE TABLE IF NOT EXISTS review_states (
      card_id       INTEGER PRIMARY KEY REFERENCES cards(id) ON DELETE CASCADE,
      ease_factor   REAL    NOT NULL DEFAULT 2.5,
      interval_days INTEGER NOT NULL DEFAULT 0,
      repetitions   INTEGER NOT NULL DEFAULT 0,
      due_date      TEXT    NOT NULL,
      last_reviewed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS review_logs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id     INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
      reviewed_at TEXT    NOT NULL,
      review_day  TEXT    NOT NULL,
      rating      TEXT    NOT NULL CHECK(rating IN ('again','hard','good','easy'))
    );

    CREATE INDEX IF NOT EXISTS idx_review_states_due ON review_states(due_date);
    CREATE INDEX IF NOT EXISTS idx_review_logs_day   ON review_logs(review_day);
  `);
}
