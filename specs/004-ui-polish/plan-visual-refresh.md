# [004] 视觉刷新改造方案 · Plan

- **关联 Spec**：`specs/004-ui-polish/spec.md` Phase 2
- **关联审视**：`docs/design/ui-audit-2026-07-19.md`
- **日期**：2026-07-19

---

## 0. 设计决策总纲

> **不动布局、不动业务、只动"表面处理"** —— 通过令牌调整 + 浅层 CSS 变更，把"线框原型"升级为"精致冷静工具"。

核心理念：**阴影取代描边、留白取代装饰、克制取代铺满**。

---

## 1. 令牌改造对照表（Before → After）

### 1.1 色板

| Token | Before | After | 说明 |
|-------|--------|-------|------|
| `--paper` | `#e7eadf` | `#f0f1ec` | 底色提亮，给卡面留出景深空间 |
| `--paper-raised` | `#f3f6ea` | `#ffffff` | 卡面纯白，最大化景深对比 |
| `--ink` | `#15201a` | `#1a2b22` | 微调，减少纯黑感 |
| `--ink-soft` | `#57645b` | `#6b7c72` | 次要文本略提亮增透气 |
| `--grow` | `#0f9a5a` | `#2d9d6a` | 降饱和偏叶绿，更有机 |
| `--grow-bright` | `#21b06a` | `#4ec08a` | 作为动效/热力图亮档 |
| `--pine` | `#0a5a3c` | `#1a5c40` | 深松绿微暖化 |
| `--hairline` | `ink 14%` | `ink 8%` | 分隔线更轻 |

### 1.2 新增 Token

| Token | Value | 用途 |
|-------|-------|------|
| `--shadow-sm` | `0 1px 2px rgba(26,43,34,.04), 0 2px 6px rgba(26,43,34,.06)` | 卡片/面板浮起 |
| `--shadow-md` | `0 2px 4px rgba(26,43,34,.05), 0 6px 16px rgba(26,43,34,.08)` | 弹窗/重要浮层 |
| `--grow-subtle` | `color-mix(in srgb, var(--grow) 10%, var(--paper-raised))` | 面板左边框/标签激活的低饱和替代 |

### 1.3 字体

| 变更 | Before | After |
|------|--------|-------|
| face-panel__label | `font-mono, 11px, uppercase, ls 0.1em` | `font-body, 13px, normal case, ls 0` |
| field-label | 同上 | 同上 |
| nav-item | `font-mono, 11px` | `font-body, 11px` |
| streak-summary__label | `font-mono, 11px, uppercase` | `font-body, 12px, normal case` |
| tag | `font-mono, 12px` | `font-body, 12px` |
| 保留 mono 的场景 | — | 日期、张数计数、快捷键 hint、热力图数值 |

### 1.4 阴影 vs 描边

| 元素 | Before | After |
|------|--------|-------|
| `.face-panel` | `border: 1px solid hairline` | `box-shadow: var(--shadow-sm); border: none` |
| `.lib-card` | `border: 1px solid hairline` | `box-shadow: var(--shadow-sm); border: none` |
| `.riso-card` | `border: 1.5px solid ink` + `::before 错位` | `box-shadow: var(--shadow-sm); border: 1px solid hairline`；`::before` 只在 `.riso-card--revealing` 动画中出现 |
| `.btn` | `border: 1.5px solid ink` | `border: 1px solid hairline; box-shadow: var(--shadow-sm)` |
| `.btn--primary` | `border-color: pine` | `border: none; box-shadow: 0 2px 8px rgba(45,157,106,.25)` |
| `.streak-today` | `border: 1px solid hairline` | `box-shadow: var(--shadow-sm); border: none` |

### 1.5 坚持页数字克制

| 属性 | Before | After |
|------|--------|-------|
| `.streak-summary__num` font-size | `40px` | `28px` |
| `.streak-summary__num` font-weight | `800` | `700` |

### 1.6 底栏图标

