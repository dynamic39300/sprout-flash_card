# 竞品调研：闪卡 / 间隔重复 / 卡片笔记 / 知识管理

> 面向青芽 Sprout 的产品与 UI/UX 设计参考。  
> 调研日期：2026-07-18  
> 关联文档：[design-system.md](./design-system.md) · [PRD](../prd/PRD.md)

---

## 0. 调研范围与选型理由

青芽的产品组合是：**记卡（低摩擦）× 复习（SM-2）× 坚持（佛系热力图）**。因此竞品不只看「闪卡 App」，而是按三条链路分别选代表：

| 链路 | 代表竞品 | 选型理由 |
|------|----------|----------|
| 间隔重复 / 复习会话 | Anki、Brainscape、Skola | 行业标杆与新一代开源对照 |
| 笔记 + 闪卡一体 | RemNote | 现代一体化工作流 |
| 低摩擦卡片记录 | flomo | 中文市场卡片笔记哲学最清晰 |
| 知识管理 / 日常入口 | Capacities | 「冷静默认 + 每日笔记脊柱」 |
| 入门友好 / 学习模式 | Quizlet | 大规模用户验证的交互与模式设计 |

**刻意未纳入**：Notion（偏文档协作）、Roam（偏图谱极客）、Duolingo（偏语言游戏化）——与青芽 MVP 边界不符。

---

## 1. Anki

**官网**：https://apps.ankiweb.net · **类型**：开源桌面/移动闪卡 + SM-2/FSRS

### 1.1 产品定位

- **一句话**：面向「严肃长期记忆」的间隔重复引擎，功能优先于美观。
- **目标用户**：医学生、法学生、语言/STEM 重度记忆者、愿意投入 setup 的 power user。
- **价值主张**：算法可控、插件生态庞大、跨平台同步、数据可导出——**记住大量信息，且可坚持数年**。
- **边界**：不做笔记一体、不做 AI 一键生卡；创建卡片摩擦高，UI 被长期诟病。

### 1.2 核心业务场景

1. **建库**：按 Deck（牌组）组织卡片，支持 Basic、Cloze、自定义模板。
2. **每日复习**：打开 Anki → 看到「今日待复习 N 张」→ 进入 Study 会话。
3. **长期维护**：编辑难卡、调整 Deck 选项、导入共享牌组、插件扩展。
4. **异常恢复**：假期回来积压、设置每日上限、Easy Days 等（较新能力）。

### 1.3 关键功能 Feature

| 功能 | 说明 |
|------|------|
| 卡片类型 | Basic（正反面）、Cloze 挖空、自定义 HTML/CSS 模板 |
| 调度算法 | SM-2（经典）；新版支持 FSRS；Deck 级预设 |
| 复习评分 | Again / Hard / Good / Easy（四档，映射到间隔） |
| 媒体 | 文本、图片、音频、LaTeX |
| 生态 | 共享牌组、1000+ 插件、AnkiWeb 同步 |
| 高级 | Filtered decks、Leech 检测、批量编辑、统计 |

### 1.4 用户操作步骤与流程

**创建卡片（典型）**

```
打开 Deck → Add → 选类型 → 填 Front / Back →（可选）加图/音频 → Save
→ 卡片进入「新卡」队列，首次复习后进入调度
```

**复习会话（核心闭环）**

```
启动 Anki → 点击 Study / 今日待复习
→ [1] 只显示问题面（Front）
→ [2] 用户脑中主动回想
→ [3] 点击 Show Answer 显示背面
→ [4] 选择 Again | Hard | Good | Easy
→ [5] 算法更新 due date，进入下一张
→ 重复直到队列清空或达到 Deck 每日上限
```

**键盘流（桌面 power user）**

- 空格：显示答案  
- 1–4：对应四档评分（移动端为触控按钮）

**流程特点**

