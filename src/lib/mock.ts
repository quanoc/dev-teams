import type {
  Task, Agent, Activity, DoraMetrics, Member,
  Stage, Message, Artifact
} from '@/types'

// ─── Members ──────────────────────────────────────────────────────────────

export const MEMBERS: Member[] = [
  { id: 'm1', name: '张敏',  initials: '张', color: 'bg-violet-500' },
  { id: 'm2', name: '王磊',  initials: '王', color: 'bg-blue-500'   },
  { id: 'm3', name: '李红',  initials: '李', color: 'bg-teal-500'   },
  { id: 'm4', name: '陈刚',  initials: '陈', color: 'bg-amber-500'  },
  { id: 'm5', name: '刘洋',  initials: '刘', color: 'bg-rose-500'   },
]

// ─── Tasks ────────────────────────────────────────────────────────────────

export const MOCK_TASKS: Task[] = [
  // ── 1. 大型需求·进行中·需求分析阶段
  {
    id: 't1',
    title: '用户系统 v2 重构',
    description: '将现有用户系统迁移到新的微服务架构，支持多租户和 SSO。',
    type: 'requirement',
    size: 'large',
    priority: 'high',
    status: 'active',
    currentStage: 'requirement',
    assignee: MEMBERS[0],
    createdAt: '2026-03-20T09:00:00Z',
    updatedAt: '2026-03-22T10:30:00Z',
    durationEstimateMin: 7 * 24 * 60,
    durationElapsedMin: 30 * 60,
    tags: ['微服务', 'SSO', '多租户'],
    stages: [
      { key: 'requirement', label: '需求分析', status: 'active',  agentId: 'requirement', startedAt: '2026-03-22T09:00:00Z' },
      { key: 'design',      label: '方案设计', status: 'pending', agentId: 'architecture' },
      { key: 'development', label: '代码开发', status: 'pending', agentId: 'code' },
      { key: 'review',      label: 'Code Review', status: 'pending', agentId: 'review' },
      { key: 'testing',     label: '测试验证', status: 'pending', agentId: 'test' },
      { key: 'deployment',  label: '发布上线', status: 'pending', agentId: 'deploy' },
    ],
    messages: [
      { id: 'msg1', taskId: 't1', sender: 'agent', agentId: 'main', senderName: '主 Agent', content: '已收到任务，判断为大型需求，将激活完整 6 阶段流程。正在启动需求 Agent 进行结构化分析。', createdAt: '2026-03-22T09:00:00Z', stage: 'requirement' },
      { id: 'msg2', taskId: 't1', sender: 'agent', agentId: 'requirement', senderName: '需求 Agent', content: '开始分析需求文档，已识别到 4 个核心用户故事，预计拆解为 12 个子任务。', createdAt: '2026-03-22T09:15:00Z', stage: 'requirement' },
      { id: 'msg3', taskId: 't1', sender: 'human', senderName: '张敏', content: '注意 SSO 部分要兼容现有的 LDAP 系统，上次踩过坑。', createdAt: '2026-03-22T10:00:00Z', stage: 'requirement' },
      { id: 'msg4', taskId: 't1', sender: 'agent', agentId: 'requirement', senderName: '需求 Agent', content: '已记录 LDAP 兼容性约束，将在验收标准中明确列出。需求文档草稿准备完毕，请 PM 评审。', createdAt: '2026-03-22T10:28:00Z', stage: 'requirement' },
    ],
    artifacts: [
      { id: 'a1', name: '需求草稿.md', type: 'document', stage: 'requirement', createdAt: '2026-03-22T10:28:00Z', size: '24 KB' },
    ],
  },

  // ── 2. 中型需求·Review 阶段·待介入
  {
    id: 't2',
    title: '支付模块重构',
    description: '将支付逻辑从主服务抽离，独立为支付微服务，支持多渠道支付。',
    type: 'feature',
    size: 'medium',
    priority: 'high',
    status: 'waiting',
    currentStage: 'review',
    assignee: MEMBERS[2],
    createdAt: '2026-03-19T14:00:00Z',
    updatedAt: '2026-03-22T09:45:00Z',
    durationEstimateMin: 3 * 24 * 60,
    durationElapsedMin: 2 * 24 * 60 + 3 * 60,
    tags: ['支付', '微服务'],
    stages: [
      { key: 'requirement', label: '需求分析', status: 'done', agentId: 'requirement', startedAt: '2026-03-19T14:00:00Z', completedAt: '2026-03-19T16:00:00Z' },
      { key: 'design',      label: '方案设计', status: 'skipped', agentId: 'architecture' },
      { key: 'development', label: '代码开发', status: 'done', agentId: 'code', startedAt: '2026-03-20T09:00:00Z', completedAt: '2026-03-22T08:00:00Z' },
      { key: 'review',      label: 'Code Review', status: 'active', agentId: 'review', startedAt: '2026-03-22T08:00:00Z' },
      { key: 'testing',     label: '测试验证', status: 'pending', agentId: 'test' },
      { key: 'deployment',  label: '发布上线', status: 'pending', agentId: 'deploy' },
    ],
    messages: [
      { id: 'msg5', taskId: 't2', sender: 'agent', agentId: 'review', senderName: 'Review Agent', content: '首轮代码扫描完成。发现 2 个安全隐患需要处理：SQL 注入风险（line 142）和未校验用户权限（line 287）。另有 3 项代码规范建议。', createdAt: '2026-03-22T09:20:00Z', stage: 'review' },
      { id: 'msg6', taskId: 't2', sender: 'agent', agentId: 'main', senderName: '主 Agent', content: '检测到安全级别问题，已暂停自动流转，需要高级开发人工审批。', createdAt: '2026-03-22T09:21:00Z', stage: 'review' },
      { id: 'msg7', taskId: 't2', sender: 'human', senderName: '李红', content: 'SQL 注入那个我已经看了，是参数化查询没用到。权限那个需要再确认一下业务逻辑。', createdAt: '2026-03-22T09:45:00Z', stage: 'review' },
    ],
    artifacts: [
      { id: 'a2', name: 'payment-service.ts', type: 'code', stage: 'development', createdAt: '2026-03-22T08:00:00Z', size: '18 KB' },
      { id: 'a3', name: 'payment.test.ts', type: 'code', stage: 'development', createdAt: '2026-03-22T08:00:00Z', size: '8 KB' },
      { id: 'a4', name: 'review-report.md', type: 'report', stage: 'review', createdAt: '2026-03-22T09:20:00Z', size: '12 KB' },
    ],
  },

  // ── 3. 小任务·Bug·代码开发·超时
  {
    id: 't3',
    title: '登录超时 Bug 修复',
    description: '用户反馈在特定网络环境下登录会话在 15 分钟后被强制下线，与预期 2 小时不符。',
    type: 'bug',
    size: 'small',
    priority: 'critical',
    status: 'active',
    currentStage: 'development',
    assignee: MEMBERS[1],
    createdAt: '2026-03-22T07:00:00Z',
    updatedAt: '2026-03-22T10:00:00Z',
    durationEstimateMin: 120,
    durationElapsedMin: 190,  // 超时
    blockedReason: '代码 Agent 等待开发者提供复现步骤',
    tags: ['登录', 'session'],
    stages: [
      { key: 'requirement', label: '需求分析', status: 'skipped', agentId: 'requirement' },
      { key: 'design',      label: '方案设计', status: 'skipped', agentId: 'architecture' },
      { key: 'development', label: '代码开发', status: 'active', agentId: 'code', startedAt: '2026-03-22T07:00:00Z', blockedReason: '等待复现步骤' },
      { key: 'review',      label: 'Code Review', status: 'pending', agentId: 'review' },
      { key: 'testing',     label: '测试验证', status: 'pending', agentId: 'test' },
      { key: 'deployment',  label: '发布上线', status: 'pending', agentId: 'deploy' },
    ],
    messages: [
      { id: 'msg8', taskId: 't3', sender: 'agent', agentId: 'code', senderName: '代码 Agent', content: '已定位到 session.middleware.ts 中的 maxAge 配置，但发现该值受环境变量影响，需要确认生产环境的具体配置。', createdAt: '2026-03-22T07:30:00Z', stage: 'development' },
      { id: 'msg9', taskId: 't3', sender: 'agent', agentId: 'code', senderName: '代码 Agent', content: '请提供具体的复现步骤和网络环境信息，以便精准定位问题。', createdAt: '2026-03-22T08:00:00Z', stage: 'development' },
      { id: 'msg10', taskId: 't3', sender: 'human', senderName: '王磊', content: '复现：用 4G 网络登录，切换到 WiFi 后等 15 分钟就会掉线。VPN 环境下正常。', createdAt: '2026-03-22T10:00:00Z', stage: 'development' },
    ],
    artifacts: [],
  },

  // ── 4. 大型需求·测试阶段·正常
  {
    id: 't4',
    title: '数据看板 v3',
    description: '新版数据可视化看板，支持自定义图表、实时数据流和多维度筛选。',
    type: 'feature',
    size: 'large',
    priority: 'medium',
    status: 'active',
    currentStage: 'testing',
    assignee: MEMBERS[3],
    createdAt: '2026-03-15T09:00:00Z',
    updatedAt: '2026-03-22T08:00:00Z',
    durationEstimateMin: 10 * 24 * 60,
    durationElapsedMin: 7 * 24 * 60,
    tags: ['可视化', '实时数据'],
    stages: [
      { key: 'requirement', label: '需求分析', status: 'done', agentId: 'requirement', startedAt: '2026-03-15T09:00:00Z', completedAt: '2026-03-16T17:00:00Z' },
      { key: 'design',      label: '方案设计', status: 'done', agentId: 'architecture', startedAt: '2026-03-17T09:00:00Z', completedAt: '2026-03-18T17:00:00Z' },
      { key: 'development', label: '代码开发', status: 'done', agentId: 'code', startedAt: '2026-03-19T09:00:00Z', completedAt: '2026-03-21T17:00:00Z' },
      { key: 'review',      label: 'Code Review', status: 'done', agentId: 'review', startedAt: '2026-03-21T17:00:00Z', completedAt: '2026-03-22T07:00:00Z' },
      { key: 'testing',     label: '测试验证', status: 'active', agentId: 'test', startedAt: '2026-03-22T08:00:00Z' },
      { key: 'deployment',  label: '发布上线', status: 'pending', agentId: 'deploy' },
    ],
    messages: [
      { id: 'msg11', taskId: 't4', sender: 'agent', agentId: 'test', senderName: '测试 Agent', content: '单元测试覆盖率 87%，集成测试正在运行中。发现 2 个边界条件 Bug，已记录。', createdAt: '2026-03-22T09:00:00Z', stage: 'testing' },
      { id: 'msg12', taskId: 't4', sender: 'agent', agentId: 'test', senderName: '测试 Agent', content: '性能测试：1000 并发下 P99 响应时间 340ms，达标（阈值 500ms）。', createdAt: '2026-03-22T10:00:00Z', stage: 'testing' },
    ],
    artifacts: [
      { id: 'a5', name: '需求文档.md', type: 'document', stage: 'requirement', createdAt: '2026-03-16T17:00:00Z', size: '32 KB' },
      { id: 'a6', name: '技术方案.md', type: 'document', stage: 'design', createdAt: '2026-03-18T17:00:00Z', size: '28 KB' },
      { id: 'a7', name: 'dashboard-v3.tsx', type: 'code', stage: 'development', createdAt: '2026-03-21T17:00:00Z', size: '45 KB' },
      { id: 'a8', name: 'review-report.md', type: 'report', stage: 'review', createdAt: '2026-03-22T07:00:00Z', size: '9 KB' },
      { id: 'a9', name: 'test-report.md', type: 'report', stage: 'testing', createdAt: '2026-03-22T10:00:00Z', size: '15 KB' },
    ],
  },

  // ── 5. 小任务·已完成
  {
    id: 't5',
    title: '修复导航栏移动端样式',
    description: '移动端 320px 宽度下导航栏文字溢出，需要截断处理。',
    type: 'bug',
    size: 'small',
    priority: 'low',
    status: 'done',
    currentStage: 'deployment',
    assignee: MEMBERS[4],
    createdAt: '2026-03-21T15:00:00Z',
    updatedAt: '2026-03-22T09:00:00Z',
    durationEstimateMin: 60,
    durationElapsedMin: 55,
    tags: ['移动端', 'CSS'],
    stages: [
      { key: 'requirement', label: '需求分析', status: 'skipped', agentId: 'requirement' },
      { key: 'design',      label: '方案设计', status: 'skipped', agentId: 'architecture' },
      { key: 'development', label: '代码开发', status: 'done', agentId: 'code', startedAt: '2026-03-21T15:00:00Z', completedAt: '2026-03-21T16:30:00Z' },
      { key: 'review',      label: 'Code Review', status: 'done', agentId: 'review', startedAt: '2026-03-21T16:30:00Z', completedAt: '2026-03-21T17:30:00Z' },
      { key: 'testing',     label: '测试验证', status: 'done', agentId: 'test', startedAt: '2026-03-21T17:30:00Z', completedAt: '2026-03-22T08:00:00Z' },
      { key: 'deployment',  label: '发布上线', status: 'done', agentId: 'deploy', startedAt: '2026-03-22T08:00:00Z', completedAt: '2026-03-22T09:00:00Z' },
    ],
    messages: [],
    artifacts: [
      { id: 'a10', name: 'nav-fix.css', type: 'code', stage: 'development', createdAt: '2026-03-21T16:30:00Z', size: '2 KB' },
    ],
  },

  // ── 6. 技术债·被阻塞
  {
    id: 't6',
    title: 'Redis 缓存层升级',
    description: '将 Redis 4.x 升级至 7.x，启用 ACL 和新的持久化策略。',
    type: 'tech-debt',
    size: 'medium',
    priority: 'medium',
    status: 'blocked',
    currentStage: 'design',
    assignee: MEMBERS[1],
    createdAt: '2026-03-18T09:00:00Z',
    updatedAt: '2026-03-21T17:00:00Z',
    durationEstimateMin: 2 * 24 * 60,
    durationElapsedMin: 4 * 24 * 60,
    blockedReason: '等待运维提供 Redis 7.x 测试环境',
    tags: ['Redis', '基础设施'],
    stages: [
      { key: 'requirement', label: '需求分析', status: 'done', agentId: 'requirement', startedAt: '2026-03-18T09:00:00Z', completedAt: '2026-03-18T11:00:00Z' },
      { key: 'design',      label: '方案设计', status: 'blocked', agentId: 'architecture', startedAt: '2026-03-18T11:00:00Z', blockedReason: '等待运维提供测试环境' },
      { key: 'development', label: '代码开发', status: 'pending', agentId: 'code' },
      { key: 'review',      label: 'Code Review', status: 'pending', agentId: 'review' },
      { key: 'testing',     label: '测试验证', status: 'pending', agentId: 'test' },
      { key: 'deployment',  label: '发布上线', status: 'pending', agentId: 'deploy' },
    ],
    messages: [
      { id: 'msg13', taskId: 't6', sender: 'agent', agentId: 'architecture', senderName: '架构 Agent', content: '技术方案已完成 80%，但需要在真实 Redis 7.x 环境中验证 AOF 持久化的兼容性，否则方案存在风险。', createdAt: '2026-03-21T17:00:00Z', stage: 'design' },
      { id: 'msg14', taskId: 't6', sender: 'agent', agentId: 'main', senderName: '主 Agent', content: '已标记为阻塞状态，等待外部依赖解除。已通知运维团队。', createdAt: '2026-03-21T17:01:00Z', stage: 'design' },
    ],
    artifacts: [
      { id: 'a11', name: '升级方案草稿.md', type: 'document', stage: 'design', createdAt: '2026-03-21T17:00:00Z', size: '16 KB' },
    ],
  },

  // ── 7. 中型需求·方案设计·正常
  {
    id: 't7',
    title: '消息推送系统',
    description: '实现站内信 + 邮件 + 钉钉的统一消息推送，支持模板和频率控制。',
    type: 'feature',
    size: 'medium',
    priority: 'medium',
    status: 'active',
    currentStage: 'design',
    assignee: MEMBERS[3],
    createdAt: '2026-03-21T09:00:00Z',
    updatedAt: '2026-03-22T10:00:00Z',
    durationEstimateMin: 3 * 24 * 60,
    durationElapsedMin: 1 * 24 * 60 + 4 * 60,
    tags: ['推送', '钉钉'],
    stages: [
      { key: 'requirement', label: '需求分析', status: 'done', agentId: 'requirement', startedAt: '2026-03-21T09:00:00Z', completedAt: '2026-03-21T11:00:00Z' },
      { key: 'design',      label: '方案设计', status: 'active', agentId: 'architecture', startedAt: '2026-03-21T11:00:00Z' },
      { key: 'development', label: '代码开发', status: 'pending', agentId: 'code' },
      { key: 'review',      label: 'Code Review', status: 'pending', agentId: 'review' },
      { key: 'testing',     label: '测试验证', status: 'pending', agentId: 'test' },
      { key: 'deployment',  label: '发布上线', status: 'pending', agentId: 'deploy' },
    ],
    messages: [
      { id: 'msg15', taskId: 't7', sender: 'agent', agentId: 'architecture', senderName: '架构 Agent', content: '方案设计中：推荐使用消息队列（RabbitMQ）解耦发送逻辑，支持重试和频率限制。接口文档草稿已生成。', createdAt: '2026-03-22T10:00:00Z', stage: 'design' },
    ],
    artifacts: [
      { id: 'a12', name: '需求文档.md', type: 'document', stage: 'requirement', createdAt: '2026-03-21T11:00:00Z', size: '18 KB' },
      { id: 'a13', name: '接口文档草稿.md', type: 'document', stage: 'design', createdAt: '2026-03-22T10:00:00Z', size: '12 KB' },
    ],
  },
]

