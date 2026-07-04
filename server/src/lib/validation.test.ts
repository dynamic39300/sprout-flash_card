import { describe, it, expect } from 'vitest';
import { detectImageMime, validateImage, isCardContentEmpty, extForMime } from './validation.js';

const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
const gifHeader = Buffer.from('GIF89a', 'ascii');
const webpHeader = Buffer.concat([
  Buffer.from('RIFF', 'ascii'),
  Buffer.from([0x00, 0x00, 0x00, 0x00]),
  Buffer.from('WEBP', 'ascii'),
]);

describe('detectImageMime', () => {
  it('识别 PNG', () => expect(detectImageMime(pngHeader)).toBe('image/png'));
  it('识别 JPEG', () => expect(detectImageMime(jpegHeader)).toBe('image/jpeg'));
  it('识别 GIF89a', () => expect(detectImageMime(gifHeader)).toBe('image/gif'));
  it('识别 WEBP', () => expect(detectImageMime(webpHeader)).toBe('image/webp'));
  it('未知类型返回 null', () =>
    expect(detectImageMime(Buffer.from('hello world'))).toBeNull());
});

describe('extForMime', () => {
  it('jpeg -> jpg', () => expect(extForMime('image/jpeg')).toBe('jpg'));
  it('未知 -> bin', () => expect(extForMime('application/x-msdownload')).toBe('bin'));
});

describe('validateImage', () => {
  const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

  it('合法 PNG 通过', () => {
    const r = validateImage({ buffer: pngHeader, maxBytes: 1024, allowedTypes: allowed });
    expect(r.ok).toBe(true);
    expect(r.mime).toBe('image/png');
  });

  it('空文件被拒', () => {
    const r = validateImage({ buffer: Buffer.alloc(0), maxBytes: 1024, allowedTypes: allowed });
    expect(r.ok).toBe(false);
    expect(r.code).toBe('EMPTY_FILE');
  });

  it('超过大小上限被拒', () => {
    const big = Buffer.concat([pngHeader, Buffer.alloc(2048)]);
    const r = validateImage({ buffer: big, maxBytes: 1024, allowedTypes: allowed });
    expect(r.ok).toBe(false);
    expect(r.code).toBe('FILE_TOO_LARGE');
  });

  it('伪装成图片的非图片内容被拒（魔数不符）', () => {
    const r = validateImage({
      buffer: Buffer.from('<script>alert(1)</script>'),
      maxBytes: 1024,
      allowedTypes: allowed,
    });
    expect(r.ok).toBe(false);
    expect(r.code).toBe('UNKNOWN_TYPE');
  });

  it('类型不在白名单被拒', () => {
    const r = validateImage({ buffer: gifHeader, maxBytes: 1024, allowedTypes: ['image/png'] });
    expect(r.ok).toBe(false);
    expect(r.code).toBe('TYPE_NOT_ALLOWED');
  });
});

describe('isCardContentEmpty', () => {
  it('全空 -> true', () => expect(isCardContentEmpty({})).toBe(true));
  it('仅空白字符 -> true', () =>
    expect(isCardContentEmpty({ frontText: '   ', backText: '\n' })).toBe(true));
  it('有正面文本 -> false', () =>
    expect(isCardContentEmpty({ frontText: '问题' })).toBe(false));
  it('仅有图片 -> false', () =>
    expect(isCardContentEmpty({ frontImages: ['/uploads/a.png'] })).toBe(false));
});
