# [004] UI 冷静改造 · Spec

- **功能 ID**：004-ui-polish
- **状态**：Approved → 追加视觉刷新（Phase 2）
- **关联**：`docs/design/design-system.md` · `docs/design/ui-audit-2026-07-19.md`
- **最后更新**：2026-07-19

## 1. 目标

按「日常冷静 + 复习仪式」降低视觉噪声，提升记录/复习/坚持三页的信息层级与交互沉浸感。不改变业务行为（SM-2、CRUD、热力图数据语义）。

**Phase 2 追加目标**（视觉刷新）：解决景深不足、硬描边噪声、等宽标签泛滥、图标不统一等已审视问题，使视觉质感从"线框原型"提升到"精致冷静工具"级别。

## 2. 验收标准（EARS）

### Phase 1（已实现）

- WHEN 用户在记卡/库/坚持页，THE SYSTEM SHALL 显示日常壳（轻品牌 + 短标题 + 底栏），不以英文 eyebrow 喧哗。
- WHEN 用户在复习页且队列未空，THE SYSTEM SHALL 进入会话模式：隐藏 Brand 与常规大标题，仅保留细进度与卡片内容。
- WHEN 复习处于问题阶段，THE SYSTEM SHALL 只展示正面；揭晓后再展示背面与评分条。
- WHEN 用户在记卡页，THE SYSTEM SHALL 提供底部 sticky 保存按钮。
- WHEN 用户查看卡片库，THE SYSTEM SHALL 将今日到期卡优先展示并标注。
- IF 坚持页展示累计天数，THEN THE SYSTEM SHALL 使用克制字号，不以巨型英雄数字抢戏。

### Phase 2（视觉刷新）

**景深与分层**：
- WHEN 卡片/面板出现在页面上，THE SYSTEM SHALL 通过柔和阴影（而非深色硬描边）表达浮起层级；卡面与底色明度差 ≥ 8%。
- WHEN 按钮为主行动（primary），THE SYSTEM SHALL 使用纯色填充 + 柔圆角，不加深色描边。

**描边与装饰**：
- WHEN 复习卡片处于静态展示（正面/背面），THE SYSTEM SHALL 不显示 Riso 错位描边。
- WHEN 用户点击揭晓答案，THE SYSTEM SHALL 以短暂动效（≤0.3s）展示 Riso 错位彩蛋后淡出。

**字体秩序**：
- WHEN 界面展示含中文的标签/标题，THE SYSTEM SHALL 使用 `--font-body`（非等宽），正常大小写。
- WHERE 使用等宽字体，THE SYSTEM SHALL 仅限于纯数字数据（日期、张数、快捷键 hint）。

**图标一致性**：
- WHEN 底部导航展示图标，THE SYSTEM SHALL 使用同一套线性 SVG（统一描边粗细与画板尺寸），不使用 Unicode 字符。

**色彩克制**：
- WHEN 一屏内出现强调色（`--grow` 或等效），THE SYSTEM SHALL 限制为 ≤3 处视觉焦点。
- WHEN 面板左边框或标签激活态需着色，THE SYSTEM SHALL 使用低饱和灰绿而非主强调色。

**规范对齐**：
- IF 坚持页展示累计天数，THEN THE SYSTEM SHALL 字号 ≤ 28px、字重 ≤ 700。
- WHEN 复习会话进行中，THE SYSTEM SHALL 将底栏以半透明弱化（opacity ≤ 0.5）保留可见，而非完全隐藏。

## 3. Out of Scope

- 更换技术栈 / 引入组件库。
- 改变 SM-2 或打卡统计语义。
- 引入暗色模式（后续独立 spec）。
- 更换字体族选型（保持 Bricolage Grotesque + PingFang + Space Mono）。
