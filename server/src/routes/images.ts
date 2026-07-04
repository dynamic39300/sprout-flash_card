import type { FastifyInstance } from 'fastify';
import { validateImage } from '../lib/validation.js';
import { saveImage } from '../storage/local.js';
import { env, maxUploadBytes } from '../lib/env.js';

export async function imageRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/images', async (req, reply) => {
    let file;
    try {
      file = await req.file();
    } catch {
      return reply
        .code(413)
        .send({ ok: false, error: { code: 'FILE_TOO_LARGE', message: '图片过大，已超过上限。' } });
    }

    if (!file) {
      return reply
        .code(400)
        .send({ ok: false, error: { code: 'NO_FILE', message: '未收到图片文件。' } });
    }

    let buffer: Buffer;
    try {
      buffer = await file.toBuffer();
    } catch {
      return reply
        .code(413)
        .send({ ok: false, error: { code: 'FILE_TOO_LARGE', message: '图片过大，已超过上限。' } });
    }

    const result = validateImage({
      buffer,
      maxBytes: maxUploadBytes,
      allowedTypes: env.allowedImageTypes,
    });
    if (!result.ok || !result.mime) {
      return reply
        .code(400)
        .send({ ok: false, error: { code: result.code ?? 'INVALID_IMAGE', message: result.message ?? '无效图片。' } });
    }

    const path = saveImage(buffer, result.mime);
    return reply.send({ ok: true, data: { path } });
  });
}
