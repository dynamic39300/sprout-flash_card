# [002] 每日复习（SM-2）· Plan

- **关联 Spec**：`specs/002-daily-review/spec.md`
- **最后更新**：2026-07-04

## 1. 方案概述

在现有 SQLite 库中新增 `review_states` 与 `review_logs` 两张表（Tech Spec 已设计）；SM-2 算法写成纯函数（`server/src/domain/srs.ts`，无 I/O 依赖，便于单元测试）；两个新路由暴露今日队列与评分接口；前端 `ReviewPage` 实现翻卡交互。新建卡片时同步初始化调度状态。

## 2. 数据 Schema（新增）

```sql
CREATE TABLE review_states (
  card_id       INTEGER PRIMARY KEY REFERENCES cards(id) ON DELETE CASCADE,
  ease_factor   REAL    NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  repetitions   INTEGER NOT NULL DEFAULT 0,
  due_date      TEXT    NOT NULL,          -- YYYY-MM-DD
  last_reviewed_at TEXT
);

CREATE TABLE review_logs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id     INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  reviewed_at TEXT    NOT NULL,            -- ISO8601
  review_day  TEXT    NOT NULL,            -- YYYY-MM-DD 本地时区
  rating      TEXT    NOT NULL CHECK(rating IN ('again','hard','good','easy'))
);
CREATE INDEX idx_review_logs_day ON review_logs(review_day);
CREATE INDEX idx_review_states_due ON review_states(due_date);
```

## 3. SM-2 算法（纯函数）

评分 → 质量分 q：`again=2 / hard=3 / good=4 / easy=5`

```
if q < 3:
    repetitions = 0, interval = 1
else:
    if rep==0: interval=1
    elif rep==1: interval=6
    else: interval = round(prev_interval * ease_factor)
    repetitions += 1
ease_factor = max(1.3, ef + 0.1 - (5-q)*(0.08 + (5-q)*0.02))
due_date = today + interval days
```

输入：`{ easeFactor, intervalDays, repetitions, rating, today: string }`  
输出：`{ easeFactor, intervalDays, repetitions, dueDate: string }`

## 4. 接口契约

| 方法 & 路径 | 说明 |
|-------------|------|
| `GET /api/reviews/today` | 返回 `due_date ≤ today` 的卡片列表（含完整 Card 结构）与 `total` |
| `POST /api/reviews/:cardId` | body: `{ rating: 'again'|'hard'|'good'|'easy' }` → 更新调度状态 + 写日志，返回更新后的 `review_state` |

## 5. 前端 ReviewPage 结构

```
[进度] X / Y 张
[卡片容器]
  → 状态 "question"：显示正面，底部「翻面看答案 ▾」按钮
  → 状态 "answer"：显示正面（折叠）+ 背面（展开，带绿色揭晓动效），
                     底部四个评分按钮
[空状态] 今日无到期卡
[完成态] 今日已清空，继续生长
```

翻面动效：简单 CSS transition（高度展开 + opacity），`prefers-reduced-motion` 时关闭。

## 6. 与现有代码的衔接

- `server/src/db/index.ts`：在 `initSchema` 中追加两张新表的 `CREATE TABLE IF NOT EXISTS`。
- `server/src/db/cards.ts`：`createCard` 事务末尾追加插入 `review_states`（`due_date = today`）。
- `server/src/types.ts`：新增 `ReviewState`、`Rating`、`TodayReview` 类型。

## 7. 测试策略

SM-2 纯函数：覆盖所有评分分支 + EF 下限 + 首/次/多次复习边界（宪法质量红线）。
