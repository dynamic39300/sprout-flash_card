# [001] 记录知识闪卡 · Tasks（任务拆分）

- **关联 Plan**：`specs/001-card-capture/plan.md`
- **最后更新**：2026-07-04

## 任务列表

- [x] T1. 搭建 npm workspaces 单仓骨架（root / client / server）+ 根 dev 脚本
- [x] T2. 确立设计体系文档与设计令牌 CSS（色板/字体/网格/签名元素）
- [x] T3. [T] 后端：SQLite 建表 + DB 初始化模块（含建表 SQL）
- [x] T4. [T] 后端：图片上传路由（类型/魔数/大小/随机名/防穿越校验）— 依赖 T3
- [x] T5. [T] 后端：卡片 CRUD 路由（创建/列表筛选/详情/编辑/软删除）— 依赖 T3
- [x] T6. 前端：应用壳 + 底部导航 + 路由（记卡片/卡片库 功能，复习/坚持 占位）— 依赖 T2
- [x] T7. 前端：记卡片页（正反面文本 + 图片粘贴/上传 + 标签 + 保存）— 依赖 T6
- [x] T8. 前端：卡片库页（列表 + 关键词/标签筛选 + 删除）— 依赖 T6
- [x] T9. 前端：API 封装 + 与后端联调
- [x] T10. 启动验证记卡→入库→卡片库可见的闭环

## 验收（对照 spec + DoD）

- [x] 覆盖 spec 全部 EARS 验收标准（后端已 curl 逐条验证）
- [x] 核心校验逻辑单元测试通过（16/16）
- [x] typecheck 全绿；client 生产构建通过
- [~] 满足 `docs/standards/definition-of-done.md`（功能级 DoD）—— lint 工具链未搭建（见下）
- [x] 满足 `docs/standards/security.md`（上传魔数/大小校验、输入校验、软删除、随机文件名防穿越）

## 进度备注

- 设计方向：Riso Study（见 `docs/design/design-system.md`），已截图核验视觉。
- 端口：本机 3000 被其他项目占用，后端默认端口改为 **8787**（含 vite 代理与 .env.example）。
- 未做（后续）：ESLint/Prettier 与 pre-commit/CI 尚未落地，故 `lint` 脚本暂缺；编辑/详情页 UI 未做（API 已具备 PATCH）。
- 未做（属功能二/三）：复习调度、打卡热力图为占位页。
