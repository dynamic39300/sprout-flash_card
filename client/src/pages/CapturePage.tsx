import { useState, useEffect, type KeyboardEvent } from 'react';
import { CardFaceEditor } from '../components/CardFaceEditor';
import { createCard, listTags, ApiError } from '../lib/api';

interface Props {
  notify: (message: string, type?: 'ok' | 'error') => void;
}

export function CapturePage({ notify }: Props) {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [frontImages, setFrontImages] = useState<string[]>([]);
  const [backImages, setBackImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    listTags().then(setAllTags).catch(() => {});
  }, []);

  const tagSuggestions = tagInput.trim()
    ? allTags.filter(
        (t) =>
          t.toLowerCase().includes(tagInput.trim().toLowerCase()) &&
          !tags.includes(t),
      )
    : [];

  const isEmpty =
    !frontText.trim() &&
    !backText.trim() &&
    frontImages.length === 0 &&
    backImages.length === 0;

  function commitTag() {
    const name = tagInput.trim().replace(/^#/, '');
    if (name && !tags.includes(name)) setTags([...tags, name]);
    setTagInput('');
  }

  function handleTagKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitTag();
    } else if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags(tags.slice(0, -1));
    }
  }

  function reset() {
    setFrontText('');
    setBackText('');
    setFrontImages([]);
    setBackImages([]);
    setTags([]);
    setTagInput('');
  }

  async function save() {
    if (isEmpty || saving) return;
    setSaving(true);
    try {
      await createCard({
        frontText: frontText.trim(),
        backText: backText.trim(),
        frontImages,
        backImages,
        tags,
      });
      reset();
      notify('已保存，记下一张吧');
      listTags().then(setAllTags).catch(() => {});
    } catch (err) {
      notify(err instanceof ApiError ? err.message : '保存失败，请重试。', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <CardFaceEditor
        side="front"
        label="正面 · 提示"
        placeholder="写下问题或提示，例如「SM-2 算法的核心思想是？」"
        text={frontText}
        images={frontImages}
        onTextChange={setFrontText}
        onImagesChange={setFrontImages}
        onError={(m) => notify(m, 'error')}
      />
      <CardFaceEditor
        side="back"
        label="背面 · 答案"
        placeholder="写下答案，可粘贴或上传图片"
        text={backText}
        images={backImages}
        onTextChange={setBackText}
        onImagesChange={setBackImages}
        onError={(m) => notify(m, 'error')}
      />

      <div className="field-label">标签</div>
      <div className="tags-row">
        {tags.map((t) => (
          <span className="tag" key={t}>
            #{t}
            <button
              type="button"
              className="tag__x"
              onClick={() => setTags(tags.filter((x) => x !== t))}
              aria-label={`移除标签 ${t}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className="tag-input"
          placeholder="加标签 ↵"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKey}
          onBlur={commitTag}
        />
      </div>
      {tagSuggestions.length > 0 && (
        <div className="tag-suggestions">
          {tagSuggestions.map((t) => (
            <button
              key={t}
              type="button"
              className="tag-suggestion"
              onMouseDown={(e) => {
                e.preventDefault();
                if (!tags.includes(t)) setTags([...tags, t]);
                setTagInput('');
              }}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={save}
        disabled={isEmpty || saving}
      >
        {saving ? '保存中…' : '保存卡片'}
      </button>
    </div>
  );
}
