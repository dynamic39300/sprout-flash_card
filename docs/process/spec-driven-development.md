# 规范驱动开发流程 · Spec-Driven Development (SDD)

> 本项目的开发方法论。参考 GitHub Spec Kit / 微软 SDD 实践（2026）。
> 核心理念：**规格是事实来源，先规格后代码**。规格驱动实现，而非临时提示驱动。

## 1. 生命周期

```
Constitution → Specify → Clarify → Plan → Tasks → Implement → Validate
   宪法          规格       澄清      计划     拆分      实现       验证
```

| 阶段 | 产物 | 回答的问题 |
|------|------|-----------|
| Constitution 宪法 | `.specify/memory/constitution.md` | 不可变原则是什么？ |
| Specify 规格 | `specs/NNN-*/spec.md` | 做什么？为什么？验收标准？ |
| Clarify 澄清 | 更新 spec | 哪里有歧义/边界未定？ |
| Plan 计划 | `specs/NNN-*/plan.md` | 怎么做？架构/数据/接口？ |
| Tasks 拆分 | `specs/NNN-*/tasks.md` | 拆成哪些可执行任务？ |
| Implement 实现 | 代码 + 测试 | 按任务实现 |
| Validate 验证 | 核验记录 | 是否满足验收标准？ |

## 2. 关键规则

1. **一个功能 = 一个目录**：`specs/NNN-feature-name/`，NNN 为三位序号（`001-`、`002-`…）。
2. **不跳阶段**：每个阶段边界需人类评审后再前进。禁止从想法直接编码。
3. **先改规格再改代码**：需求/行为变化时，先更新 spec。
4. **规格精简**：spec 保持 1–3 页；过大则拆分为多个功能。
5. **明确 Out of Scope**：写清「不做什么」和「做什么」同等重要。
6. **小步实现**：一次 3–5 个任务，避免上下文漂移。
7. **可追溯**：提交/PR 关联 spec（`refs specs/NNN-*/spec.md`）。

## 3. EARS 验收标准语法

用 EARS（Easy Approach to Requirements Syntax）写清晰、可测、AI 可读的验收标准：

| 模式 | 模板 | 用途 |
|------|------|------|
| 普遍 | THE SYSTEM SHALL <行为> | 恒定要求 |
| 事件驱动 | WHEN <触发>, THE SYSTEM SHALL <行为> | 响应某事件 |
| 状态驱动 | WHILE <状态>, THE SYSTEM SHALL <行为> | 处于某状态时 |
| 可选特性 | WHERE <特性存在>, THE SYSTEM SHALL <行为> | 条件特性 |
| 不期望行为 | IF <条件>, THEN THE SYSTEM SHALL <行为> | 异常/边界处理 |

**示例**：
- WHEN 用户对一张卡评分为 Again，THE SYSTEM SHALL 将其间隔重置为 1 天。
- IF 今日没有到期卡片，THEN THE SYSTEM SHALL 显示空状态而非报错。

## 4. 每个阶段做什么

### Specify（规格）
描述**做什么/为什么**，不写实现细节。包含：目标、用户场景、功能需求、EARS 验收标准、Out of Scope、依赖。

### Clarify（澄清）
主动列出歧义、边界、依赖问题，请人类确认。宁可多问，不可臆测。

### Plan（计划）
描述**怎么做**：架构、数据结构/schema、接口契约、涉及模块、第三方依赖、风险。必须符合宪法与锁定技术栈。

### Tasks（拆分）
把 plan 拆成有序、可执行、可测试的小任务，标注依赖关系与「可并行」项，标注需要写测试的任务（TDD）。

### Implement（实现）
按任务顺序实现，核心逻辑先写测试。每批 3–5 个任务，完成即自测。

### Validate（验证）
对照 spec 的 EARS 验收标准逐条核验，并对照 `docs/standards/definition-of-done.md`（DoD）与 `docs/standards/security.md` 完成质量与安全门槛检查，记录结果。

## 5. 与工具的关系

- **Cursor**：`.cursor/rules/spec-driven-workflow.mdc` 在涉及新功能时提醒遵循本流程。
- **模板**：`specs/templates/` 提供 spec/plan/tasks 起始模板。
- **右尺度采用**：并非每个微小改动都要走完整流程；平凡改动（改文案、修小 bug）可轻量处理，但功能性变更必须走流程。
