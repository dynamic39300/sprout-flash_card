# AGENTS.md

> **AI 协作单一事实来源（Single Source of Truth）。** 本文件面向所有 AI 编码助手（Cursor / Claude Code / Copilot 等），
> 定义在本仓库工作的规则、命令与边界。人类请读 `README.md`；AI 请以本文件为准。
> Claude 用户见 `CLAUDE.md`（薄封装，指向此处）；Cursor 作用域规则见 `.cursor/rules/`。

## 项目概览（Project Overview）

flash_card 是一个**移动端优先的在线网页工具**，用于个人知识记忆：记录正反面问答闪卡（支持文本+图片）→ 按间隔重复算法（SM-2）推送每日复习 → 用累计打卡热力图激励长期坚持。手机与 PC 共用一份服务器数据，免登录，部署于阿里云自用。

完整需求见 `docs/prd/PRD.md`，技术设计见 `docs/tech-spec/TECH_SPEC.md`，最高原则见 `.specify/memory/constitution.md`。

## 最高优先级规则（YOU MUST）

1. **先规格后代码**：非平凡功能必须遵循 SDD 流程（Constitution → Specify → Clarify → Plan → Tasks → Implement → Validate）。禁止从想法直接跳到编码。
2. **宪法优先**：`.specify/memory/constitution.md` 优先于一切。冲突时以宪法为准。
3. **遇歧义先澄清**：不臆测需求。信息不足时提出澄清问题，而不是猜测实现。
4. **行为变更先改规格**：需求变化时，先更新对应 `specs/NNN-*/spec.md`，再改代码。
5. **数据不可损毁**：SQLite 数据库与用户上传图片是珍贵且不可再生的数据，严禁危险操作；`data/`、`uploads/`、`*.db` 不入 git。
6. **密钥零硬编码**：一切凭证走环境变量，严禁提交入库。

## 技术栈（Locked Stack）

- 前端：React + Vite + TypeScript（移动端优先响应式，PWA 可选）
- 后端：Node.js + TypeScript（单体）
- 数据库：SQLite（单文件）
- 图片：服务器本地磁盘（预留迁移 OSS）
- 部署：阿里云 ECS + Nginx +（PM2 / Docker）

> 未经宪法修订，不得擅自更换以上技术选型。

## 关键命令（Key Commands）

> 说明：项目脚手架尚未搭建，以下为约定命令；实现后请在此保持与 `package.json` 一致。

```bash
# 安装依赖
npm install

# 本地开发（前端 + 后端）
npm run dev

# 类型检查
npm run typecheck

# Lint 与格式化
npm run lint
npm run format

# 运行测试
npm test

# 构建生产包
npm run build
```

## 代码风格与约定（Conventions）

- 全量 TypeScript，开启 `strict`；禁止无理由 `any`。
- 命名：变量/函数 `camelCase`，类型/组件 `PascalCase`，常量 `UPPER_SNAKE_CASE`，文件名组件用 `PascalCase.tsx`、其余 `kebab-case`。
- 组件保持小而单一职责；业务逻辑与 UI 分离。
- 注释只解释「为什么」，不复述「做了什么」。
- 详见 `docs/standards/coding-standards.md`。

## 提交与分支（Git）

- 遵循 **Conventional Commits**：`type(scope): subject`（如 `feat(review): 实现 SM-2 调度`）。
- 提交/PR 关联 spec：脚注写 `refs specs/NNN-feature-name/spec.md`。
- 一个功能一个分支：`NNN-feature-name`。
- 详见 `docs/standards/git-workflow.md`。

## 测试（Testing）

- 核心算法（SM-2 间隔重复、连胜/打卡统计）**必须**有单元测试，随实现一起提交。
- 详见 `docs/standards/testing-standards.md`。

## 边界（Boundaries · Never / Ask First）

**永不（Never）：**
- 永不提交 `data/`、`uploads/`、`*.db`、`.env` 等数据/密钥文件。
- 永不在未更新对应 spec 的情况下改变已定义的功能行为。
- 永不引入宪法之外的新技术栈/框架而不先申请修订。
- 永不执行不可逆的破坏性数据操作（删库、无备份迁移）。

**先问（Ask First）：**
- 变更技术选型、数据库 schema 的破坏性迁移。
- 引入新的重量级依赖。
- 扩大功能范围（超出当前 spec 的 Out of Scope 边界）。
- 任何 `git push --force`、重置历史等高危 git 操作。

## 目录导航（Where things live）

| 路径 | 用途 |
|------|------|
| `.specify/memory/constitution.md` | 项目宪法（最高原则） |
| `AGENTS.md` | AI 协作规范（本文件，事实来源） |
| `CLAUDE.md` | Claude 专用薄封装 |
| `.cursor/rules/` | Cursor 作用域规则 |
| `docs/prd/` | 产品需求文档 PRD |
| `docs/tech-spec/` | 技术详设 Tech Spec |
| `docs/standards/` | 编码/Git/测试/部署/安全/DoD/文档/Skill 设计规范 |
| `docs/process/` | SDD 流程说明 |
| `skills/` | 项目自定义 Skill（能力包）+ 模板 |
| `specs/NNN-*/` | 各功能的 spec/plan/tasks |
| `specs/templates/` | 规格文档模板 |

## 变更本文件

AGENTS.md 是活文档。当命令、约定或边界发生变化时，与代码变更一起更新本文件，保持权威、精简（建议 < 300 行）。
