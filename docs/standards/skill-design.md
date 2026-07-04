# 大模型 Skill 设计方法论与最佳实践 · Skill Design Standards

> 依据：Anthropic Agent Skills 官方规范与 `anthropics/skills` 仓库（skill-creator）、《The Complete Guide to Building Skills for Claude》、Agent Skills 标准（agentskills.io）。2026 版实践。
> 作用域规则见 `.cursor/rules/skill-authoring.mdc`；模板见 `skills/templates/skill-template/`。

---

## 1. 什么是 Skill

Skill 是一个**自包含的文件夹**，用可复用的方式教模型完成某类任务。它是「渐进式披露」的载体：把能力封装成模型**按需加载**的知识包，而不是把所有指令塞进系统提示。

一个 Skill 的核心是 `SKILL.md`（含 YAML frontmatter + Markdown 指令），可选捆绑 `scripts/`、`references/`、`assets/`。

Skill 与本项目已有规范的关系：

- `AGENTS.md` / `.cursor/rules/` = **始终或按路径生效**的项目规则（约束「怎么写代码」）。
- **Skill** = **按任务触发**的可复用能力包（封装「如何完成某类工作流」）。
- 二者互补：规则管代码风格与边界，Skill 管可复用的专项工作流。

## 2. 目录结构（Anatomy）

```
skill-name/                    # 文件夹名用 kebab-case
├── SKILL.md                   # 必需：YAML frontmatter + Markdown 指令
├── scripts/                   # 可选：可执行代码（确定性/重复性任务）
├── references/                # 可选：按需加载的文档
└── assets/                    # 可选：输出用的模板/图标/字体等
```

**硬性约定**：
- 入口文件名必须精确为 `SKILL.md`（全大写）。
- 文件夹名用小写连字符：`pdf-extractor`、`brand-docs`。
- **Skill 文件夹内不要放 `README.md`**。所有文档进 `SKILL.md` 或 `references/`。（对外分发时，仓库级 README 面向人类，与 skill 文件夹分开。）

## 3. 核心设计原则：渐进式披露（Progressive Disclosure）

三级加载系统，按需把内容"提升"进上下文，避免上下文膨胀：

| 级别 | 内容 | 何时加载 | 大小指引 |
|------|------|----------|----------|
| L1 元数据 | `name` + `description` | **始终**在上下文 | ~100 词 |
| L2 SKILL.md 正文 | 完整指令与指引 | 技能**被触发**时 | < 500 行（理想） |
| L3 捆绑资源 | `references/`、`scripts/`、`assets/` | **被显式引用**时 | 无上限；脚本可执行而不载入上下文 |

**关键模式**：
- SKILL.md 保持 < 500 行；接近上限时，**增加一层结构**，并给出清晰指针告诉模型"接下来去读哪个文件"。
- 从 SKILL.md 清楚地引用资源文件，并说明「何时该读它」（如：`需要 X 时，阅读 references/guide.md`）。
- 大型 reference 文件（> 300 行）在开头放目录（TOC）。
- **多领域/框架**按变体组织，模型只读相关那一个：

```
cloud-deploy/
├── SKILL.md            # 工作流 + 选择逻辑
└── references/
    ├── aws.md
    ├── gcp.md
    └── azure.md
```

> 这些数字是指引而非硬限制。若指令本身复杂，超过 500 行也可以（官方 skill-creator 就有 480 行）。

## 4. YAML Frontmatter 规范

```yaml
---
name: skill-name
description: 简述做什么。Use when 用户……（列出具体触发场景/短语/文件类型）。
---
```

- **`name`（必需）**：唯一标识，小写连字符。
- **`description`（必需，最重要）**：Skill 的**主要触发机制**。要求：
  - **同时**包含「做什么」与「何时用」——所有"when to use"信息放这里，**不要**放正文。
  - **≤ 1024 字符**，**不含 XML 尖括号（`<`、`>`）**。
  - 第三人称、去除废话；列出用户可能说的**具体任务短语**、相关**文件类型**。
  - **略带"pushy"**：模型倾向于"漏触发"（undertrigger），所以描述要主动。加上「即使用户没有明确说出 X，只要涉及 …… 就应使用本技能」。
  - 建议包含**负向触发**（哪些相邻场景**不该**用），减少误触发。
- `compatibility` / `license`（可选，少用）：所需工具/依赖、许可协议。

**description 示例对比**：

**Example 1（弱）：**
```
description: 构建展示内部数据的仪表盘。
```
**Example 1（强，推荐）：**
```
description: 构建展示内部数据的简单快速仪表盘。只要用户提到仪表盘、数据可视化、内部指标，或想展示任何公司数据，即使没有明确说"仪表盘"，都应使用本技能。
```

## 5. 正文写作规范（Body）