- **会话与导航分离**：复习时几乎只有「卡 + 按钮」，无品牌、无 Tab。
- **主动回想一步不可省**：必须先看到问题、再想，再揭晓——这是 UX 上的刻意摩擦。
- **失败体验**：长期不用后积压过多，是社区长期痛点（需 Deck limits / Easy Days 缓解）。

### 1.5 UI 样式与设计方法

**现状**

- 视觉偏 2000 年代桌面软件：灰底、小按钮、信息密度高。
- 编辑器窗口尤其被批评「clunky」。
- 社区与第三方有大量「Anki UI Redesign」案例（Behance 等），方向多为：冷静配色、聚焦 Study 屏、减少 chrome。

**设计理念（从产品中抽象）**

1. **算法即产品**：UI 为调度服务，不为「好看」服务——但因此流失 casual 用户。
2. **会话沉浸**：Study 模式是独立 mental model，与 Browse/Add 完全不同。
3. **诚实评分**：四档直接决定间隔，界面必须让评分「一键可达」。
4. **可扩展而非可配置**：Power user 通过插件解决，默认 UI 保持 Spartan。

**可借鉴**

- 复习 **全屏会话 + 先问题后答案 + 四档评分** 的交互骨架。  
- **键盘/触控等效** 的评分快捷键。  
- **今日待复习数量** 作为首页主 CTA。

**刻意不学**

- 过时视觉、复杂 Deck/选项层级、编辑器作为默认创建路径。

---

## 2. RemNote

**官网**：https://www.remnote.com · **类型**：笔记 + 嵌入式闪卡 + SRS

### 2.1 产品定位

- **一句话**：在笔记里直接造卡、直接复习的「学习操作系统」。
- **目标用户**：大学生、考研/考证、需要 PDF 标注 + 大量记忆的学生。
- **价值主张**：**卡片与笔记同一对象**——上下文不丢；FSRS/SM-2；Exam Scheduler；AI 生卡（可编辑）。
- **边界**：比 Anki 更易上手，但仍比 Quizlet 重；All-in-one 带来学习曲线。

### 2.2 核心业务场景

1. **上课/读书**：在 Outline 笔记里写内容，用 `Question == Answer` 语法即时造卡。
2. **PDF 阅读**：标注 PDF → 从标注生成闪卡。
3. **每日练习**：Flashcard Home → Practice Today's Cards（全局队列）。
4. **考前冲刺**：设 Exam Date → Exam Scheduler 压缩/优先调度。
5. **从 Anki 迁移**：导入 Deck 并保留复习历史。

### 2.3 关键功能 Feature

| 功能 | 说明 |
|------|------|
| 嵌入式闪卡 | 笔记行内 `==` 造卡；多行卡、Cloze、图片遮挡 |
| 全局练习队列 | 跨文档聚合「今日该练」；按优先级/文件夹加权 |
| 算法 | FSRS + SM-2 可选 |
| Exam Scheduler | 按考试日期反推每日练习量 |
| Card Table | 数千张卡的可视化管理、批量编辑 |
| AI | 从笔记/PDF/文本生成卡（强调可编辑） |
| Daily Learning Goal | 每日练 N 张的习惯目标 |

### 2.4 用户操作步骤与流程

**记笔记 + 造卡**

```
新建 Document → 写大纲/正文
→ 输入「问题 == 答案」→ 自动变为闪卡
→（可选）PDF Reader 里选中 → 生成卡
→ 卡片与原文同屏，更新笔记即更新上下文
```

**每日复习**

```
打开 App → Flashcard Home →「Practice Today's Cards」
→ 进入全局队列（跨所有文档，按 urgency 排序）
→ 翻面 → 评分（影响 FSRS/SM-2）
→ 完成 Daily Learning Goal（若开启）
```

**优先级与考试**

```
给 Document/Folder 设 Priority（考试临近调高）
→ 设 Exam Date → Exam Scheduler 调整每日队列
```

**流程特点**

- **记录与复习不切换 App**，但 UI 上仍有「笔记模式 / 练习模式」的上下文切换。
- **全局队列** 优于「按 Deck 手动选」，减轻用户决策负担。

