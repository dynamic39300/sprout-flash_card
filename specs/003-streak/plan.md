# [003] 坚持打卡（佛系激励）· Plan

- **关联 Spec**：`specs/003-streak/spec.md`
- **最后更新**：2026-07-04

## 1. 方案概述

纯读取方案：`review_logs` 已有全部数据，后端一个新接口聚合统计，前端渲染热力图 + 进度环。不新增任何表。

## 2. 接口设计

### `GET /api/stats/streak`

Query params（可选）：无

Response：

```json
{
  "ok": true,
  "data": {
    "totalDays": 12,
    "todayReviewed": 3,
    "todayDue": 10,
    "heatmap": [
      { "date": "2026-05-01", "count": 0 },
      { "date": "2026-05-02", "count": 5 },
      ...
    ]
  }
}
```

- `totalDays`：`review_logs` 中不重复 `review_day` 的数量。
- `todayReviewed`：今天 `review_day = today` 的记录数（含 again）。
- `todayDue`：`review_states` 中 `due_date ≤ today` 且卡片未删除的总数（初始队列大小，不随评分减少）。
- `heatmap`：过去 112 天（16 周）每天的复习张数，从今天往前 111 天，共 112 条，按日期升序。

## 3. 后端实现

`server/src/db/stats.ts`（纯查询，无写操作）：

```ts
getStreakStats(today: string): StreakStats
```

涉及 3 条 SQL：
1. `SELECT COUNT(DISTINCT review_day) FROM review_logs` → totalDays
2. `SELECT COUNT(*) FROM review_logs WHERE review_day = ?` → todayReviewed
3. `SELECT review_day, COUNT(*) as cnt FROM review_logs WHERE review_day >= ? GROUP BY review_day` → heatmap 原始数据，再在 TS 中填充全 112 天零值

今日到期数（`todayDue`）从 `review_states` 读，单独一条 SQL。

## 4. 前端 StreakPage 结构

```
[大数字卡片]  已坚持复习 XX 天
[进度环]      今日进度  X / Y 张
[热力图]      16 周 × 7 天格子，悬浮/点击显示具体日期与张数
[鼓励文案]    阶段性文字
```

热力图颜色级别（绿色系，4 档）：
- 0 张 → `--hairline`（格子存在但透明）
- 1-3 张 → `color-mix(--grow, 30%)`
- 4-9 张 → `color-mix(--grow, 60%)`
- 10+ 张 → `--grow`（满绿）

移动端：热力图横向滚动，格子 12px × 12px，间距 2px。

## 5. 测试策略

`stats.ts` 为纯查询函数，通过 API 集成测试验证（无复杂分支，不要求单元测试）。
热力图日期填充逻辑写一个单元测试覆盖跨月/年边界。
