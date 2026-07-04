interface Props {
  mark: string;
  title: string;
  desc: string;
}

// 功能二（复习）与功能三（坚持）的占位页，待后续 spec 实现。
export function PlaceholderPage({ mark, title, desc }: Props) {
  return (
    <div className="empty">
      <div className="empty__mark">{mark}</div>
      <div className="empty__title">{title}</div>
      <p>{desc}</p>
    </div>
  );
}
