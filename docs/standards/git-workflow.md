# Git 工作流规范 · Git Workflow

> 精简作用域版见 `.cursor/rules/git-commit.mdc`。

## 1. 分支模型

- `main`：稳定可部署分支，受保护。
- 功能分支：一个功能一个分支，命名与 spec 对应：`NNN-feature-name`，如 `001-card-capture`。
- 修复分支：`fix/简述`。

## 2. 提交信息（Conventional Commits）

格式：

```
<type>(<scope>): <subject>

<body：可选，解释为什么这样改>

refs specs/NNN-feature-name/spec.md
```

**type**：`feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore` / `perf` / `build` / `ci`

**规则**：
- subject 祈使句、简洁（≤ 50 字），结尾无句号。
- scope 用模块名：`card` / `review` / `streak` / `stats` / `deploy` / `docs` 等。
- 一次提交只做一件事；无关改动分开提交。
- 关联 spec：脚注 `refs specs/NNN-*/spec.md`（体现规范驱动的可追溯性）。
- 破坏性变更：`feat(api)!: ...`，body 内写 `BREAKING CHANGE: 说明`。

**示例**：

```
feat(review): 实现 SM-2 间隔重复调度

根据 Again/Hard/Good/Easy 评分更新 ease、interval 与 due_date。
新卡次日进入复习循环，越熟出现越少。

refs specs/002-daily-review/spec.md
```

## 3. 提交前检查（本地）

- `npm run typecheck` 通过
- `npm run lint` 通过
- `npm test` 通过（涉及核心逻辑时）
- 不包含 `data/`、`uploads/`、`*.db`、`.env` 等被忽略文件

## 4. PR / 合并

- PR 标题遵循 Conventional Commits；描述关联 spec 与验收标准完成情况。
- 自测清单对照 spec 的 EARS 验收标准逐条核对。
- 合并前确保基于最新 `main`，冲突已解决。

## 5. 高危操作（Ask First）

以下操作必须先经人类确认，AI 不得擅自执行：
- `git push --force` / 强推 `main`
- 重置/改写已推送的历史（`reset --hard`、`rebase` 已共享分支）
- 删除分支/标签等不可逆操作

## 6. 禁止

- 禁止提交密钥、凭证、真实数据。
- 禁止在提交中夹带无关的大规模格式化改动。
- 禁止跳过 hooks（`--no-verify`）除非人类明确要求。
