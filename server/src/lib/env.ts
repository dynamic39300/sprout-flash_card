import path from 'node:path';

const cwd = process.cwd();

function resolveFromCwd(p: string): string {
  return path.isAbsolute(p) ? p : path.resolve(cwd, p);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8787),
  dataDir: resolveFromCwd(process.env.DATA_DIR ?? 'data'),
  dbFile: resolveFromCwd(process.env.DB_FILE ?? 'data/flash_card.db'),
  uploadDir: resolveFromCwd(process.env.UPLOAD_DIR ?? 'data/uploads'),
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB ?? 5),
  allowedImageTypes: (
    process.env.ALLOWED_IMAGE_TYPES ?? 'image/png,image/jpeg,image/webp,image/gif'
  )
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean),
  // 预留：设置后启用访问口令（当前 MVP 免登录）
  accessPassword: process.env.ACCESS_PASSWORD ?? '',
};

export const maxUploadBytes = env.maxUploadMb * 1024 * 1024;
