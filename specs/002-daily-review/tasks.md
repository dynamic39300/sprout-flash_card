# [002] 每日复习（SM-2）· Tasks

- **最后更新**：2026-07-04

## 任务列表

- [ ] T1. 后端：`db/index.ts` 追加 `review_states` / `review_logs` 建表 + 索引
- [ ] T2. [T] 后端：`domain/srs.ts` SM-2 纯函数 + `srs.test.ts` 全覆盖
- [ ] T3. 后端：`types.ts` 新增 `Rating` / `ReviewState` / `TodayReview`
- [ ] T4. 后端：`db/reviews.ts` — 初始化调度、查今日队列、提交评分 — 依赖 T1 T2 T3
- [ ] T5. 后端：`db/cards.ts` — `createCard` 事务末追加 `review_states` 初始化 — 依赖 T4
- [ ] T6. 后端：`routes/reviews.ts` + 注册到 `index.ts` — 依赖 T4
- [ ] T7. 前端：`lib/api.ts` 新增 `getTodayReview` / `submitRating`
- [ ] T8. 前端：`ReviewPage.tsx` 翻卡交互 + 评分 + 进度 + 空/完成态 — 依赖 T7
- [ ] T9. 前端：`App.tsx` 把 ReviewPage 占位替换为真实组件

## 验收

- [ ] 覆盖 spec 全部 EARS 验收标准
- [ ] SM-2 单元测试全覆盖（含 EF 下限、各分支、多次迭代）
- [ ] typecheck 全绿
- [ ] 满足 DoD 与 security.md

refs specs/002-daily-review/spec.md
