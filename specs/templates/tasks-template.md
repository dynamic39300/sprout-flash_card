# [NNN] 功能名称 · Tasks（任务拆分）

- **功能 ID**：NNN-feature-name
- **关联 Plan**：`specs/NNN-feature-name/plan.md`
- **最后更新**：YYYY-MM-DD

> 将 plan 拆成有序、可执行、可评审的小任务。一次实现批次控制在 3–5 个任务。
> 标注：`[T]` 需先写测试（TDD）；`[P]` 可与前项并行；依赖用「依赖: Tn」标注。

## 任务列表

- [ ] T1. <任务描述>
- [ ] T2. [T] <涉及核心逻辑，先写测试> — 依赖: T1
- [ ] T3. [P] <可并行任务>
- [ ] T4. <任务描述> — 依赖: T2
- [ ] T5. <任务描述>

## 验收（对照 spec + DoD）

- [ ] 覆盖 spec 全部 EARS 验收标准
- [ ] 核心逻辑单元测试通过
- [ ] typecheck / lint / test 全绿
- [ ] 提交信息关联本 spec
- [ ] 满足 `docs/standards/definition-of-done.md`（功能级 DoD）
- [ ] 满足 `docs/standards/security.md` 相关安全检查

## 进度备注

<实现过程中的决策、遇到的问题与调整记录>
