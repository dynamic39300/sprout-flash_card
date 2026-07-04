import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { env } from '../lib/env.js';
import { extForMime } from '../lib/validation.js';

/**
 * 本地磁盘图片存储。返回可通过 /uploads 静态访问的相对路径。
 * 文件名由服务端随机生成，杜绝使用用户提供的文件名与路径穿越（见 security.md）。
 * 存储接口有意保持简单，后续可替换为阿里云 OSS 实现。
 */
export function saveImage(buffer: Buffer, mime: string): string {
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD 分目录
  const dir = path.join(env.uploadDir, day);
  fs.mkdirSync(dir, { recursive: true });

  const filename = `${crypto.randomUUID()}.${extForMime(mime)}`;
  const absPath = path.join(dir, filename);

  // 二次防护：确保最终路径仍位于 uploadDir 之内
  const normalized = path.normalize(absPath);
  if (!normalized.startsWith(path.normalize(env.uploadDir) + path.sep)) {
    throw new Error('非法的存储路径');
  }

  fs.writeFileSync(normalized, buffer);
  return `/uploads/${day}/${filename}`;
}