### 2.5 UI 样式与设计方法

**视觉**

- 现代 SaaS：白/浅灰、清晰 sidebar、文档树 + 编辑器 + 闪卡面板。
- 信息层级清楚：Outline、Property、Flashcard 状态有明确分区。

**设计理念**

1. **Context-preserving recall**：复习时能看到卡片来源笔记——理解优先于死记硬背。
2. **One queue to rule them all**：用户不应自己决定「今天复习哪个 Deck」。
3. **Progressive power**：免费可用核心；Card Table、Exam Scheduler 等面向重度用户。
4. **AI 辅助而非替代**：生卡后必须可编辑，强调 atomic cards。

**可借鉴**

- **今日全局练习队列** 的产品概念（青芽「今日复习 Tab」与此同构）。  
- **到期优先 / 进度目标** 的轻量版（不必做 Exam Scheduler）。  
- 编辑器与复习 **信息层级分离**，但数据一体。

**刻意不学**

- 大纲编辑器复杂度、PDF Reader、知识图谱级功能。

---

## 3. flomo 浮墨笔记

**官网**：https://flomoapp.com · **类型**：卡片式碎片记录 + 回顾

### 3.1 产品定位

- **一句话**：**只给自己看的微博**——记录想法的川流，而非整理文档。
- **目标用户**：知识工作者、需要低摩擦捕捉灵感的人；中文用户为主。
- **价值主张**：持续记录 → 意义自然浮现；**拒绝 All-in-one**。
- **边界**：不做双向链接图谱、不做复杂排版、不做 Markdown 编辑器；支持图片但不做图文混排编辑器。

### 3.2 核心业务场景

1. **即时捕捉**：微信/APP/网页/快捷指令 → 一条 MEMO。
2. **标签整理**：用标签（含多级）而非文件夹分类。
3. **回顾**：每日回顾、随机漫步、相关笔记、认知地图、热力图式统计。
4. **连接**：批注式链接 MEMO；API 导入微信读书等。

### 3.3 关键功能 Feature

| 功能 | 说明 |
|------|------|
| 类聊天输入框 | 无标题、无排版压力；Enter 发布 |
| 全平台同步 | 免费同步，无条数限制（核心承诺） |
| 标签体系 | 多级标签 + 搜索 |
| 回顾 | 每日回顾、随机漫步、相关笔记、笔记关系图 |
| 统计 | 多维度记录统计（类 GitHub 贡献墙） |
| AI | Agent、洞察、MCP（近年扩展） |
| API | 对接快捷指令、Alfred、第三方 |

### 3.4 用户操作步骤与流程

**记录（核心）**

```
打开 flomo → 底部/顶部输入框（类 IM）
→ 输入短文本（可选 #标签）→ Shift+Enter 或按钮发布
→ 即时保存，列表顶部出现新 MEMO
→（可选）粘贴/上传图片，与文字在同一条
```

**回顾**

```
侧边栏 → 每日回顾 / 随机漫步
→ 系统按规则推送历史 MEMO
→ 用户阅读、打标签、建立连接
→ 统计页查看积累（贡献墙式）
```

**设计刻意省略的步骤**

- 无「选择文件夹」、无「选模板」、无「保存按钮焦虑」（自动保存）。

### 3.5 UI 样式与设计方法

