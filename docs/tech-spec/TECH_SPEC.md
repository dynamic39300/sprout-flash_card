# 技术详设文档 · Tech Spec

- **对应 PRD**：`docs/prd/PRD.md` v1.0
- **版本**：v1.0（MVP）
- **最后更新**：2026-07-04
- **约束**：本设计须符合 `.specify/memory/constitution.md`（技术栈锁定、质量红线）。

---

## 1. 架构总览

采用**轻量单体架构**，一个仓库、一个后端进程、一个 SQLite 文件，追求自用场景下的部署与维护极简。

```
┌─────────────────────────────────────────────────┐
│                  浏览器（手机 / PC）                │
│         React + Vite + TS（移动优先 / PWA）         │
└───────────────────────┬─────────────────────────┘
                        │ HTTPS (JSON API)
┌───────────────────────▼─────────────────────────┐
│                Nginx（反向代理 / 静态资源）          │
└───────────────────────┬─────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────┐
│        Node.js + TypeScript 单体后端服务           │
│  路由层 → 服务层(业务/SM-2/统计) → 数据访问层        │
└──────────┬───────────────────────────┬──────────┘
           │                           │
    ┌──────▼──────┐            ┌────────▼────────┐
    │  SQLite .db │            │  uploads/ 图片目录 │
    └─────────────┘            └─────────────────┘
```

## 2. 技术选型（继承宪法）

| 层 | 选型 | 说明 |
|----|------|------|
| 前端框架 | React 18 + Vite + TypeScript | 移动端优先响应式，构建快 |
| 状态/数据请求 | 轻量方案（如 TanStack Query 或原生 fetch 封装） | 自用量级，避免过度设计 |
| UI | 组件化 + CSS（可选 Tailwind） | 移动优先，触屏友好 |
| PWA | vite-plugin-pwa（可选） | 「添加到主屏幕」 |
| 后端 | Node.js + TypeScript + Fastify（或 Express） | 单体，接口简单 |
| ORM/DB 访问 | better-sqlite3（同步、快、简单）或 Drizzle | SQLite 场景友好 |
| 数据库 | SQLite | 单文件，零运维 |
| 图片存储 | 本地磁盘 `uploads/` | 预留迁移 OSS 的存储抽象层 |
| 测试 | Vitest | 前后端统一，快 |
| 进程管理 | PM2 或 Docker | 阿里云 ECS 部署 |
| 反代 | Nginx | 静态资源 + API 转发 + HTTPS |

> 具体库的最终选择在对应 feature 的 `plan.md` 中锁定，但不得超出上述范围。

## 3. 数据模型（SQLite Schema）

```sql
-- 卡片
CREATE TABLE cards (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  front_text   TEXT NOT NULL DEFAULT '',
  back_text    TEXT NOT NULL DEFAULT '',
  created_at   TEXT NOT NULL,          -- ISO8601
  updated_at   TEXT NOT NULL,
  deleted_at   TEXT                    -- 软删除，保障数据可恢复（宪法数据红线）
);

-- 卡片图片素材（正/反面，多图）
CREATE TABLE card_images (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id   INTEGER NOT NULL REFERENCES cards(id),
  side      TEXT NOT NULL CHECK(side IN ('front','back')),
  file_path TEXT NOT NULL,             -- 相对 uploads/ 的路径
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 标签
CREATE TABLE tags (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE card_tags (
  card_id INTEGER NOT NULL REFERENCES cards(id),
  tag_id  INTEGER NOT NULL REFERENCES tags(id),
  PRIMARY KEY (card_id, tag_id)
);

-- 复习调度状态（SM-2），与 card 一对一
CREATE TABLE review_states (
  card_id       INTEGER PRIMARY KEY REFERENCES cards(id),
  ease_factor   REAL NOT NULL DEFAULT 2.5,   -- 难度系数 EF
  interval_days INTEGER NOT NULL DEFAULT 0,  -- 当前间隔（天）
  repetitions   INTEGER NOT NULL DEFAULT 0,  -- 连续答对次数 n
  due_date      TEXT NOT NULL,               -- 下次到期日 YYYY-MM-DD
  last_reviewed_at TEXT
);

-- 复习日志（用于热力图/统计）
CREATE TABLE review_logs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id     INTEGER NOT NULL REFERENCES cards(id),
  reviewed_at TEXT NOT NULL,                 -- ISO8601
  review_day  TEXT NOT NULL,                 -- YYYY-MM-DD（按本地时区归日）
  rating      TEXT NOT NULL CHECK(rating IN ('again','hard','good','easy'))
);
CREATE INDEX idx_review_logs_day ON review_logs(review_day);
CREATE INDEX idx_review_states_due ON review_states(due_date);
```