- **用祈使句**写指令（"Read the file"，而非"You should read the file"）。
- **解释「为什么」，而非堆砌大写 MUST/NEVER**。现代模型有很好的 theory of mind——讲清意图与原因，比僵硬的全大写约束更有效、更通用。若发现自己在写一堆大写 ALWAYS/NEVER，是一个"黄旗"，尝试改为解释原因。
- **给具体示例**（Input → Output 形式）帮助模型对齐格式。
- **明确定义输出结构**（需要固定格式时给出精确模板）。
- **通用而非过拟合**：为「被调用一百万次」而写，不要为几个测试样例硬编码 fiddly 的特例。
- **保持精简**：删掉不"拉动价值"的内容；读运行 transcript，发现技能让模型做无用功的部分就删掉。

**输出格式定义示例**：
```markdown
## 报告结构
始终使用以下模板：
# [标题]
## 摘要
## 关键发现
## 建议
```

**示例块写法**：
```markdown
## 提交信息格式
**Example 1:**
Input: 增加了 JWT 令牌的用户认证
Output: feat(auth): implement JWT-based authentication
```

## 6. 捆绑资源使用时机

- **`scripts/`**：当多次运行都在重复写相似的辅助脚本时（如都写了 `create_docx.py`），把它写一次放进 `scripts/`，让技能调用——每次调用免于重复造轮子。脚本可执行而不占用上下文。
- **`references/`**：详细文档、schema、领域知识。SKILL.md 只留核心指令，细节移到此处并用指针引用。
- **`assets/`**：输出中要用到的模板、图标、字体、HTML 模板等。

## 7. 测试与评估（Test-Driven）

适用于**有客观可验证输出**的技能（文件转换、数据抽取、代码生成、固定工作流）；主观类（写作风格、美术）多用定性评估，不必强套断言。

1. **写 2–3 个 realistic 测试 prompt**——真实用户会说的话，存入 `evals/evals.json`（先只写 prompt，断言稍后补）。
2. **与基线对比**：同一 prompt 分别「带技能」与「不带技能（baseline）」各跑一次，衡量技能带来的真实增量（delta）。
3. **断言**要客观可验证、命名清晰；能用脚本判定的就写脚本，别靠肉眼。
4. **迭代**：根据结果与人类反馈改进技能 → 重跑 → 直到满意或反馈趋于正面。改进时优先"从反馈中泛化"，避免过拟合特例。

`evals.json` 结构示例：
```json
{
  "skill_name": "example-skill",
  "evals": [
    { "id": 1, "prompt": "用户的任务 prompt", "expected_output": "期望结果描述", "files": [] }
  ]
}
```

## 8. 描述触发优化（Description Optimization）

description 决定是否被调用，创建/改进后应优化它：

1. **生成约 16–20 条触发 eval query**：8–10 条 should-trigger + 8–10 条 should-not-trigger。
2. query 要**真实、具体、带细节**（文件路径、列名、公司名、口语/typo 皆可），聚焦**边界与近似案例**：
   - should-trigger：同一意图的不同措辞（正式/口语）、用户没点名却明显需要的场景、与其他技能竞争但本技能应胜出的场景。
   - should-not-trigger：**近似陷阱**——共享关键词但实际需要别的能力的相邻场景。别用"写个 fibonacci 函数"这种一眼无关的，测不出东西。
3. 迭代描述直到在**留出测试集**上稳定（用 test 分数而非 train 分数选择，避免过拟合）。

**触发机制要点**：模型只对"自己难以直接搞定"的任务才查阅技能。简单一步查询（"读这个 PDF"）即便描述完全匹配也可能不触发——所以 eval query 要足够有分量。

## 9. 安全与"无意外原则"（Lack of Surprise）

- 技能内容不得包含恶意代码、漏洞利用或危害系统安全的内容。
- 技能的行为不应"出乎用户意料"——若如实描述，用户应能预期它会做什么。
- 拒绝创建误导性技能或用于未授权访问、数据窃取等的技能。
- 对输入做校验、优雅处理错误。

## 10. 质量检查清单（Quality Checklist）

技能完成前逐条核对：

- [ ] 文件夹名 kebab-case，入口为 `SKILL.md`，**无 README.md** 在技能文件夹内
- [ ] frontmatter 含 `name` + `description`，description 同时说清「做什么 + 何时用」，≤1024 字符、无尖括号、含触发关键词、略 pushy、有负向触发
- [ ] SKILL.md 正文 < 500 行（或有清晰的分层与指针）
- [ ] 详细内容移入 `references/`，大文件（>300 行）带目录
- [ ] 指令用祈使句、解释「为什么」、含具体示例
- [ ] 重复性工作抽成 `scripts/`
- [ ] （客观类）有 evals 与基线对比
- [ ] 符合"无意外原则"，输入有校验、错误有处理

## 11. 与本项目的落地关系

- 项目内自定义 Skill 统一放 `skills/`；起始用 `skills/templates/skill-template/` 复制。
- AI 在**创作或修改任何 `SKILL.md`** 时，遵循本规范（由 `.cursor/rules/skill-authoring.mdc` 按路径触发提醒）。
- Skill 也是"活文档"：随其封装的工作流演进而更新。
