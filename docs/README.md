# 文档索引 · docs

flash_card 项目的文档中心。本项目采用**规范驱动开发（SDD）** + **AGENTS.md 事实来源**的工程实践。

## 阅读顺序（新成员/AI 上手）

1. **项目宪法** — `.specify/memory/constitution.md`（最高原则，优先一切）
2. **AI 协作规范** — `../AGENTS.md`（事实来源）／`../CLAUDE.md`（Claude 专用）
3. **产品需求** — `prd/PRD.md`
4. **技术设计** — `tech-spec/TECH_SPEC.md`
5. **开发流程** — `process/spec-driven-development.md`
6. **各类规范** — `standards/`
7. **功能规格** — `../specs/`

## 目录

| 路径 | 内容 |
|------|------|
| `prd/PRD.md` | 产品需求文档（做什么/为什么/验收标准） |
| `tech-spec/TECH_SPEC.md` | 技术详设（架构/数据模型/API/算法/部署） |
| `process/spec-driven-development.md` | SDD 流程与 EARS 语法 |
| `standards/coding-standards.md` | 编码规范 |
| `standards/git-workflow.md` | Git 工作流与提交规范 |
| `standards/testing-standards.md` | 测试规范 |
| `standards/deployment.md` | 部署规范（阿里云） |
| `standards/security.md` | 安全规范（上传/输入/密钥/访问控制） |
| `standards/definition-of-done.md` | 完成的定义（DoD 质量门槛） |
| `standards/documentation.md` | 文档规范 |
| `standards/skill-design.md` | 大模型 Skill 设计方法论与最佳实践 |
| `design/design-system.md` | 前端设计体系（色板/字体/壳层模式） |
| `design/competitive-analysis.md` | 竞品调研（定位/场景/交互/UI 方法） |
| `../skills/` | 项目自定义 Skill（含模板 `skill-template`） |
| `../.env.example` | 环境变量示例（复制为 `.env` 使用） |

## 文档与规则的关系

```
constitution.md  ── 最高原则（不可变）
      │
      ▼
AGENTS.md  ── AI 协作事实来源 ──►  CLAUDE.md（薄封装）
      │                              .cursor/rules/*.mdc（作用域规则）
      ▼
docs/（PRD · Tech Spec · standards · process）
      │
      ▼
specs/NNN-*/（spec → plan → tasks）── 驱动 ──►  代码 + 测试
```