## 4. 间隔重复算法（SM-2）

基于经典 SM-2，四档评分映射到质量分 q：

| 评分 | q | 含义 |
|------|---|------|
| Again | 2 | 没记住 |
| Hard  | 3 | 勉强想起 |
| Good  | 4 | 正常想起 |
| Easy  | 5 | 轻松 |

**核心逻辑**：

```text
if q < 3 (Again):
    repetitions = 0
    interval = 1               # 明天再来
else:
    if repetitions == 0: interval = 1
    elif repetitions == 1: interval = 6
    else: interval = round(interval * ease_factor)
    repetitions += 1

# 更新难度系数（下限 1.3）
ease_factor = max(1.3, ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))

due_date = today + interval days
```

> 该算法为纯函数，**必须**有覆盖各评分分支与边界的单元测试（宪法质量红线）。实现放于 `server/src/domain/srs/`，与存储解耦。

## 5. API 设计（REST / JSON）

统一前缀 `/api`。响应统一结构：

```jsonc
// 成功
{ "ok": true, "data": { /* ... */ } }
// 失败
{ "ok": false, "error": { "code": "STRING_CODE", "message": "可读信息" } }
```

| 方法 & 路径 | 说明 |
|-------------|------|
| `POST /api/cards` | 创建卡片（正反面文本 + 图片引用 + 标签） |
| `GET /api/cards` | 卡片库列表（支持 tag、关键词、分页筛选） |
| `GET /api/cards/:id` | 卡片详情 |
| `PATCH /api/cards/:id` | 编辑卡片 |
| `DELETE /api/cards/:id` | 软删除卡片 |
| `POST /api/images` | 上传/粘贴图片，返回 file_path |
| `GET /api/reviews/today` | 今日待复习队列（due_date ≤ today） |
| `POST /api/reviews/:cardId` | 提交一次复习评分，更新 SM-2 状态并写日志 |
| `GET /api/stats/heatmap` | 热力图数据（按天聚合复习数） |
| `GET /api/stats/summary` | 累计天数、今日进度等汇总 |

## 6. 图片存储抽象

定义 `ImageStorage` 接口，MVP 实现 `LocalDiskStorage`（写入 `uploads/`，按日期分目录），后续可无缝替换为 `OssStorage`。上层业务只依赖接口，符合宪法「预留迁移 OSS」。

## 7. 目录结构（建议）

```
flash_card/
├── client/                 # 前端 React 应用
│   └── src/{pages,components,hooks,api,styles}
├── server/                 # 后端 Node 服务
│   └── src/{routes,services,domain,db,storage}
│       └── domain/srs/     # SM-2 纯逻辑（重点测试）
├── shared/                 # 前后端共享类型
├── data/                   # SQLite 文件（gitignore）
├── uploads/                # 图片（gitignore）
└── docs/ specs/ .cursor/ .specify/ ...
```

## 8. 部署（阿里云 ECS）

1. 前端 `npm run build` 产出静态资源，交由 Nginx 托管。
2. 后端由 PM2 或 Docker 常驻，监听本地端口。
3. Nginx：`/` → 静态资源，`/api` → 反代后端，配置 HTTPS。
4. **备份**：定期拷贝 SQLite `.db` 文件 + `uploads/` 目录（数据红线要求）。
5. 环境变量经 `.env`（不入库）注入端口、存储路径等。

## 9. 安全与预留

- MVP 免登录；预留「访问密码」中间件挂载点（宪法范围纪律）。
- 图片上传校验类型与大小，防止任意文件写入。
- 所有写操作做输入校验（schema 校验）。

## 10. 风险与权衡

| 风险 | 应对 |
|------|------|
| SQLite 并发写（自用低并发） | better-sqlite3 同步写足够；如未来多用户再评估 |
| 免登录导致数据暴露 | 预留访问密码；提醒用户勿泄露网址 |
| 本地存图迁移成本 | 存储层接口抽象，隔离实现 |
| 时区导致「按天」统计偏差 | 统一以服务器/用户本地时区归日，测试覆盖跨天边界 |