// ─── Agents ───────────────────────────────────────────────────────────────

export const MOCK_AGENTS: Agent[] = [
  { id: 'main', name: '主 Agent', participatesIn: ['requirement','design','development','review','testing','deployment'], status: 'running', currentTaskId: 't1', currentTaskTitle: '调度 4 个任务', todayCompleted: 12, todayProcessedMin: 380, lastActiveAt: new Date().toISOString() },
  { id: 'requirement', name: '需求 Agent', participatesIn: ['requirement'], status: 'analyzing', currentTaskId: 't1', currentTaskTitle: '用户系统 v2 重构', todayCompleted: 3, todayProcessedMin: 210, lastActiveAt: new Date().toISOString() },
  { id: 'architecture', name: '架构 Agent', participatesIn: ['design'], status: 'running', currentTaskId: 't7', currentTaskTitle: '消息推送系统', todayCompleted: 2, todayProcessedMin: 180, lastActiveAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 'code', name: '代码 Agent', participatesIn: ['development'], status: 'running', currentTaskId: 't3', currentTaskTitle: '登录超时 Bug 修复', todayCompleted: 5, todayProcessedMin: 290, lastActiveAt: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: 'review', name: 'Review Agent', participatesIn: ['review'], status: 'waiting', currentTaskId: 't2', currentTaskTitle: '支付模块重构', todayCompleted: 4, todayProcessedMin: 160, lastActiveAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'test', name: '测试 Agent', participatesIn: ['testing'], status: 'running', currentTaskId: 't4', currentTaskTitle: '数据看板 v3', todayCompleted: 6, todayProcessedMin: 240, lastActiveAt: new Date(Date.now() - 1 * 60000).toISOString() },
  { id: 'deploy', name: '发布 Agent', participatesIn: ['deployment'], status: 'idle', todayCompleted: 1, todayProcessedMin: 45, lastActiveAt: new Date(Date.now() - 2 * 3600000).toISOString() },
]

