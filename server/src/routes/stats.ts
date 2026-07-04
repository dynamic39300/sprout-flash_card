import type { FastifyInstance } from 'fastify';
import { getStreakStats } from '../db/stats.js';
import { todayString } from '../db/reviews.js';

export async function statsRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/stats/streak', async (_req, reply) => {
    const stats = getStreakStats(todayString());
    return reply.send({ ok: true, data: stats });
  });
}