Before：Unicode 字符 `◑ ✎ ▤ ✦`

After：4 个内联 SVG（统一 24×24 画板，1.5px stroke，圆端，无填充）：
- 复习：半圆翻转（象征翻卡）
- 记卡片：铅笔/加号
- 卡片库：堆叠卡片
- 坚持：日历/种子

### 1.7 复习会话底栏

| 属性 | Before | After |
|------|--------|-------|
| 底栏可见性 | 完全隐藏（`display: none` 等效） | `opacity: 0.4; pointer-events: none` |

---

## 2. 改造批次计划

### Batch 1：景深建立 + 去硬描边（最大感知提升）

1. `tokens.css` 更新色板 + 新增 shadow token
2. `app.css` / `global.css`：面板/卡片/按钮去描边换阴影
3. Riso 错位 `::before` 改为 `.riso-card--revealing` 动画触发

### Batch 2：字体秩序 + 图标替换

4. 所有中文标签 class 去 mono/uppercase，改 font-body
5. `BottomNav.tsx`：Unicode glyph → 内联 SVG 组件
6. 标签(tag)样式回归正文体

### Batch 3：色彩收敛 + 规范对齐

7. `--grow` 色值调整；面板左边框改用 `--grow-subtle`
8. 坚持页大数字降为 28px/700
9. 复习会话底栏改为半透明弱化

---

## 3. 风险与约束

- **不动布局**：max-width 540px、8pt 网格、底栏 4 项、sticky CTA 位置不变
- **不动业务**：SM-2 调度、CRUD、热力图数据语义完全不碰
- **渐进可回滚**：每批改完可独立评审，不满意可逐批 revert
- **字体不换**：保持 Bricolage Grotesque / PingFang / Space Mono 三族
- **无新依赖**：图标用手写 SVG，不引入图标库

---

## 4. 验收检查

改造完成后用"眯眼测试"逐页复核：
- [x] 截图模糊后能否区分卡片与背景 —— 卡面提亮为纯白 + `--shadow-sm`，底色 `#f0f1ec`
- [x] 一屏强调色出现 ≤ 3 处 —— 面板边框/标签激活改用 `--grow-subtle`，主强调色收敛到主按钮/揭晓/进度/热力图
- [x] 无大写等宽中文 —— 面标签、字段标签、卡片元信息、导航文字、热力图星期/图例改为 `--font-body` 正常大小写
- [x] 底栏图标粗细/风格统一 —— `NavIcons.tsx` 统一 24px/1.6px 描边线性图标
- [x] Riso 错位只在揭晓瞬间可见 —— `.riso-card--back.review-card--revealed::before` 触发 0.5s `riso-flash` 动效，静态时 `opacity: 0`
- [x] 坚持页数字不比标题大 —— `.streak-summary__num` 28px/700（原 40px/800）

## 5. 实施记录（2026-07-19）

| 文件 | 变更 |
|------|------|
| `client/src/styles/tokens.css` | 色板重定义（卡面提亮、底色下沉、主绿降饱和）；新增 `--shadow-sm`/`--shadow-md`/`--grow-subtle`；`--hairline` 由 14%→8% |
| `client/src/styles/app.css` | 卡片/面板/按钮去硬描边换阴影；Riso 错位改为揭晓动效；标签类去 mono/大写；坚持页数字降级；底栏弱化改为半透明 |
| `client/src/components/NavIcons.tsx` | 新增：统一线性 SVG 图标（复习/记卡片/卡片库/坚持） |
| `client/src/components/BottomNav.tsx` | Unicode glyph → SVG 图标组件 |
| `client/src/App.tsx` | 底栏在复习会话中改为常驻 + `muted`（半透明），不再整段隐藏 |
| `client/src/pages/ReviewPage.tsx` | 顺带修复空态 `onGoCapture` 悬空 prop，接入「去记卡片」按钮 |

**验证**：`tsc --noEmit` 通过；`vite build` 构建成功；无新增 lint 错误。
