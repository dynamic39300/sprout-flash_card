import { getDb } from './index.js';
import type { Card, CardSide, CreateCardInput, UpdateCardInput } from '../types.js';

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

interface CardRow {
  id: number;
  front_text: string;
  back_text: string;
  created_at: string;
  updated_at: string;
}

function nowIso(): string {
  return new Date().toISOString();
}

function attachRelations(row: CardRow): Card {
  const db = getDb();
  const images = db
    .prepare(
      `SELECT side, file_path FROM card_images WHERE card_id = ? ORDER BY sort_order, id`,
    )
    .all(row.id) as { side: CardSide; file_path: string }[];
  const tags = db
    .prepare(
      `SELECT t.name FROM tags t
       JOIN card_tags ct ON ct.tag_id = t.id
       WHERE ct.card_id = ? ORDER BY t.name`,
    )
    .all(row.id) as { name: string }[];
  const rs = db
    .prepare(`SELECT due_date FROM review_states WHERE card_id = ?`)
    .get(row.id) as { due_date: string } | undefined;

  return {
    id: row.id,
    frontText: row.front_text,
    backText: row.back_text,
    frontImages: images.filter((i) => i.side === 'front').map((i) => i.file_path),
    backImages: images.filter((i) => i.side === 'back').map((i) => i.file_path),
    tags: tags.map((t) => t.name),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    dueDate: rs?.due_date,
  };
}

function replaceImages(cardId: number, side: CardSide, paths: string[]): void {
  const db = getDb();
  db.prepare(`DELETE FROM card_images WHERE card_id = ? AND side = ?`).run(cardId, side);
  const insert = db.prepare(
    `INSERT INTO card_images (card_id, side, file_path, sort_order) VALUES (?, ?, ?, ?)`,
  );
  paths.forEach((p, i) => insert.run(cardId, side, p, i));
}

function replaceTags(cardId: number, tags: string[]): void {
  const db = getDb();
  db.prepare(`DELETE FROM card_tags WHERE card_id = ?`).run(cardId);
  const upsertTag = db.prepare(
    `INSERT INTO tags (name) VALUES (?) ON CONFLICT(name) DO UPDATE SET name = name RETURNING id`,
  );
  const link = db.prepare(
    `INSERT OR IGNORE INTO card_tags (card_id, tag_id) VALUES (?, ?)`,
  );
  for (const raw of tags) {
    const name = raw.trim();
    if (!name) continue;
    const { id } = upsertTag.get(name) as { id: number };
    link.run(cardId, id);
  }
}

export function createCard(input: CreateCardInput): Card {
  const db = getDb();
  const ts = nowIso();
  const today = todayString();
  const tx = db.transaction((): number => {
    const info = db
      .prepare(
        `INSERT INTO cards (front_text, back_text, created_at, updated_at) VALUES (?, ?, ?, ?)`,
      )
      .run(input.frontText?.trim() ?? '', input.backText?.trim() ?? '', ts, ts);
    const cardId = Number(info.lastInsertRowid);
    replaceImages(cardId, 'front', input.frontImages ?? []);
    replaceImages(cardId, 'back', input.backImages ?? []);
    replaceTags(cardId, input.tags ?? []);
    db.prepare(
      `INSERT OR IGNORE INTO review_states (card_id, ease_factor, interval_days, repetitions, due_date)
       VALUES (?, 2.5, 0, 0, ?)`,
    ).run(cardId, today);
    return cardId;
  });
  const id = tx();
  return getCard(id)!;
}

export function listCards(params: { q?: string; tag?: string }): Card[] {
  const db = getDb();
  const clauses = ['c.deleted_at IS NULL'];
  const args: unknown[] = [];

  if (params.q?.trim()) {
    clauses.push('(c.front_text LIKE ? OR c.back_text LIKE ?)');
    const like = `%${params.q.trim()}%`;
    args.push(like, like);
  }

  let join = '';
  if (params.tag?.trim()) {
    join = `JOIN card_tags ct ON ct.card_id = c.id JOIN tags t ON t.id = ct.tag_id`;
    clauses.push('t.name = ?');
    args.push(params.tag.trim());
  }

  const rows = db
    .prepare(
      `SELECT DISTINCT c.id, c.front_text, c.back_text, c.created_at, c.updated_at
       FROM cards c ${join}
       WHERE ${clauses.join(' AND ')}
       ORDER BY c.created_at DESC`,
    )
    .all(...args) as CardRow[];

  return rows.map(attachRelations);
}
export function getCard(id: number): Card | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT id, front_text, back_text, created_at, updated_at
       FROM cards WHERE id = ? AND deleted_at IS NULL`,
    )
    .get(id) as CardRow | undefined;
  return row ? attachRelations(row) : null;
}

export function updateCard(id: number, input: UpdateCardInput): Card | null {
  const db = getDb();
  const existing = getCard(id);
  if (!existing) return null;
  const ts = nowIso();
  const tx = db.transaction(() => {
    db.prepare(`UPDATE cards SET front_text = ?, back_text = ?, updated_at = ? WHERE id = ?`).run(
      input.frontText?.trim() ?? existing.frontText,
      input.backText?.trim() ?? existing.backText,
      ts,
      id,
    );
    if (input.frontImages) replaceImages(id, 'front', input.frontImages);
    if (input.backImages) replaceImages(id, 'back', input.backImages);
    if (input.tags) replaceTags(id, input.tags);
  });
  tx();
  return getCard(id);
}

export function softDeleteCard(id: number): boolean {
  const db = getDb();
  const info = db
    .prepare(`UPDATE cards SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL`)
    .run(nowIso(), id);
  return info.changes > 0;
}

export function listAllTags(): string[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT DISTINCT t.name FROM tags t
       JOIN card_tags ct ON ct.tag_id = t.id
       JOIN cards c ON c.id = ct.card_id
       WHERE c.deleted_at IS NULL
       ORDER BY t.name`,
    )
    .all() as { name: string }[];
  return rows.map((r) => r.name);
}

/** Alias used by reviews module to load a card by id. */
export const getCardById = getCard;
