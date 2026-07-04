# skills · 大模型技能目录

本目录存放项目自定义的 **Agent Skills**（可复用的、按任务触发的能力包）。

- 设计方法论与最佳实践：`docs/standards/skill-design.md`
- 作用域规则（编辑 SKILL.md 时自动提醒）：`.cursor/rules/skill-authoring.mdc`

## 结构约定

```
skills/
├── templates/
│   └── skill-template/          # 起始模板，复制它来创建新技能
│       ├── SKILL.md
│       ├── references/
│       ├── scripts/
│       ├── assets/
│       └── evals/evals.json
└── <your-skill-name>/           # 每个技能一个 kebab-case 文件夹
    └── SKILL.md
```

## 创建新技能

1. 复制 `templates/skill-template/` 为 `skills/<your-skill-name>/`。
2. 重写 `SKILL.md` 的 frontmatter（`name` + `description`）与正文，遵循 `docs/standards/skill-design.md`。
3. 把详细内容移入 `references/`，重复性逻辑抽到 `scripts/`。
4. （客观类技能）在 `evals/evals.json` 写 2–3 个真实测试 prompt，与"不带技能"基线对比迭代。
5. 对照 `skill-design.md` 的「质量检查清单」逐条核对。

## Skill 与项目规则的区别

- `.cursor/rules/` / `AGENTS.md`：**始终或按路径生效**的项目约束（代码风格、边界）。
- **Skill**：**按任务触发**、可复用的专项工作流能力包。

> 说明：技能被具体 AI 工具自动发现的位置可能因工具而异（如 Cursor / Claude 的技能目录）。本目录作为项目内技能的**规范存放与版本管理位置**；接入某工具时，按其约定放置或建立软链接即可。
