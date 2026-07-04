import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fs from 'node:fs';
import { env, maxUploadBytes } from './lib/env.js';
import { getDb } from './db/index.js';
import { cardRoutes } from './routes/cards.js';
import { imageRoutes } from './routes/images.js';
import { reviewRoutes } from './routes/reviews.js';
import { statsRoutes } from './routes/stats.js';

async function main(): Promise<void> {
  // 初始化数据库（建表）
  getDb();
  fs.mkdirSync(env.uploadDir, { recursive: true });

  const app = Fastify({
    logger: {
      level: env.nodeEnv === 'production' ? 'info' : 'debug',
      transport:
        env.nodeEnv === 'production' ? undefined : { target: 'pino-pretty' },
    },
    bodyLimit: 2 * 1024 * 1024,
  });

  await app.register(multipart, {
    limits: { fileSize: maxUploadBytes, files: 1 },
  });

  // 静态提供已上传图片
  await app.register(fastifyStatic, {
    root: env.uploadDir,
    prefix: '/uploads/',
    decorateReply: false,
  });

  app.get('/api/health', async () => ({ ok: true, data: { status: 'up' } }));

  await app.register(cardRoutes);
  await app.register(imageRoutes);
  await app.register(reviewRoutes);
  await app.register(statsRoutes);

  // 不泄露内部细节的统一错误响应（见 security.md）
  app.setErrorHandler((err: Error & { statusCode?: number }, _req, reply) => {
    app.log.error(err);
    const status = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
    reply.code(status).send({
      ok: false,
      error: {
        code: status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR',
        message: status === 500 ? '服务器开小差了，请稍后再试。' : err.message,
      },
    });
  });

  try {
    await app.listen({ port: env.port, host: '0.0.0.0' });
    app.log.info(`flash_card server listening on :${env.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void main();
