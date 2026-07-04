# 青芽 Sprout · 让知识生长

> 代号 flash_card。一个**移动端优先的在线网页工具**，用于个人知识记忆——新知如芽，复习使其生长。

1. **记录闪卡** —— 随手记录正反面问答卡，支持文本与图片（粘贴 / 上传），手机与 PC 通用。
2. **每日复习** —— 按间隔重复算法（SM-2）推送今日待复习卡片，主动回忆并自评。
3. **坚持打卡** —— 用累计天数与热力图记录坚持轨迹，佛系激励长期记忆。

> 手机 + PC 共用一份服务器数据，免登录，部署于阿里云自用。

## 项目状态

📐 **规范先行阶段**：已完成产品设计、需求（PRD）、技术设计（Tech Spec）与工程规范体系。代码尚未开始实现。

## 工程实践

本项目采用**规范驱动开发（SDD）**：先规格，后代码。AI 协作以 `AGENTS.md` 为单一事实来源，以 `.specify/memory/constitution.md` 为最高原则。

## 文档导航

| 想了解 | 看这里 |
|--------|--------|
| 最高原则（宪法） | `.specify/memory/constitution.md` |
| AI 协作规范 | `AGENTS.md` · `CLAUDE.md` · `.cursor/rules/` |
| 产品需求 | `docs/prd/PRD.md` |
| 技术设计 | `docs/tech-spec/TECH_SPEC.md` |
| 开发流程 | `docs/process/spec-driven-development.md` |
| 工程规范 | `docs/standards/` |
| 功能规格 | `specs/` |
| 文档总索引 | `docs/README.md` |

## 技术栈

React + Vite + TypeScript（前端）· Node.js + TypeScript（后端）· SQLite · 本地磁盘存图 · 阿里云 ECS + Nginx 部署。

## 后续里程碑

1. **M1 核心闭环**：记卡 → 复习（SM-2）→ 打卡热力图，本地可跑。
2. **M2 打磨**：移动端交互、卡片库筛选/搜索、反馈细节。
3. **M3 部署**：阿里云上线自用 + 数据备份。