// ─── Activities ───────────────────────────────────────────────────────────

export const MOCK_ACTIVITIES: Activity[] = [
  { id: 'act1', type: 'stage_complete', taskId: 't4', taskTitle: '数据看板 v3', agentId: 'review', actorName: 'Review Agent', content: 'Code Review 通过，进入测试阶段', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'act2', type: 'alert', taskId: 't2', taskTitle: '支付模块重构', agentId: 'review', actorName: 'Review Agent', content: '发现 2 个安全隐患，需要人工审批', createdAt: new Date(Date.now() - 40 * 60000).toISOString() },
  { id: 'act3', type: 'human_action', taskId: 't2', taskTitle: '支付模块重构', actorName: '李红', content: '添加了批注：SQL 注入问题确认', createdAt: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: 'act4', type: 'artifact', taskId: 't1', taskTitle: '用户系统 v2', agentId: 'requirement', actorName: '需求 Agent', content: '生成需求草稿.md，请 PM 评审', createdAt: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 'act5', type: 'stage_complete', taskId: 't5', taskTitle: '修复导航栏移动端样式', agentId: 'deploy', actorName: '发布 Agent', content: '已成功发布到生产环境', createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 'act6', type: 'comment', taskId: 't3', taskTitle: '登录超时 Bug 修复', actorName: '王磊', content: '提供了复现步骤：4G 切 WiFi 后 15 分钟掉线', createdAt: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 'act7', type: 'stage_start', taskId: 't4', taskTitle: '数据看板 v3', agentId: 'test', actorName: '测试 Agent', content: '开始执行测试用例，覆盖率 87%', createdAt: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: 'act8', type: 'artifact', taskId: 't7', taskTitle: '消息推送系统', agentId: 'architecture', actorName: '架构 Agent', content: '生成接口文档草稿', createdAt: new Date(Date.now() - 3 * 60000).toISOString() },
]

// ─── DORA Metrics ─────────────────────────────────────────────────────────

export const MOCK_METRICS: DoraMetrics = {
  deployFrequency: '3.2 次/天',
  leadTimeForChanges: '18 小时',
  changeFailureRate: '4.2%',
  mttr: '28 分钟',
  deployFrequencyTrend: 'up',
  leadTimeTrend: 'down',
  failureRateTrend: 'down',
  mttrTrend: 'stable',
}
