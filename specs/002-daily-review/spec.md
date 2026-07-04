# [002] 每日复习（SM-2）· Spec

- **功能 ID**：002-daily-review
- **状态**：Approved
- **关联 PRD**：`docs/prd/PRD.md` 4.2
- **最后更新**：2026-07-04

## 1. 目标（Why）

让用户每天打开应用即看到「今日待复习」队列，逐张翻卡、自评，系统按 SM-2 算法自动安排下次出现时间。越熟的卡间隔越长、越少打扰，复习精力集中在没记牢的地方。

## 2. 用户场景

- 打开青芽 → 首页（今日复习）直接呈现今日队列，无需任何导航。
- 看到卡片正面（问题）→ 回想答案 → 点击翻面看背面 → 自评难度 → 系统调度下次。
- 全部做完 → 「今日已清空，继续生长」的完成态，有简单的正反馈。
- 当天没有到期卡片 → 安静的空状态，提示去记新卡。

## 3. 功能需求（What）

- 查询今日到期队列：`due_date ≤ 今天`，按 `due_date ASC, card_id ASC` 排序。
- 翻卡交互：**正面（问题）先展示 → 点击/滑动翻面 → 背面（答案）出现 → 显示四档评分按钮（Again / Hard / Good / Easy）**。
- 评分后系统用 SM-2 更新 `ease_factor`、`interval_days`、`repetitions`、`due_date`，并写 `review_logs`。
- 新建卡片时自动插入 `review_states`（`due_date = 今天`），当天即可出现在复习队列。
- 今日进度：「X / Y 张」，全部完成后展示完成态。

## 4. 验收标准（EARS）

- WHEN 用户打开「复习」页，THE SYSTEM SHALL 展示所有 `due_date ≤ today` 的卡片作为今日队列。
- WHEN 用户点击翻面，THE SYSTEM SHALL 揭示卡片背面并显示四档评分按钮。
- WHEN 用户评分为 Again，THE SYSTEM SHALL 将该卡间隔重置为 1 天（`repetitions = 0`）。
- WHEN 用户评分为 Good/Easy，THE SYSTEM SHALL 按 SM-2 扩大间隔并更新 `due_date`。
- WHEN 今日队列全部评分完成，THE SYSTEM SHALL 显示「今日已清空」完成态。
- WHEN 新卡片创建，THE SYSTEM SHALL 插入 `review_states`（`due_date = 今天`）使其当日可复习。
- IF 今日无到期卡片，THEN THE SYSTEM SHALL 展示空状态，不报错。

## 5. Out of Scope

- 打卡热力图与累计统计（功能三）。
- 复习时编辑卡片内容。
- 手动设置间隔或跳过某张卡。

## 6. 依赖

- 依赖功能一（卡片数据、`cards` 表已就绪）。
- SM-2 算法：Tech Spec 第 4 节已定义，本功能实现它。
