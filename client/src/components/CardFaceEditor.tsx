import { useRef, useState, type ClipboardEvent } from 'react';
import { uploadImage, ApiError } from '../lib/api';

interface Props {
  side: 'front' | 'back';
  label: string;
  placeholder: string;
  text: string;
  images: string[];
  onTextChange: (v: string) => void;
  onImagesChange: (v: string[]) => void;
  onError: (message: string) => void;
}

export function CardFaceEditor(props: Props) {
  const { side, label, placeholder, text, images, onTextChange, onImagesChange, onError } = props;
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File | Blob) {
    setUploading(true);
    try {
      const path = await uploadImage(file);
      onImagesChange([...images, path]);
    } catch (err) {
      onError(err instanceof ApiError ? err.message : '图片上传失败，请重试。');
    } finally {
      setUploading(false);
    }
  }

  async function handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith('image/'));
    if (item) {
      const file = item.getAsFile();
      if (file) {
        e.preventDefault();
        await upload(file);
      }
    }
  }

  function removeImage(idx: number) {
    onImagesChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div className={`riso-card riso-card--${side}`}>
      <span className="riso-card__label">{label}</span>
      <textarea
        className="face-editor__textarea"
        placeholder={placeholder}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        onPaste={handlePaste}
        rows={3}
      />
      <div className="thumbs">
        {images.map((src, idx) => (
          <div className="thumb" key={src}>
            <img src={src} alt="" />
            <button
              type="button"
              className="thumb__remove"
              onClick={() => removeImage(idx)}
              aria-label="移除图片"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className={`add-image${uploading ? ' add-image--uploading' : ''}`}
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label="添加图片"
        >
          {uploading ? '上传中' : '+'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
