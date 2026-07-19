# 已实现功能清单

- **产品**：青芽 Sprout（代号 flash_card）
- **范围**：以当前代码为准（非 README / 规划文档声明）
- **最后盘点**：2026-07-18
- **对应规格**：`specs/001` · `002` · `003` · `004`

---

## 总览

| Spec | 功能 | 实现状态 |
|------|------|----------|
| [001-card-capture](../../specs/001-card-capture/spec.md) | 记录知识闪卡（文本 + 图片 + 标签 + 卡片库） | 核心可用；前端编辑与软删恢复待补 |
| [002-daily-review](../../specs/002-daily-review/spec.md) | 每日复习（SM-2） | 端到端可用 |
| [003-streak](../../specs/003-streak/spec.md) | 坚持打卡（累计天数 + 热力图） | 端到端可用 |
| [004-ui-polish](../../specs/004-ui-polish/spec.md) | UI 冷静改造（壳层 / 会话 / 降噪） | 已落地 |

导航为底部 Tab 切换（复习 / 记卡片 / 卡片库 / 坚持），默认进入「复习」。免登录，手机与 PC 共用同一服务端数据。

---

## 1. 记录知识闪卡（001）

### 1.1 创建卡片

- 正反面问答结构：正面（问题/提示）+ 背面（答案）
- 正反面均支持纯文本
- 正反面均支持图片：PC 粘贴（Ctrl/Cmd+V）、文件选择上传
- 支持图片类型：png / jpeg / webp / gif；后端魔数校验与大小限制
- 标签：Enter / 逗号 / blur 添加；Backspace 删除末项；已有标签联想
- 空内容（文本与图片皆空）禁止保存
- 保存成功后表单清空，并 Toast 提示；同步刷新卡片库

### 1.2 卡片库

- 列表展示正反面文本、图片、标签、到期日
- 关键词搜索（正/背面文本，防抖约 200ms）
- 按标签筛选（点击切换）
- 今日到期卡优先展示，并标注「今日到期」
- 支持删除（调用软删除 API）

