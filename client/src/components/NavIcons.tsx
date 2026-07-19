// 统一线性图标（24×24 画板，1.6px 描边，圆端），替代底栏杂牌 Unicode 符号。
// 风格与 Brand 品牌笔触保持一致：无填充、圆润、克制。
import type { SVGProps } from 'react';

function base(props: SVGProps<SVGSVGElement>) {
  return {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  };
}

/** 复习：翻卡循环，呼应间隔重复 */
export function IconReview(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M4 12a8 8 0 0 1 13.5-5.8L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.5 5.8L4 16" />
      <path d="M4 20v-4h4" />
    </svg>
  );
}

/** 记卡片：书写 */
export function IconCapture(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M4 20h4.2L20 8.2a1.8 1.8 0 0 0 0-2.5l-1.7-1.7a1.8 1.8 0 0 0-2.5 0L4 15.8Z" />
      <path d="M14 6.5 17.5 10" />
    </svg>
  );
}

/** 卡片库：叠放的卡片 */
export function IconLibrary(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="6" y="4" width="13" height="9" rx="2" />
      <path d="M4.5 10.5v6a2 2 0 0 0 2 2h9" />
    </svg>
  );
}

/** 坚持：嫩芽破土，呼应品牌意象 */
export function IconStreak(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M12 20v-8.5" />
      <path d="M12 12c-3.5 0-6-2.2-6-6.5 3.9-.6 6 1.4 6 6.5Z" />
      <path d="M12 9.8c0-4.3 2.6-5.7 5.5-5.1C17.9 8.6 15.3 10.3 12 9.8Z" />
      <path d="M7 20h10" />
    </svg>
  );
}
