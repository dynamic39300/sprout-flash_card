# [001] 记录知识闪卡 · Plan（技术计划）

- **关联 Spec**：`specs/001-card-capture/spec.md`
- **关联 Tech Spec**：`docs/tech-spec/TECH_SPEC.md`
- **最后更新**：2026-07-04

## 1. 方案概述

搭建项目骨架（前端 client / 后端 server / 共享类型 shared 的 npm workspaces 单仓）。后端用 Fastify + better-sqlite3 提供卡片与图片 API；前端用 Vite + React + TS，移动优先，建立设计体系（见 `docs/design/design-system.md`），实现记卡片页与卡片库。

## 2. 架构与模块

- 前端：`client/src/{pages,components,api,styles,lib}`；页面 `CapturePage`、`LibraryPage`，应用壳 `AppShell` + 底部导航（今日复习/记卡片/卡片库/我的坚持，后两者本期功能，前两者本期为占位）。
- 后端：`server/src/{db,routes,storage,lib}`；路由 `cards`、`images`。
- 共享：`shared/types.ts` 定义 `Card`、`CardImage`、DTO。

## 3. 数据结构 / Schema

采用 Tech Spec 第 3 节的表：`cards`、`card_images`、`tags`、`card_tags`。本功能先建这 4 张 + 复习相关表可延后（功能二再建）。软删除用 `cards.deleted_at`。

## 4. 接口契约（API）

| 方法 & 路径 | 入参 | 出参 | 说明 |
|-------------|------|------|------|
| POST `/api/images` | multipart file | `{ ok, data: { path } }` | 上传图片，校验类型/大小/魔数 |
| POST `/api/cards` | `{ frontText, backText, frontImages[], backImages[], tags[] }` | `{ ok, data: Card }` | 创建卡片 |
| GET `/api/cards` | `?q=&tag=` | `{ ok, data: Card[] }` | 列表（未删除），支持关键词/标签筛选 |
| GET `/api/cards/:id` | - | `{ ok, data: Card }` | 详情 |
| PATCH `/api/cards/:id` | 同创建的可选字段 | `{ ok, data: Card }` | 编辑 |
| DELETE `/api/cards/:id` | - | `{ ok }` | 软删除 |

统一响应 `{ ok, data | error }`。静态图片经 `/uploads/*` 提供。

## 5. 关键逻辑

- 图片上传：白名单 MIME + 魔数校验 + 大小上限（env）+ 服务端随机文件名 + 路径规范化防穿越（见 `security.md`）。
- 保存校验：正反面文本与图片不可同时为空。
- 筛选：关键词对 `front_text`/`back_text` 做 LIKE；标签走关联表。

## 6. 依赖

- 后端：`fastify`、`@fastify/multipart`、`@fastify/static`、`better-sqlite3`、`zod`（校验）、`tsx`（dev 运行）、`typescript`。
- 前端：`react`、`react-dom`、`vite`、`@vitejs/plugin-react`、`typescript`；数据请求用原生 fetch 封装。
- 根：`concurrently`（并行起前后端）。
- 均为业界主流依赖，符合宪法技术栈。

## 7. 风险与权衡

| 风险 | 应对 |
|------|------|
| better-sqlite3 需原生编译 | Node 22 预编译二进制通常可用；失败则文档记录 |
| 图片上传安全 | 严格按 security.md 校验 |
| 设计过度/模板化 | 遵循 frontend-design skill，先定 tokens 再写码 |

## 8. 测试策略

- 后端纯逻辑：图片类型/大小校验、保存空值校验、筛选查询构造 —— 单元测试（Vitest）。
- 本功能以核心校验逻辑单测为主；UI 以手动验证闭环为准（MVP）。
