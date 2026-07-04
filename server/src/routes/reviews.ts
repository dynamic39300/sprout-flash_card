import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getTodayReview, submitRating } from '../db/reviews.js';

const RatingSchema = z.enum(['again', 'hard', 'good', 'easy']);

export async function reviewRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/reviews/today', async (_req, reply) => {
    const result = getTodayReview();
    return reply.send({ ok: true, data: result });
  });

  fastify.post<{ Params: { cardId: string }; Body: { rating: string } }>(
    '/api/reviews/:cardId',
    async (req, reply) => {
      const cardId = Number(req.params.cardId);
      if (!Number.isInteger(cardId) || cardId <= 0) {
        return reply.status(400).send({ ok: false, error: { code: 'INVALID_ID', message: 'cardId must be a positive integer' } });
      }

      const parsed = RatingSchema.safeParse((req.body as Record<string, unknown>)?.rating);
      if (!parsed.success) {
        return reply.status(400).send({ ok: false, error: { code: 'INVALID_RATING', message: 'rating must be again | hard | good | easy' } });
      }

      try {
        const state = submitRating(cardId, parsed.data);
        return reply.send({ ok: true, data: state });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes('No review state')) {
          return reply.status(404).send({ ok: false, error: { code: 'NOT_FOUND', message: msg } });
        }
        throw e;
      }
    },
  );
}
