# specs · 功能规格目录

本目录遵循**规范驱动开发（SDD）**：一个功能一个目录，每个目录含 `spec.md`（规格）、`plan.md`（计划）、`tasks.md`（任务）。

流程详见 `docs/process/spec-driven-development.md`。

## 命名约定

```
specs/
├── templates/            # 起始模板（勿直接改，复制使用）
│   ├── spec-template.md
│   ├── plan-template.md
│   └── tasks-template.md
├── 001-card-capture/     # 功能一：记录闪卡
│   ├── spec.md
│   ├── plan.md
│   └── tasks.md
├── 002-daily-review/     # 功能二：每日复习（SM-2）
└── 003-streak-heatmap/   # 功能三：坚持打卡热力图
```

- 目录名：`NNN-feature-name`，NNN 为三位序号。
- 新功能：复制 `templates/` 下模板到新目录，从 `spec.md` 开始。

## 规划中的功能（来自 PRD v1.0）

| ID | 功能 | 对应 PRD |
|----|------|----------|
| 001-card-capture | 记录知识闪卡（文本+图片，手机/PC） | PRD 4.1 |
| 002-daily-review | 按 SM-2 每日复习 | PRD 4.2 |
| 003-streak-heatmap | 佛系打卡（累计天数 + 热力图） | PRD 4.3 |

> 以上为规划，尚未开工。开始某功能时再创建其目录与文档，避免空壳。
