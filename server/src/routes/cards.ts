import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { isCardContentEmpty } from '../lib/validation.js';
import {
  createCard,
  getCard,
  listCards,
  softDeleteCard,
  updateCard,
  listAllTags,
} from '../db/cards.js';

// 图片路径必须是本服务返回的 /uploads/ 路径，避免注入外部/危险引用
const imagePath = z.string().refine((p) => p.startsWith('/uploads/'), {
  message: '非法的图片路径',
});

const cardInputSchema = z.object({
  frontText: z.string().max(10000).optional(),
  backText: z.string().max(10000).optional(),
  frontImages: z.array(imagePath).max(20).optional(),
  backImages: z.array(imagePath).max(20).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

const idParam = z.object({ id: z.coerce.number().int().positive() });
const listQuery = z.object({ q: z.string().optional(), tag: z.string().optional() });

export async function cardRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/cards', async (req, reply) => {
    const parsed = cardInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ ok: false, error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? '输入不合法。' } });
    }
    if (isCardContentEmpty(parsed.data)) {
      return reply
        .code(400)
        .send({ ok: false, error: { code: 'EMPTY_CARD', message: '正面和背面至少要填写一面（文本或图片）。' } });
    }
    const card = createCard(parsed.data);
    return reply.code(201).send({ ok: true, data: card });
  });

  app.get('/api/cards', async (req, reply) => {
    const query = listQuery.parse(req.query);
    return reply.send({ ok: true, data: listCards(query) });
  });

  app.get('/api/tags', async (_req, reply) => {
    return reply.send({ ok: true, data: listAllTags() });
  });

  app.get('/api/cards/:id', async (req, reply) => {
    const { id } = idParam.parse(req.params);
    const card = getCard(id);
    if (!card) {
      return reply.code(404).send({ ok: false, error: { code: 'NOT_FOUND', message: '卡片不存在。' } });
    }
    return reply.send({ ok: true, data: card });
  });

  app.patch('/api/cards/:id', async (req, reply) => {
    const { id } = idParam.parse(req.params);
    const parsed = cardInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ ok: false, error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? '输入不合法。' } });
    }
    const card = updateCard(id, parsed.data);
    if (!card) {
      return reply.code(404).send({ ok: false, error: { code: 'NOT_FOUND', message: '卡片不存在。' } });
    }
    return reply.send({ ok: true, data: card });
  });

  app.delete('/api/cards/:id', async (req, reply) => {
    const { id } = idParam.parse(req.params);
    const done = softDeleteCard(id);
    if (!done) {
      return reply.code(404).send({ ok: false, error: { code: 'NOT_FOUND', message: '卡片不存在。' } });
    }
    return reply.send({ ok: true, data: { id } });
  });
}