### 1.3 后端能力

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/cards` | 创建卡片；空卡拒绝 |
| GET | `/api/cards?q&tag` | 列表 / 搜索 / 标签过滤（排除软删） |
| GET | `/api/cards/:id` | 单卡详情 |
| PATCH | `/api/cards/:id` | 更新文本 / 图 / 标签（前端尚未接编辑 UI） |
| DELETE | `/api/cards/:id` | 软删除（`deleted_at`） |
| GET | `/api/tags` | 在用标签列表 |
| POST | `/api/images` | multipart 图片上传 |
| GET | `/uploads/*` | 静态图片访问 |

### 1.4 已知缺口（相对 001 规格）

- 前端无编辑入口（PATCH API 已就绪）
- 软删除后无恢复 API / UI（规格要求「可恢复」）

---

## 2. 每日复习 · SM-2（002）

### 2.1 复习流程

- 打开「复习」页即拉取今日到期队列（`due_date ≤ today`）
- 交互：先看正面 →「翻面看答案」→ 展示背面与四档评分
- 评分档位：Again / Hard / Good / Easy
- Again：卡回队尾；其余评分后移出队列
- 进度：细进度条 `已完成 / 总数`
- 全部完成后展示「今日已清空」完成态
- 无到期卡时展示空状态（不报错）
- 快捷键：空格翻面，数字键 1–4 评分

### 2.2 SM-2 调度

- 实现位置：`server/src/domain/srs.ts`（含单元测试）
- 质量映射：again=2, hard=3, good=4, easy=5
- Again（q < 3）：`repetitions = 0`，间隔重置为 1 天
- 成功路径：按 SM-2 更新 `ease_factor` / `interval_days` / `repetitions` / `due_date`
- 评分写入 `review_logs`
- 新建卡片自动插入 `review_states`，`due_date = 今天`，当日可进队列

### 2.3 后端能力

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/reviews/today` | 今日待复习队列 |
| POST | `/api/reviews/:cardId` | 提交评分 → SM-2 + 日志 |

### 2.4 已知缺口（相对 002 规格）

- 无滑动翻面（规格提到点击/滑动；当前为点击）
- 空态 / 完成态「去记卡」跳转未接线（`onGoCapture` 已传入但未使用）

---

## 3. 坚持打卡 · 佛系激励（003）

### 3.1 页面能力

- **累计复习天数**：`review_logs` 中不重复 `review_day` 计数
- **今日进度环**：今日已复习 /（已复习 + 仍到期）
- **热力图**：近 16 周（112 天），颜色 4 档（0 / 1–3 / 4–9 / 10+）
- **鼓励文案**：按累计天数阶段展示（佛系口吻）
- 不做连胜清零、不补签、不制造焦虑

### 3.2 后端能力

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/stats/streak` | 累计天 / 今日进度 / 112 天热力数据 |

### 3.3 已知缺口

- 打卡统计逻辑尚无专项单元测试（AGENTS 要求核心算法应有测）

---

## 4. UI 冷静改造（004）

不改变业务语义（SM-2 / CRUD / 热力图数据），只调整信息层级与沉浸感。

- **日常壳**：记卡 / 库 / 坚持页显示轻品牌 + 短标题 + 底栏
- **复习会话模式**：队列进行中隐藏 Brand 与底栏，仅保留细进度与卡片内容
- **记卡**：底部 sticky「保存卡片」
- **卡片库**：今日到期优先 + 角标
- **坚持页**：累计数字视觉克制（避免巨型英雄数字抢戏）
- 设计令牌：`client/src/styles/tokens.css`
- 动效：揭晓 / Riso 轻错位等；尊重 `prefers-reduced-motion`
- Toast：成功 / 错误提示（约 2.2s）

---

## 5. 平台与运维（已落地）

| 能力 | 说明 |
|------|------|
| 技术栈 | React + Vite + TS（前端）· Node.js + TS（后端）· SQLite · 本地磁盘存图 |
| 响应式 | 移动端优先，PC 可用 |
| 健康检查 | `GET /api/health` |
| 部署 | `deploy.sh`（pull → install → build → PM2 → health） |
| 进程 | `ecosystem.config.cjs`（PM2 跑 `server/dist/index.js`） |
| 备份 | `backup.sh`（打包 `data/`，保留 30 天） |
| 数据红线 | `data/`、`uploads/`、`*.db`、`.env` 不入 git |

### 数据表（SQLite）

`cards`（含软删）· `card_images` · `tags` / `card_tags` · `review_states` · `review_logs`

---

## 6. 明确未做 / 预留

以下为规格 Out of Scope，或仅有 env / 注释预留、代码未接通：

| 项 | 说明 |
|----|------|
| 账号 / 多用户 / 权限分享 | MVP 免登录 |
| 访问密码 | `ACCESS_PASSWORD` 仅环境变量预留 |
| 外部推送 | 邮件 / 微信 / 系统通知 |
| 连胜清零 / 补签 | 佛系激励刻意不做 |
| 富文本 / Markdown | 纯文本 + 图片 |
| 批量导入、卡片关联 | — |
| 云端图片 OSS | 架构预留 |
| FSRS 等高级算法 | 本期 SM-2 |
| PWA 添加到主屏幕 | 可选，未实现 |

---

## 7. 功能与代码入口速查

| 功能 | 前端入口 | 后端 / 领域入口 |
|------|----------|-----------------|
| 记卡 | `client/src/pages/CapturePage.tsx` | `server/src/routes/cards.ts` · `images.ts` |
| 卡片库 | `client/src/pages/LibraryPage.tsx` | 同上 |
| 复习 | `client/src/pages/ReviewPage.tsx` | `server/src/routes/reviews.ts` · `domain/srs.ts` |
| 坚持 | `client/src/pages/StreakPage.tsx` | `server/src/db/stats.ts` |
| 壳层导航 | `client/src/App.tsx` · `BottomNav.tsx` · `Brand.tsx` | — |

---

## 维护说明

行为变更时：先更新对应 `specs/NNN-*/spec.md`，再改代码，并同步修订本文。
