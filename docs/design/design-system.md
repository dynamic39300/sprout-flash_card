# 前端设计体系 · Design System

> 青芽 Sprout：个人知识记忆闪卡。方向 = **flomo 低摩擦记录 × Anki 复习会话 × 贡献墙式佛系积累**。
> 默认策略：**日常冷静 + 复习仪式**。避免 AI 默认三套路（奶油底+衬线+陶土 / 近黑底+荧光 / 报纸细线）。

## 设计简报（Brief）

- **主体**：青芽 Sprout —— 记卡 → 复习 → 坚持。
- **受众**：作者本人（开发者 / 知识工作者）。
- **一屏一事**：记卡只服务保存；复习只服务「想 → 揭 → 评」；坚持只服务「看见积累」。

## 设计原则

1. **一屏一事**：不在同一视口堆品牌、eyebrow、大标题、进度与装饰。
2. **摩擦分层**：记录 → 趋近零；复习 → 保留主动回想一步；打卡 → 零（自动记日志）。
3. **内容优先**：正文字号/行距 > 装饰；标签、due date 用 mono 小字降噪。
4. **会话沉浸**：复习进入 `session` 模式——收起 Brand / eyebrow / 常规页眉；底栏弱化。
5. **正反馈克制**：一句文案 + 进度/热力图轻微变化；避免 emoji 堆叠与游戏过关感。
6. **签名元素唯一**：成长绿为主色；Riso 错位仅用于卡片本体轻偏移（或揭晓瞬间），不做全局噪点铺满。
7. **触控与节奏**：主按钮全宽、评分区 ≥ 44px；桌面保留空格翻面、1–4 评分。

## 两种壳层（Shell modes）

| 模式 | 何时 | 显示 |
|------|------|------|
| `shell`（日常） | 记卡 / 卡片库 / 坚持 | Brand（轻）+ 短标题 + 底栏 |
| `session`（复习） | 今日复习进行中 | 顶部细进度线；隐藏 Brand/eyebrow；底栏半透明弱化 |

完成后回到 `shell`。

## 设计方向：Calm Sprout（冷静生长）

- **日常页**：向 flomo / Capacities / Skola 收敛——安静、留白、少装饰。
- **复习会话**：向 Anki / FlashMind 收敛——全屏一卡、揭晓后再出评分；轻量揭晓动效用成长绿。
- **视觉**：保留绿色成长色板与青芽品牌；卡片用细边框 + 轻 elev；错位描边降为 2px / 偏移 3px，仅挂在卡片上。

## 色板（Color Tokens）

| Token | Hex | 用途 |
|-------|-----|------|
| `--paper` | `#E7EADF` | 页面底色 |
| `--paper-raised` | `#F3F6EA` | 卡片/浮起面 |
| `--ink` | `#15201A` | 主文本 |
| `--ink-soft` | `#57645B` | 次要文本 |
| `--grow` | `#0F9A5A` | 主行动 / 揭晓 / 选中 / 正反馈 |
| `--grow-bright` | `#21B06A` | 轻错位上层 |
| `--pine` | `#0A5A3C` | 结构色 / 标题重点 |
| `--danger` | `#D4503A` | 仅删除/错误 |

## 字体（Typography）

| 角色 | 字体栈 |
|------|--------|
| Display | `"Bricolage Grotesque", "PingFang SC", "Noto Sans SC", sans-serif` |
| Body | `"PingFang SC", "Noto Sans SC", system-ui, sans-serif` |
| Utility | `"Space Mono", ui-monospace, monospace` |

类型比例（移动优先）：`12 / 14 / 16 / 18 / 22 / 32`。

## 布局（Layout）

- 移动优先、单列；最大内容宽 `540px`。
- 底栏 4 项；触控 ≥ 44px。
- 8pt 网格；圆角卡片 `12px`、控件 `10px`。
- 日常页标题：单行短标题（无英文 eyebrow 喧哗）。

## 签名元素（Signature）

**轻量印刷卡**：卡片细描边 + 可选 3px 成长绿轻错位（仅正面/背面卡片）。全局背景颗粒透明度 ≤ 0.02，或关闭。

## 质量地板

- 响应式到手机；键盘焦点可见；`prefers-reduced-motion` 关闭动效。
- 正文对比度可读。

## 文案（Voice）

- 动词直白：「保存卡片」「翻面看答案」。
- 空状态是行动邀请。
- 错误说清发生了什么 + 怎么办。

## 落地

- 令牌：`client/src/styles/tokens.css`
- 组件样式：`client/src/styles/app.css` / `global.css`
- 壳层：`client/src/App.tsx`（`app--shell` / `app--session`）
