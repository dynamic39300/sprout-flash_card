import type { CreateCardInput } from '../types.js';

const MIME_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/**
 * 依据文件魔数（magic bytes）判定真实图片类型，而非信任声明的扩展名/请求头。
 * 见 docs/standards/security.md「图片上传安全」。
 */
export function detectImageMime(buf: Buffer): string | null {
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return 'image/png';
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    buf.length >= 6 &&
    buf[0] === 0x47 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x38 &&
    (buf[4] === 0x37 || buf[4] === 0x39) &&
    buf[5] === 0x61
  ) {
    return 'image/gif';
  }
  if (
    buf.length >= 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

export function extForMime(mime: string): string {
  return MIME_EXT[mime] ?? 'bin';
}

export interface ImageValidationResult {
  ok: boolean;
  mime?: string;
  code?: string;
  message?: string;
}

export function validateImage(params: {
  buffer: Buffer;
  maxBytes: number;
  allowedTypes: string[];
}): ImageValidationResult {
  const { buffer, maxBytes, allowedTypes } = params;
  if (buffer.length === 0) {
    return { ok: false, code: 'EMPTY_FILE', message: '文件为空。' };
  }
  if (buffer.length > maxBytes) {
    const mb = Math.round(maxBytes / (1024 * 1024));
    return { ok: false, code: 'FILE_TOO_LARGE', message: `图片超过 ${mb}MB 上限，请压缩后再试。` };
  }
  const mime = detectImageMime(buffer);
  if (!mime) {
    return { ok: false, code: 'UNKNOWN_TYPE', message: '无法识别的图片格式。' };
  }
  if (!allowedTypes.includes(mime)) {
    return { ok: false, code: 'TYPE_NOT_ALLOWED', message: `不支持的图片类型：${mime}。` };
  }
  return { ok: true, mime };
}

/**
 * 卡片正反面文本与图片不可同时为空（spec EARS）。
 */
export function isCardContentEmpty(input: CreateCardInput): boolean {
  const hasText = Boolean(input.frontText?.trim()) || Boolean(input.backText?.trim());
  const hasImages =
    (input.frontImages?.length ?? 0) > 0 || (input.backImages?.length ?? 0) > 0;
  return !hasText && !hasImages;
}
