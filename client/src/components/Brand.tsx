// 品牌字标「青芽 Sprout」：双色嫩芽 logo 呼应双层绿的"积累/生长"意象。
export function Brand() {
  return (
    <div className="brand" role="banner">
      <svg className="brand__mark" viewBox="0 0 28 28" aria-hidden>
        <path className="brand__stem" d="M14 27 V14" />
        <path
          className="brand__leaf-a"
          d="M14 18 C 8 19 4.5 13 6 8 C 11.5 9 14 13.2 14 18 Z"
        />
        <path
          className="brand__leaf-b"
          d="M14 15.5 C 19.5 16 23 11.5 22 8 C 17 9 14 12 14 15.5 Z"
        />
      </svg>
      <span className="brand__word">青芽</span>
      <span className="brand__latin">Sprout</span>
    </div>
  );
}
