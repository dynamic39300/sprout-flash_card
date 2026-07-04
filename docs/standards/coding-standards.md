# 编码规范 · Coding Standards

> 适用于本项目全部 TypeScript / React 代码。AI 与人类协作者均须遵守。
> 精简作用域版见 `.cursor/rules/coding-standards.mdc`。

## 1. 语言与类型

- 前后端统一 **TypeScript**，开启 `strict`。禁止无理由 `any`；不得已用 `unknown` 并显式收窄。
- 公共导出（函数、组件、模块 API）必须显式标注类型。
- 用 `type` / `interface` 明确建模领域对象；避免使用魔法字面量，抽为常量或枚举联合。
- 优先不可变数据（`const`、只读结构），减少副作用。

## 2. 命名

| 对象 | 约定 | 示例 |
|------|------|------|
| 变量 / 函数 | camelCase | `dueCards`, `computeInterval` |
| 类型 / 接口 / 组件 | PascalCase | `ReviewState`, `CardEditor` |
| 常量 | UPPER_SNAKE_CASE | `DEFAULT_EASE_FACTOR` |
| 布尔 | is/has/should 前缀 | `isDue`, `hasImages` |
| 组件文件 | PascalCase.tsx | `CardEditor.tsx` |
| 其他文件 | kebab-case.ts | `srs-algorithm.ts` |

命名用完整、可读的英文；避免缩写与拼音。

## 3. 结构与组织

- **单一职责**：一个函数/组件只做一件事，过长（>约 50 行）考虑拆分。
- **UI 与逻辑分离**：业务逻辑抽到 hooks / service / domain，组件专注渲染。
- **纯函数优先**：核心逻辑（如 SM-2）写成无副作用纯函数，便于测试。
- **早返回**：用 guard clause 减少嵌套层级。
- 目录按职责分层，遵循 `TECH_SPEC.md` 第 7 节的建议结构。

## 4. 注释

- 只写「为什么」——意图、权衡、非显而易见的约束。
- **禁止**复述代码的注释（如 `// 循环遍历`、`// 返回结果`）。
- 复杂算法在函数头用简短说明 + 引用来源/spec。

## 5. 错误处理

- 不吞异常；不 `catch` 后空处理。
- 后端接口统一返回 `{ ok, data | error }` 结构（见 Tech Spec）。
- 面向用户的错误信息清晰友好，内部日志保留堆栈。
- 对外部输入（请求体、上传文件）一律做校验。

## 6. 依赖管理

- 用 npm 添加依赖，锁定版本（提交 lockfile）。
- 引入新的重量级依赖前需评审（见 AGENTS.md 边界）。
- 不重复造轮子，但也不为小功能引入大依赖。

## 7. 格式化与 Lint

- 使用 ESLint + Prettier 统一风格，配置随项目提交。
- 提交前须通过 `npm run lint` 与 `npm run typecheck`。
- 格式由工具保证，代码评审不纠结格式，聚焦逻辑与设计。