**官方设计哲学**（[flomo 101 · 设计哲学](https://help.flomoapp.com/about-us/about-us/design-concept.html)）

1. 拒绝做完美产品，聚焦用户价值核心。  
2. **尽量少地设计**，让一切「自然而然」发生。  
3. **尽量少的颜色、个性、奇怪排版**——符合习惯即可。  
4. **尽量少 ego**——做安静的容器，不扭曲用户欲望。  
5. **复用性**——韵律与重复（如树叶），降低开发与认知成本。

**视觉**

- 极简：白/浅灰、单列 MEMO 流、小字号标签。
- 输入框是视觉焦点；列表为时间倒序卡片。

**可借鉴（对青芽记卡页）**

- **类聊天输入** 的心智：无标题、短内容、即时保存反馈。  
- **贡献墙式热力图** 做「佛系坚持」（青芽功能三同构）。  
- **自动保存 / 返回即保存** 的轻反馈，减少「点保存」焦虑。

**刻意不学**

- 极端拒绝排版（青芽仍需正反面 + 图片）。  
- 完全无结构（青芽需要 SM-2 调度结构）。

---

## 4. Capacities

**官网**：https://capacities.io · **类型**：对象式个人知识管理（PKM）

### 4.1 产品定位

- **一句话**：**A studio for your mind**——用「对象」而非文件夹组织知识。
- **目标用户**：个人知识工作者；偏欧美；重视 calm、offline、mobile-native。
- **价值主张**：Daily note 作 inbox；对象网络（人/书/项目/会议）；**少配置、强默认**。
- **边界**：不做团队协作；不做插件生态；明确 personal-first。

### 4.2 核心业务场景

1. **Daily note 捕捉**：每天一页，随手写，不强制分类。
2. **对象化整理**：把 daily 里的线头转为 Person / Book / Project 等对象。
3. **网络浏览**：双向链接、backlinks、图谱、Related Content。
4. **多视图检索**：同一对象类型切换 List / Gallery / Table / Card view。

### 4.3 关键功能 Feature

| 功能 | 说明 |
|------|------|
| Object Types | Page、Daily Note、Weblink + 自定义类型 |
| Properties | 日期、评分、标签、关系等 schema |
| Calendar | 日历 + 每日笔记入口 |
| Daily Note | 当日 inbox / scratchpad |
| Graph & Backlinks | 网络可视化与反向链接 |
| Offline | 本地优先同步 |
| 输入集成 | WhatsApp/Telegram/Email 写入 daily note |

### 4.4 用户操作步骤与流程

**典型一日**

```
打开 Capacities → 自动进入/打开 Today Daily Note
→ 自由书写、贴链接、@提到对象
→ 选中一行 → 转为 Meeting / Task / Project 对象
→ 在 Object 页面查看 backlinks 与相关对象
→ Calendar 跳转回顾往日 daily notes
```

**对象创建**

```
Sidebar 选 Object Type → New
→ 填 Properties + 正文块
→ @{对象名} 建立链接 → 自动生成双向关联
```

**流程特点**

- **Capture 与 Organize 分阶段**：先写进 daily，再对象化——降低记录摩擦。
- **Where useful, not where filed**：减少「该放哪个文件夹」的决策 fatigue。

### 4.5 UI 样式与设计方法

**视觉**

- Calm、留白、柔和中性色；对象类型可有 subtle 色彩编码。
- Sidebar（类型 + Calendar）+ 主内容区；移动端 native 感强。

**产品原则**（创始人访谈与文档）

- **Opinionated defaults**：强大但预设好，避免插件兔子洞。  
- **Coherence over toggles**：功能深度集成，而非开关堆砌。  
- **Personal-first**：不为团队功能牺牲个人体验。

**可借鉴**

- **Daily note 作为脊柱** 的信息架构（青芽可用「今日复习」作首页脊柱）。  
- **冷静默认 UI**、少装饰、内容块清晰。  
- **Capture 时零结构，Review 时再结构化** 的两阶段模型。

**刻意不学**

- 对象类型系统、图谱、多视图——超出青芽 MVP。

---

## 5. Quizlet

**官网**：https://quizlet.com · **类型**：大众闪卡 + 多种学习模式

### 5.1 产品定位

- **一句话**：**让学习变得可上手** 的闪卡平台——社交内容 + 游戏化练习。
- **目标用户**：K12、本科、语言初学者；教师建 Class 分发。
- **价值主张**：快速建 set、多种 mode、庞大 UGC 牌库、Class 协作。
- **边界**：SRS 不如 Anki 深；偏短期备考与课堂场景。

### 5.2 核心业务场景

1. **建 Set**：术语 + 定义（可含图）；Class / Folder 组织。
2. **选模式开练**：Flashcards、Learn、Write、Test、Match、Gravity 等。
3. **课堂**：教师建 Class，学生加入，只看分配的 set。
4. **分享**：链接、Google Classroom、Teams 分发。

### 5.3 关键功能 Feature

| 功能 | 说明 |
|------|------|
| Study Set | Term / Definition（+ Diagram 第三点） |
| 学习模式 | Flashcards、Learn（自适应）、Write、Spell、Test、Match、Gravity |
| Class | 类似文件夹 + 成员管理 |
| 模式统一壳 | 各 mode 共享 sidebar、进度、选项组件（ redesign 重点） |
| 星级 | 标记需加强的词条 |
| 音频 | 听读模式 |

### 5.4 用户操作步骤与流程

**建库并学习**

```
Create Set → 添加 term/definition（可导入）
→ 进入 Set 页 → 选择 Study 区模式（Flashcards / Learn / …）
→ [Flashcards] 看 term → 点击翻转 definition →（可选）Star
→ [Learn] 自适应提问 → 多题型 → 进度条推进 mastery
→ 完成 session → 看到 progress / 鼓励继续
```

**Set 页信息架构（ redesign 后）**

- Study 与 Play 分区；模式按钮 **更大、更醒目**（A/B 提升 21% 转化）。  
- 各 mode **统一 sidebar + progress**，切换 mode 无需重新 orient。  
- 移动端：横向滚动 mode 按钮 → 小屏垂直堆叠。

### 5.5 UI 样式与设计方法

**视觉**

- 明亮、友好、每 mode 有 **专属色**；吉祥物（宇航员）降低冷感。
- 大按钮、卡片式 set 列表；游戏 mode 动效更强。

**设计理念**

1. **Mode consistency**：同一学习任务在不同 mode 下 **壳一致**，降低切换成本。  
2. **CTA to study**：Set 页的首要目标是 **把用户送进 study**，而非浏览 metadata。  
3. **Responsive patterns**：横向 scroll 区、stack 布局适配手机。  
4. **Progress visibility**：进度条、mastery 百分比给予持续反馈。

**可借鉴**

- Set/Deck 页 **大 CTA「开始复习」** 模式（青芽 Review 首页）。  
- **模式/会话壳统一**（复习页一套、库页一套）。  
- **Star / 标记难卡** 的轻量交互（可与 Again 队列呼应）。

**刻意不学**

- 游戏化 Play modes、社交 UGC 复杂度、多 mode 分散专注。

---

## 6. Skola（开源）

**官网**：https://skola.cards · **GitHub**：https://github.com/h16nning/skola

### 6.1 产品定位

- **一句话**：**Local-first、开源、设计优先** 的现代 SRS PWA。
- **目标用户**：重视隐私、审美、离线；不愿付 Anki iOS 费或忍受 Anki UI 的学习者。
- **价值主张**：FSRS + 实体索引卡美学 + 无账号 + PWA 安装。
- **边界**：早期产品；**故意不做 AI 生卡**——造卡即学习。

### 6.2 核心业务场景

1. **本地建 Deck**：浏览器内创建卡片组。
2. **Today 复习**：今日到期队列。
3. **离线使用**：PWA 安装，IndexedDB 存数据。

### 6.3 关键功能 Feature

| 功能 | 说明 |
|------|------|
| Local-first | IndexedDB，无服务器账号 |
| FSRS | 现代调度算法 |
| PWA | 可安装、离线 |
| 物性设计 | Deck 像真实索引卡，texture + physicality |
| 无 AI 生卡 | 强调手动造卡的学习价值 |

### 6.4 用户操作步骤与流程（推断 + README）

```
打开 skola.cards → Today 区显示到期卡
→ 选择 Deck / 开始 Review
→ 卡片全屏或舞台化呈现 → 翻面 → 评分
→ FSRS 更新 → 下一张
→（本地）Deck 管理、编辑卡
```

### 6.5 UI 样式与设计方法

**视觉**

- Custom design system；**minimal but tactile**（纹理、卡片物理感）。
- 与 Anki 对比：**同样 SRS，但 UI 奖励学习过程**。

**设计理念**

1. **Open + beautiful 可以兼得**。  
2. **Local-first = 信任与速度**。  
3. **Physical index card metaphor**——一张卡一件事。  
4. **Anti-AI-slop**：不绕过造卡过程。

**可借鉴**

- **索引卡物性** 作为唯一签名元素（而非满屏装饰）。  
- **Today-first** 导航。  
- PWA / 移动优先（青芽已 mobile-first）。

---

## 7. Brainscape

**官网**：https://www.brainscape.com · **类型**：CBR（Confidence-Based Repetition）闪卡

### 7.1 产品定位

- **一句话**：用 **1–5 信心评分** 驱动间隔重复的「更高效记忆」。
- **目标用户**：备考、职业认证、语言；偏美国市场。
- **价值主张**：比二元「对/错」更细；Mastery 可视化；UGC + 官方牌库。
- **边界**：闭源；Pro 功能（重置 confidence 等）。

### 7.2 核心业务场景

1. **选 Class/Deck → Study**。
2. **Study Mix**：按百分比混合多 deck。
3. **CBR 复习**：看题 → 想 → 翻转 → 1–5 评分。
4. **追踪 Mastery**：Deck/Class 级掌握度百分比。

### 7.3 关键功能 Feature

| 功能 | 说明 |
|------|------|
| CBR 算法 | 1–5 信心分 → 个性化间隔 |
| Mastery | 加权平均信心，0–100% |
| Study Mix | 多 deck 按比例混合 |
| Preview/Browse | 不触发 SRS 的浏览模式 |
| 升级动画 | 信心分提升时「+1 poof」动效 |
| 诚实评分引导 | 明确「不要轻易打 5 分」 |

### 7.4 用户操作步骤与流程

```
Dashboard / Class → Study
→ 显示问题面
→ 用户脑中作答（Active Recall）
→ 翻转看答案
→ **必须** 选择 1–5 信心（否则无法下一张）
→ 算法决定下次出现时间
→（若信心提升）播放升级动画
→ 下一张，直到 session 结束
```

**评分语义（用户心智）**

| 分 | 含义 | 大致间隔 |
|----|------|----------|
| 1 | 完全不会 | 几分钟 |
| 2 | 勉强 | 10+ 分钟 |
| 3 | 一般 | 数小时 |
| 4 | 较好 | 数天 |
| 5 | 完全掌握 | 数周/月 |

### 7.5 UI 样式与设计方法

**视觉**

- 清晰、教育产品风；卡片大、评分按钮 prominent。
- **Confidence 升级动画** 提供正向反馈但不游戏化到失控。

**认知设计**（官方 Academy 文档）

1. **Forced metacognition**：必须自评才能继续 → 加深记忆 + 诚实调度。  
2. **Celebrate upgrades**：只庆祝「比上次更好」，而非绝对分数。  
3. **Mastery 是衍生指标**，不应为刷 100% 而滥打 5 分。

**可借鉴**

- **评分后才能下一张** 的强制节奏（青芽已有类似）。  
- **升级反馈** 可做成极简版（Good/Easy 时 subtle 动画）。  
- **Mastery / 今日进度** 与 **佛系热力图** 分工：前者会话内，后者长期。

**刻意不学**

- 5 分制（青芽已选 SM-2 四档）；Mastery 百分比施压。

---

## 8. 横向对比总表

| 维度 | Anki | RemNote | flomo | Capacities | Quizlet | Skola | Brainscape |
|------|------|---------|-------|------------|---------|-------|------------|
| 核心定位 | SRS 引擎 | 笔记+SRS | 想法流 | 对象 PKM | 大众闪卡 | 开源 SRS | CBR 闪卡 |
| 记录摩擦 | 高 | 中 | **极低** | 低 | 低 | 中 | 低（用现成库） |
| 复习沉浸 | **高** | 中高 | 低（回顾） | 低 | 中 | 高 | 高 |
| 调度 | SM-2/FSRS | FSRS/SM-2 | 无 | 无 | 弱/专有 | FSRS | CBR |
| 坚持激励 | 统计/Streak 插件 | Daily Goal | **贡献墙** | Calendar | Mastery | Today | Mastery |
| UI 气质 | 功能主义 | 现代 SaaS | **极简容器** | Calm PKM | 友好明亮 | 物性 minimal | 教育清晰 |
| 最适合青芽学的点 | 复习会话 | 全局今日队列 | 输入+热力图 | Daily 脊柱 | Study CTA | 卡片物性 | 评分节奏 |

---

## 9. 对青芽的综合设计启示

### 9.1 产品组合公式（再次确认）

```
青芽 ≈ flomo（记） × Anki/Skola（复习会话） × flomo/GitHub（坚持可见）
```

不应在 **同一屏** 同时表达三种模式；应 **壳层切换**：

- **Shell**：Brand 轻量 + Tab + 列表/编辑器  
- **Session**：复习全屏，隐藏 Tab，仅进度 + 卡 + 评分  

### 9.2 各页应对标的「标杆交互」

| 青芽页面 | 对标 | 关键交互 |
|----------|------|----------|
| 记卡 | flomo + RemNote | 单面聚焦输入；即时保存；标签轻量 |
| 复习 | Anki + Skola | 问题独占 → 揭晓 → 四档；隐藏底栏 |
| 卡片库 | RemNote Card Table 简化版 | 摘要行 + 到期分区 + 点开详情 |
| 坚持 | flomo 统计 + GitHub 墙 | 热力图主角；数字克制；零操作记账 |

### 9.3 UI 设计原则（竞品共识提炼）

1. **一屏一事**（flomo、Anki Study、Capacities daily）  
2. **摩擦分层**：记易、复习难、激励自动（三家共识）  
3. **容器少 ego**（flomo）——品牌退后，内容向前  
4. **会话壳一致**（Quizlet mode redesign）——同一任务同一套进度/操作区  
5. **签名元素唯一**（Skola 物性卡）——一个隐喻用到底，不要颗粒+错位+阴影全开  
6. **诚实反馈**（Brainscape、Anki）——评分驱动调度，不游戏化刷分  
7. **Today-first**（RemNote、Skola、Capacities）——打开知道「今天要做什么」

### 9.4 建议青芽下一阶段 UX 规格（讨论用，未实施）

1. **Review Session Mode**：`display: none` 底栏 + 全屏 Stage + sticky 评分条（≥64px）。  
2. **Capture Focus Mode**：正/背 Segment + 全屏 textarea + 底部工具条。  
3. **Library Rows**：到期区 + 一行摘要 + expand。  
4. **Streak**：热力图首屏；「已复习 N 天」一行即可。

---

## 10. 参考资料

| 产品 | 链接 |
|------|------|
| Anki Manual | https://docs.ankiweb.net |
| RemNote Help · SRS | https://help.remnote.com/en/articles/6022755-getting-started-with-spaced-repetition |
| flomo 设计哲学 | https://help.flomoapp.com/about-us/about-us/design-concept.html |
| flomo 101 | https://help.flomoapp.com |
| Capacities Docs · Daily notes | https://docs.capacities.io/reference/use-cases/daily-notes |
| Capacities Product | https://capacities.io/product |
| Quizlet Redesign (Medium) | https://medium.com/tech-quizlet/launching-a-successful-redesign-for-20-million-students-2f4c4b518b6e |
| Skola GitHub | https://github.com/h16nning/skola |
| Brainscape · CBR | https://www.brainscape.com/academy/confidence-based-repetition-definition/ |
| Brainscape Help · Study | https://brainscape.zendesk.com/hc/en-us/articles/17773783760141 |

---

*本文档供青芽产品与 UI 讨论使用；竞品功能以调研日公开信息为准，后续迭代可能变化。*
