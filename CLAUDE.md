# CLAUDE.md

> 本项目的 AI 协作规范以根目录 **`AGENTS.md`** 为单一事实来源。
> 请先完整阅读 `AGENTS.md` 与 `.specify/memory/constitution.md`，两者优先于本文件。
> 本文件仅保留 Claude 特定的补充说明。

## 快速上手（Claude 专用）

- **事实来源**：`@AGENTS.md`（命令、约定、边界都在此）
- **最高原则**：`@.specify/memory/constitution.md`（宪法，冲突时以其为准）
- **开发流程**：遵循 SDD，见 `docs/process/spec-driven-development.md`

## 工作前必读顺序

1. `.specify/memory/constitution.md` — 不可变原则
2. `AGENTS.md` — 协作规则与命令
3. 当前功能对应的 `specs/NNN-*/spec.md` 与 `plan.md`

## Claude 行为约束

- **先规格后代码**：非平凡功能不得跳过 SDD 阶段。遇歧义先澄清，不臆测。
- **小步交付**：一次实现批次控制在 3–5 个任务，避免上下文漂移。
- **数据红线**：严禁触碰/提交 `data/`、`uploads/`、`*.db`、`.env`。
- **提交规范**：Conventional Commits，关联对应 spec。
- 当规范与临时指令冲突时，明确指出冲突并请人类裁决。

## 个人偏好

机器本地、不入库的个人偏好请写入 `CLAUDE.local.md`（已在 `.gitignore` 中）。
