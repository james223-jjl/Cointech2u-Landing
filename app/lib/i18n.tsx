"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// === Supported locales ====================================================
export type LangCode = "en" | "zh-CN" | "zh-TW";
export const DEFAULT_LANG: LangCode = "en";
const STORAGE_KEY = "ct2u-lang";

// === Translation dictionaries =============================================
// Flat key namespaces ("section.subkey") keep usage terse in components.
// English is the source of truth — if a translation is missing for a key in
// zh-CN or zh-TW the lookup falls back to English (see `t()` below).
type Dict = Record<string, string>;

const en: Dict = {
  // Hero
  "hero.badge.new": "NEW",
  "hero.badge.text": "Adaptive execution engine v4 — now in production",
  "hero.title.line1": "Trade intelligence,",
  "hero.title.line2.lead": "not",
  "hero.title.line2.emph": "emotion",
  "hero.subtitle.pre":
    "Stay ahead of every market move with AI-powered precision, real-time analytics, and verified intelligence — built for traders across",
  "hero.subtitle.countries": "100+ countries",
  "hero.subtitle.post": ".",
  "hero.cta.viewLive": "View live performance",
  "hero.experience.title": "Experience Now",
  "hero.experience.getStarted": "Get started",

  // CoreStrengths cards
  "core.card.custody.eyebrow": "Custody",
  "core.card.custody.unit": "yours",
  "core.card.custody.caption": "Funds stay in your exchange. Zero third-party custody.",
  "core.card.ai.eyebrow": "AI engine",
  "core.card.ai.caption": "Adaptive intelligence recalibrates with every volatility regime.",
  "core.card.live2022.eyebrow": "Live since 2022",
  "core.card.live2022.unit": "days",
  "core.card.live2022.caption": "Audited live performance, every metric from production.",
  "core.card.latency.eyebrow": "p95 latency",
  "core.card.latency.unit": "ms",
  "core.card.latency.caption":
    "Across OKX, Bitget, Bybit, Binance — instant execution.",
  "core.card.always.eyebrow": "Always on",
  "core.card.always.caption": "Continuous market coverage. The engine never sleeps.",
  "core.card.discipline.eyebrow": "Discipline",
  "core.card.discipline.caption":
    "Position sizing, drawdown limits, exposure caps — coded, not emotional.",

  // Nav
  "nav.liveTrading": "Live Trading",
  "nav.userResults": "User Results",
  "nav.coreStrengths": "Core Strengths",
  "nav.ourPartners": "Our Partners",
  "nav.news": "News",
  "nav.faq": "FAQ",
  "nav.login": "Log in",
  "nav.signup": "Sign up →",
  "nav.languageLabel": "Language",

  // Common UI
  "common.back": "Back",
  "common.viewAll": "View all",
  "common.viewAllArticles": "View all articles",
  "common.readArticle": "Read article",
  "common.browseAllNews": "Browse all news",
  "common.originalSource": "Original source ↗",
  "common.watchOnYoutube": "Watch on YouTube",
  "common.live": "LIVE",
  "common.experienceNow": "Experience Now",

  // LivePerformance section
  "livePerf.eyebrow": "Live trading",
  "livePerf.title.line1": "Real account.",
  "livePerf.title.line2": "Real performance, in real time.",
  "livePerf.counter.days": "Days",
  "livePerf.counter.hours": "Hours",
  "livePerf.counter.minutes": "Minutes",
  "livePerf.counter.seconds": "Seconds",
  "livePerf.counter.aria": "Live account uptime",
  "livePerf.guard.equity.title": "Equity Guard",
  "livePerf.guard.equity.desc": "Auto-protect your capital and cap maximum drawdown.",
  "livePerf.guard.profit.title": "Profit Guard",
  "livePerf.guard.profit.desc": "Automatically lock in profits as positions grow.",

  // Leaders section
  "leaders.title.line1": "Real traders.",
  "leaders.title.line2": "Real profits.",
  "leaders.lede":
    "Live profit rankings across the CoinTech2u network. Swipe between Today, this Month, and All-Time to see who's ahead.",
  "leaders.tab.today": "Today",
  "leaders.tab.today.sub": "24h profit",
  "leaders.tab.monthly": "Monthly",
  "leaders.tab.monthly.sub": "30d profit",
  "leaders.tab.alltime": "All-Time",
  "leaders.tab.alltime.sub": "Cumulative",
  "leaders.id": "ID",
  "leaders.empty": "Leaderboard data unavailable.",

  // Tutorials step content
  "tut.step1.title": "Register an exchange account",
  "tut.step1.desc":
    "Walk through creating an account with one of our supported exchanges in under three minutes.",
  "tut.step2.title": "Bind Fast API",
  "tut.step2.desc":
    "Generate a read-only API key, paste it in, and we verify scopes — withdrawal access is rejected automatically.",
  "tut.step3.title": "Quick setup",
  "tut.step3.desc":
    "The engine inspects your balance and risk preferences and proposes an initial strategy configuration.",
  "tut.step4.title": "View account performance",
  "tut.step4.desc":
    "Open the analytics dashboard for equity curves, position history, and exportable PnL reports.",
  "tut.nowPlaying": "Now playing",
  "tut.step": "Step",

  // Partner card tags
  "partners.tag.spotFutures": "Spot · Futures",
  "partners.tag.copyFutures": "Copy · Futures",
  "partners.tag.derivatives": "Derivatives",

  // AppDownload platform cards
  "app.platform.ios": "iOS",
  "app.platform.ios.label": "Coming soon",
  "app.platform.ios.sub": "Apple App Store",
  "app.platform.android": "Android",
  "app.platform.android.label": "Click to download",
  "app.platform.android.sub": "Google Play / APK",

  // Contact form
  "contact.field.name": "Name",
  "contact.field.name.placeholder": "Your full name",
  "contact.field.email": "Email",
  "contact.field.email.placeholder": "you@email.com",
  "contact.field.telegram": "Telegram username",
  "contact.field.telegram.placeholder": "@username",
  "contact.field.subject": "Subject",
  "contact.field.subject.placeholder": "What's this about?",
  "contact.field.message": "Message",
  "contact.field.message.placeholder": "Tell us a bit more…",
  "contact.submit": "Send message",
  "contact.submit.success": "✓ Message received",
  "contact.support.heading": "Direct support",
  "contact.support.telegram": "Telegram · @CoinTech2u_Admin",
  "contact.support.chat": "In-app live chat · 24/7",

  // Footer
  "footer.tagline":
    "AI-powered crypto trading infrastructure. Non-custodial by design.",
  "footer.col.product": "Product",
  "footer.col.partners": "Partners",
  "footer.col.resources": "Resources",
  "footer.col.legal": "Legal",
  "footer.link.liveTrading": "Live Trading",
  "footer.link.coreStrengths": "Core Strengths",
  "footer.link.performance": "Performance",
  "footer.link.mobileApp": "Mobile App",
  "footer.link.docs": "Docs",
  "footer.link.api": "API",
  "footer.link.blog": "Blog",
  "footer.link.status": "Status",
  "footer.link.terms": "Terms",
  "footer.link.privacy": "Privacy",
  "footer.link.security": "Security",
  "footer.link.disclosures": "Disclosures",
  "footer.copyright":
    "© 2026 CoinTech2u. Crypto trading involves substantial risk.",
  "footer.statusLine": "v4.2.1 · all systems operational",

  // FAQ Q&A bodies — keyed 1..7 matching the order in faq-data.ts.
  "faq.q1.q": "What is CoinTech2u?",
  "faq.q1.a":
    "CoinTech2u is an AI-powered trading infrastructure that automates crypto futures trading on your behalf. The engine handles market monitoring, entry/exit analysis, and execution — your funds stay in your own exchange account at all times.",
  "faq.q2.q": "Is CoinTech2u safe to use?",
  "faq.q2.a":
    "Yes. CoinTech2u operates on a zero-custody model. Your funds always remain in your own exchange account. API connections are fully encrypted, read-only, and trade-only — withdrawal access is rejected by design.",
  "faq.q3.q": "What makes CoinTech2u different from manual trading?",
  "faq.q3.a":
    "CoinTech2u automates the complex part of trading through AI-driven analytics, real-time market insights, and smart portfolio tracking — all in one dashboard. The engine has been refined over four years of live performance data.",
  "faq.q4.q": "Do I need trading experience to use CoinTech2u?",
  "faq.q4.a":
    "No. CoinTech2u is designed for both beginners and experienced traders. Our AI handles the analysis and strategy execution. You simply observe portfolio performance — no manual trading or constant market monitoring required.",
  "faq.q5.q": "How do I connect my exchange account?",
  "faq.q5.a":
    "Log in to your CoinTech2u account, navigate to Fast API Binding, and follow the on-screen instructions. The process takes less than a minute. Your futures account and trading activity sync automatically in real time.",
  "faq.q6.q": "Can I monitor multiple exchange accounts at once?",
  "faq.q6.a":
    "Yes. CoinTech2u supports binding, managing, and tracking multiple sub-accounts simultaneously — ideal for users who diversify capital across portfolio sizes, coin selection, or risk levels.",
  "faq.q7.q": "Is there customer support if I face issues?",
  "faq.q7.a":
    "Yes. We provide dedicated support through in-app live chat and our official Telegram channel. Our team helps with setup guidance, technical support, and general inquiries.",

  // Article detail page chrome
  "article.back.news": "Back to news",
  "article.back.announcements": "Back to announcements",
  "article.notFound.title": "Article not found",
  "article.notFound.body":
    "This story may have been removed or the link is incorrect.",
  "article.error.title": "Unable to load",
  "article.error.body":
    "We couldn't reach the service right now. Please try again shortly.",

  // Partners section
  "partners.eyebrow": "Official partners",
  "partners.title.line1": "Connected to the world's",
  "partners.title.line2": "leading exchanges.",

  // CoreStrengths section
  "core.eyebrow": "Core strengths",
  "core.title.line1": "AI-driven insights.",
  "core.title.line2": "Smart analysis. Verified results.",

  // Tutorials section
  "tut.eyebrow": "From setup to success",
  "tut.title.line1": "Walkthrough videos.",
  "tut.title.line2": "Setup, end to end.",

  // Leaders section
  "leaders.eyebrow": "Live leaderboard",

  // Insights / News section
  "insights.eyebrow": "Insights, News & Market Updates",
  "insights.title.line1": "Discover trends.",
  "insights.title.line2": "Learn from data. Stay ahead.",
  "insights.lede":
    "Research notes, market briefings, and product updates from the CoinTech2u team.",
  "insights.rail.title": "Latest market updates",
  "insights.announcements.eyebrow": "Latest announcements",

  // AppDownload section
  "app.eyebrow": "Mobile app",
  "app.title.line1": "Trade anywhere,",
  "app.title.line2": "anytime.",

  // FAQ section
  "faq.eyebrow": "FAQ",
  "faq.title.line1": "Questions, answered",
  "faq.title.line2": "plainly.",
  "faq.lede": "Instant answers on strategy, safety, setup, and performance.",

  // Contact section
  "contact.eyebrow": "Contact",
  "contact.title.line1": "Let's connect",
  "contact.title.line2": "and grow together.",
  "contact.lede": "Drop your details — our team will be in touch.",

  // Archive pages
  "arch.news.eyebrow": "News & Market Updates",
  "arch.news.title.line1": "Crypto news,",
  "arch.news.title.line2": "briefed for you.",
  "arch.news.lede":
    "Curated reading — listings, regulation, macro signals, and the trends behind the moves.",
  "arch.ann.eyebrow": "Announcements",
  "arch.ann.title.line1": "Product updates,",
  "arch.ann.title.line2": "straight from the team.",
  "arch.ann.lede":
    "Feature launches, platform releases, and roadmap milestones from CoinTech2u.",
  "arch.empty": "No stories in this category yet.",
};

const zhCN: Dict = {
  // Hero
  "hero.badge.new": "新",
  "hero.badge.text": "自适应执行引擎 v4 — 现已投入生产",
  "hero.title.line1": "交易智能,",
  "hero.title.line2.lead": "而非",
  "hero.title.line2.emph": "情绪",
  "hero.subtitle.pre":
    "凭借 AI 驱动的精准、实时分析与可验证的洞察,在每一次市场波动中保持领先 —— 服务于",
  "hero.subtitle.countries": "100+ 个国家",
  "hero.subtitle.post": "的交易者。",
  "hero.cta.viewLive": "查看实时表现",
  "hero.experience.title": "立即体验",
  "hero.experience.getStarted": "立即开始",

  // CoreStrengths cards
  "core.card.custody.eyebrow": "资金托管",
  "core.card.custody.unit": "归您所有",
  "core.card.custody.caption": "资金留在您的交易所。零第三方托管。",
  "core.card.ai.eyebrow": "AI 引擎",
  "core.card.ai.caption": "自适应智能在每个波动周期中重新校准。",
  "core.card.live2022.eyebrow": "自 2022 年运行",
  "core.card.live2022.unit": "天",
  "core.card.live2022.caption": "经审计的实时表现,每项指标均来自生产。",
  "core.card.latency.eyebrow": "P95 延迟",
  "core.card.latency.unit": "毫秒",
  "core.card.latency.caption": "覆盖 OKX、Bitget、Bybit、Binance —— 即时执行。",
  "core.card.always.eyebrow": "全天候运行",
  "core.card.always.caption": "持续市场覆盖。引擎永不停歇。",
  "core.card.discipline.eyebrow": "纪律性",
  "core.card.discipline.caption":
    "仓位规模、回撤限制、敞口上限 —— 由代码定义,而非情绪。",

  // Nav
  "nav.liveTrading": "实时交易",
  "nav.userResults": "用户成果",
  "nav.coreStrengths": "核心优势",
  "nav.ourPartners": "合作伙伴",
  "nav.news": "新闻",
  "nav.faq": "常见问题",
  "nav.login": "登录",
  "nav.signup": "注册 →",
  "nav.languageLabel": "语言",

  // Common UI
  "common.back": "返回",
  "common.viewAll": "查看全部",
  "common.viewAllArticles": "查看全部文章",
  "common.readArticle": "阅读文章",
  "common.browseAllNews": "浏览所有新闻",
  "common.originalSource": "原文链接 ↗",
  "common.watchOnYoutube": "在 YouTube 观看",
  "common.live": "直播",
  "common.experienceNow": "立即体验",

  // LivePerformance
  "livePerf.eyebrow": "实时交易",
  "livePerf.title.line1": "真实账户。",
  "livePerf.title.line2": "实时真实表现。",
  "livePerf.counter.days": "天",
  "livePerf.counter.hours": "小时",
  "livePerf.counter.minutes": "分钟",
  "livePerf.counter.seconds": "秒",
  "livePerf.counter.aria": "实盘账户运行时间",
  "livePerf.guard.equity.title": "资产保护",
  "livePerf.guard.equity.desc": "自动保护您的资金,设定最大回撤上限。",
  "livePerf.guard.profit.title": "盈利防护",
  "livePerf.guard.profit.desc": "随着仓位增长自动锁定利润。",

  // Leaders
  "leaders.title.line1": "真实交易者。",
  "leaders.title.line2": "真实利润。",
  "leaders.lede":
    "CoinTech2u 网络中的实时利润排行。在今日、本月与全部时间之间滑动查看谁领先。",
  "leaders.tab.today": "今日",
  "leaders.tab.today.sub": "24 小时利润",
  "leaders.tab.monthly": "本月",
  "leaders.tab.monthly.sub": "30 日利润",
  "leaders.tab.alltime": "全部时间",
  "leaders.tab.alltime.sub": "累计",
  "leaders.id": "ID",
  "leaders.empty": "排行榜数据暂时无法显示。",

  // Tutorials
  "tut.step1.title": "注册交易所账户",
  "tut.step1.desc": "三分钟内完成支持的交易所账户注册流程。",
  "tut.step2.title": "绑定 Fast API",
  "tut.step2.desc": "生成只读 API 密钥并粘贴,我们会验证权限范围 —— 自动拒绝提币权限。",
  "tut.step3.title": "快速设置",
  "tut.step3.desc": "引擎将检查您的余额与风险偏好,并提出初始策略配置。",
  "tut.step4.title": "查看账户表现",
  "tut.step4.desc": "打开分析面板查看资产曲线、持仓历史与可导出的盈亏报告。",
  "tut.nowPlaying": "正在播放",
  "tut.step": "步骤",

  // Partner card tags
  "partners.tag.spotFutures": "现货 · 合约",
  "partners.tag.copyFutures": "跟单 · 合约",
  "partners.tag.derivatives": "衍生品",

  // AppDownload platforms
  "app.platform.ios": "iOS",
  "app.platform.ios.label": "即将推出",
  "app.platform.ios.sub": "Apple App Store",
  "app.platform.android": "Android",
  "app.platform.android.label": "点击下载",
  "app.platform.android.sub": "Google Play / APK",

  // Contact form
  "contact.field.name": "姓名",
  "contact.field.name.placeholder": "您的全名",
  "contact.field.email": "邮箱",
  "contact.field.email.placeholder": "you@email.com",
  "contact.field.telegram": "Telegram 账号",
  "contact.field.telegram.placeholder": "@username",
  "contact.field.subject": "主题",
  "contact.field.subject.placeholder": "您想咨询什么?",
  "contact.field.message": "留言",
  "contact.field.message.placeholder": "请告诉我们更多详情…",
  "contact.submit": "发送留言",
  "contact.submit.success": "✓ 已收到您的留言",
  "contact.support.heading": "直接客服",
  "contact.support.telegram": "Telegram · @CoinTech2u_Admin",
  "contact.support.chat": "应用内在线客服 · 全天候",

  // Footer
  "footer.tagline": "AI 驱动的加密货币交易基础设施。非托管设计。",
  "footer.col.product": "产品",
  "footer.col.partners": "合作伙伴",
  "footer.col.resources": "资源",
  "footer.col.legal": "法律",
  "footer.link.liveTrading": "实时交易",
  "footer.link.coreStrengths": "核心优势",
  "footer.link.performance": "表现",
  "footer.link.mobileApp": "移动应用",
  "footer.link.docs": "文档",
  "footer.link.api": "API",
  "footer.link.blog": "博客",
  "footer.link.status": "状态",
  "footer.link.terms": "条款",
  "footer.link.privacy": "隐私",
  "footer.link.security": "安全",
  "footer.link.disclosures": "披露",
  "footer.copyright": "© 2026 CoinTech2u. 加密货币交易涉及重大风险。",
  "footer.statusLine": "v4.2.1 · 所有系统运行正常",

  // FAQ Q&A
  "faq.q1.q": "什么是 CoinTech2u?",
  "faq.q1.a":
    "CoinTech2u 是一套 AI 驱动的交易基础设施,代您自动执行加密货币合约交易。引擎负责行情监测、出入场分析与执行 —— 您的资金始终保留在您自己的交易所账户中。",
  "faq.q2.q": "使用 CoinTech2u 安全吗?",
  "faq.q2.a":
    "安全。CoinTech2u 采用零托管模式。您的资金始终保留在您自己的交易所账户中。API 连接全程加密,仅具备只读与交易权限 —— 提币权限按设计自动拒绝。",
  "faq.q3.q": "CoinTech2u 与手动交易有何不同?",
  "faq.q3.a":
    "CoinTech2u 通过 AI 驱动的分析、实时市场洞察与智能投资组合追踪,在同一个仪表板内自动处理交易的复杂环节。引擎已通过四年的实盘表现数据持续打磨。",
  "faq.q4.q": "需要交易经验才能使用 CoinTech2u 吗?",
  "faq.q4.a":
    "不需要。CoinTech2u 既适合新手,也适合经验丰富的交易者。我们的 AI 负责分析与策略执行,您只需查看投资组合表现 —— 无需手动交易或持续盯盘。",
  "faq.q5.q": "如何连接我的交易所账户?",
  "faq.q5.a":
    "登录您的 CoinTech2u 账号,进入「Fast API 绑定」页面,按屏幕提示操作即可。整个流程不到一分钟。您的合约账户与交易活动会自动实时同步。",
  "faq.q6.q": "可以同时监控多个交易所账户吗?",
  "faq.q6.a":
    "可以。CoinTech2u 支持同时绑定、管理与追踪多个子账户 —— 非常适合按仓位规模、币种选择或风险等级分散资金的用户。",
  "faq.q7.q": "遇到问题时有客服支持吗?",
  "faq.q7.a":
    "有。我们通过应用内在线客服与官方 Telegram 频道提供专属支持。我们的团队会协助您完成设置、提供技术支持并解答一般咨询。",

  // Article chrome
  "article.back.news": "返回新闻",
  "article.back.announcements": "返回公告",
  "article.notFound.title": "文章未找到",
  "article.notFound.body": "此内容可能已被移除,或链接有误。",
  "article.error.title": "无法加载",
  "article.error.body": "我们暂时无法连接到服务,请稍后再试。",

  // Partners
  "partners.eyebrow": "官方合作伙伴",
  "partners.title.line1": "连接全球",
  "partners.title.line2": "领先交易所。",

  // CoreStrengths
  "core.eyebrow": "核心优势",
  "core.title.line1": "AI 驱动的洞察。",
  "core.title.line2": "智能分析，可验证的成果。",

  // Tutorials
  "tut.eyebrow": "从设置到成功",
  "tut.title.line1": "操作演示视频。",
  "tut.title.line2": "端到端的设置流程。",

  // Leaders
  "leaders.eyebrow": "实时排行榜",

  // Insights
  "insights.eyebrow": "洞察、新闻与市场动态",
  "insights.title.line1": "发现趋势。",
  "insights.title.line2": "从数据中学习,保持领先。",
  "insights.lede":
    "CoinTech2u 团队的研究笔记、市场简报与产品更新。",
  "insights.rail.title": "最新市场动态",
  "insights.announcements.eyebrow": "最新公告",

  // AppDownload
  "app.eyebrow": "移动应用",
  "app.title.line1": "随时随地",
  "app.title.line2": "交易。",

  // FAQ
  "faq.eyebrow": "常见问题",
  "faq.title.line1": "问题,",
  "faq.title.line2": "简明解答。",
  "faq.lede": "关于策略、安全、设置与表现的即时解答。",

  // Contact
  "contact.eyebrow": "联系我们",
  "contact.title.line1": "让我们连接",
  "contact.title.line2": "共同成长。",
  "contact.lede": "留下您的联系方式 —— 我们的团队会主动联系您。",

  // Archive
  "arch.news.eyebrow": "新闻与市场动态",
  "arch.news.title.line1": "加密货币新闻,",
  "arch.news.title.line2": "为您简报。",
  "arch.news.lede":
    "精选阅读 —— 上线、监管、宏观信号,以及行情背后的趋势。",
  "arch.ann.eyebrow": "公告",
  "arch.ann.title.line1": "产品更新,",
  "arch.ann.title.line2": "直接来自团队。",
  "arch.ann.lede":
    "CoinTech2u 的功能发布、平台升级与路线图里程碑。",
  "arch.empty": "此分类暂无内容。",
};

const zhTW: Dict = {
  // Hero
  "hero.badge.new": "新",
  "hero.badge.text": "自適應執行引擎 v4 — 現已投入生產",
  "hero.title.line1": "交易智慧,",
  "hero.title.line2.lead": "而非",
  "hero.title.line2.emph": "情緒",
  "hero.subtitle.pre":
    "憑藉 AI 驅動的精準、即時分析與可驗證的洞察,在每一次市場波動中保持領先 —— 服務於",
  "hero.subtitle.countries": "100+ 個國家",
  "hero.subtitle.post": "的交易者。",
  "hero.cta.viewLive": "查看即時績效",
  "hero.experience.title": "立即體驗",
  "hero.experience.getStarted": "立即開始",

  // CoreStrengths cards
  "core.card.custody.eyebrow": "資金託管",
  "core.card.custody.unit": "歸您所有",
  "core.card.custody.caption": "資金保留在您的交易所。零第三方託管。",
  "core.card.ai.eyebrow": "AI 引擎",
  "core.card.ai.caption": "自適應智慧在每個波動週期中重新校準。",
  "core.card.live2022.eyebrow": "自 2022 年運行",
  "core.card.live2022.unit": "天",
  "core.card.live2022.caption": "經審計的即時績效,每項指標均來自生產。",
  "core.card.latency.eyebrow": "P95 延遲",
  "core.card.latency.unit": "毫秒",
  "core.card.latency.caption": "覆蓋 OKX、Bitget、Bybit、Binance —— 即時執行。",
  "core.card.always.eyebrow": "全天候運行",
  "core.card.always.caption": "持續市場覆蓋。引擎永不停歇。",
  "core.card.discipline.eyebrow": "紀律性",
  "core.card.discipline.caption":
    "倉位規模、回撤限制、曝險上限 —— 由代碼定義,而非情緒。",

  // Nav
  "nav.liveTrading": "即時交易",
  "nav.userResults": "用戶成果",
  "nav.coreStrengths": "核心優勢",
  "nav.ourPartners": "合作夥伴",
  "nav.news": "新聞",
  "nav.faq": "常見問題",
  "nav.login": "登入",
  "nav.signup": "註冊 →",
  "nav.languageLabel": "語言",

  // Common UI
  "common.back": "返回",
  "common.viewAll": "查看全部",
  "common.viewAllArticles": "查看全部文章",
  "common.readArticle": "閱讀文章",
  "common.browseAllNews": "瀏覽所有新聞",
  "common.originalSource": "原文連結 ↗",
  "common.watchOnYoutube": "在 YouTube 觀看",
  "common.live": "直播",
  "common.experienceNow": "立即體驗",

  // LivePerformance
  "livePerf.eyebrow": "即時交易",
  "livePerf.title.line1": "真實帳戶。",
  "livePerf.title.line2": "即時的真實績效。",
  "livePerf.counter.days": "天",
  "livePerf.counter.hours": "小時",
  "livePerf.counter.minutes": "分鐘",
  "livePerf.counter.seconds": "秒",
  "livePerf.counter.aria": "實盤帳戶運行時間",
  "livePerf.guard.equity.title": "資產保護",
  "livePerf.guard.equity.desc": "自動保護您的資金,設定最大回撤上限。",
  "livePerf.guard.profit.title": "盈利防護",
  "livePerf.guard.profit.desc": "隨著倉位增長自動鎖定利潤。",

  // Leaders
  "leaders.title.line1": "真實交易者。",
  "leaders.title.line2": "真實利潤。",
  "leaders.lede":
    "CoinTech2u 網絡中的即時利潤排行。在今日、本月與全部時間之間滑動查看誰領先。",
  "leaders.tab.today": "今日",
  "leaders.tab.today.sub": "24 小時利潤",
  "leaders.tab.monthly": "本月",
  "leaders.tab.monthly.sub": "30 日利潤",
  "leaders.tab.alltime": "全部時間",
  "leaders.tab.alltime.sub": "累計",
  "leaders.id": "ID",
  "leaders.empty": "排行榜資料暫時無法顯示。",

  // Tutorials
  "tut.step1.title": "註冊交易所帳戶",
  "tut.step1.desc": "三分鐘內完成支援的交易所帳戶註冊流程。",
  "tut.step2.title": "綁定 Fast API",
  "tut.step2.desc": "產生唯讀 API 金鑰並貼上,我們會驗證權限範圍 —— 自動拒絕提幣權限。",
  "tut.step3.title": "快速設定",
  "tut.step3.desc": "引擎將檢查您的餘額與風險偏好,並提出初始策略配置。",
  "tut.step4.title": "查看帳戶績效",
  "tut.step4.desc": "開啟分析面板查看資產曲線、持倉歷史與可匯出的盈虧報表。",
  "tut.nowPlaying": "正在播放",
  "tut.step": "步驟",

  // Partner card tags
  "partners.tag.spotFutures": "現貨 · 合約",
  "partners.tag.copyFutures": "跟單 · 合約",
  "partners.tag.derivatives": "衍生品",

  // AppDownload platforms
  "app.platform.ios": "iOS",
  "app.platform.ios.label": "即將推出",
  "app.platform.ios.sub": "Apple App Store",
  "app.platform.android": "Android",
  "app.platform.android.label": "點擊下載",
  "app.platform.android.sub": "Google Play / APK",

  // Contact form
  "contact.field.name": "姓名",
  "contact.field.name.placeholder": "您的全名",
  "contact.field.email": "電子郵件",
  "contact.field.email.placeholder": "you@email.com",
  "contact.field.telegram": "Telegram 帳號",
  "contact.field.telegram.placeholder": "@username",
  "contact.field.subject": "主題",
  "contact.field.subject.placeholder": "您想諮詢什麼?",
  "contact.field.message": "留言",
  "contact.field.message.placeholder": "請告訴我們更多細節…",
  "contact.submit": "發送留言",
  "contact.submit.success": "✓ 已收到您的留言",
  "contact.support.heading": "直接客服",
  "contact.support.telegram": "Telegram · @CoinTech2u_Admin",
  "contact.support.chat": "App 內即時客服 · 全天候",

  // Footer
  "footer.tagline": "AI 驅動的加密貨幣交易基礎設施。非託管設計。",
  "footer.col.product": "產品",
  "footer.col.partners": "合作夥伴",
  "footer.col.resources": "資源",
  "footer.col.legal": "法律",
  "footer.link.liveTrading": "即時交易",
  "footer.link.coreStrengths": "核心優勢",
  "footer.link.performance": "績效",
  "footer.link.mobileApp": "行動應用",
  "footer.link.docs": "文件",
  "footer.link.api": "API",
  "footer.link.blog": "部落格",
  "footer.link.status": "狀態",
  "footer.link.terms": "條款",
  "footer.link.privacy": "隱私",
  "footer.link.security": "安全",
  "footer.link.disclosures": "披露",
  "footer.copyright": "© 2026 CoinTech2u. 加密貨幣交易涉及重大風險。",
  "footer.statusLine": "v4.2.1 · 所有系統運作正常",

  // FAQ Q&A
  "faq.q1.q": "什麼是 CoinTech2u?",
  "faq.q1.a":
    "CoinTech2u 是一套 AI 驅動的交易基礎設施,代您自動執行加密貨幣合約交易。引擎負責行情監測、出入場分析與執行 —— 您的資金始終保留在您自己的交易所帳戶中。",
  "faq.q2.q": "使用 CoinTech2u 安全嗎?",
  "faq.q2.a":
    "安全。CoinTech2u 採用零託管模式。您的資金始終保留在您自己的交易所帳戶中。API 連接全程加密,僅具備唯讀與交易權限 —— 提幣權限依設計自動拒絕。",
  "faq.q3.q": "CoinTech2u 與手動交易有何不同?",
  "faq.q3.a":
    "CoinTech2u 透過 AI 驅動的分析、即時市場洞察與智慧投資組合追蹤,在同一個儀表板內自動處理交易的複雜環節。引擎已通過四年的實盤表現數據持續打磨。",
  "faq.q4.q": "需要交易經驗才能使用 CoinTech2u 嗎?",
  "faq.q4.a":
    "不需要。CoinTech2u 既適合新手,也適合經驗豐富的交易者。我們的 AI 負責分析與策略執行,您只需查看投資組合表現 —— 無需手動交易或持續盯盤。",
  "faq.q5.q": "如何連接我的交易所帳戶?",
  "faq.q5.a":
    "登入您的 CoinTech2u 帳號,進入「Fast API 綁定」頁面,依畫面提示操作即可。整個流程不到一分鐘。您的合約帳戶與交易活動會自動即時同步。",
  "faq.q6.q": "可以同時監控多個交易所帳戶嗎?",
  "faq.q6.a":
    "可以。CoinTech2u 支援同時綁定、管理與追蹤多個子帳戶 —— 非常適合依倉位規模、幣種選擇或風險等級分散資金的使用者。",
  "faq.q7.q": "遇到問題時有客服支援嗎?",
  "faq.q7.a":
    "有。我們透過 App 內即時客服與官方 Telegram 頻道提供專屬支援。我們的團隊會協助您完成設定、提供技術支援並解答一般諮詢。",

  // Article chrome
  "article.back.news": "返回新聞",
  "article.back.announcements": "返回公告",
  "article.notFound.title": "文章未找到",
  "article.notFound.body": "此內容可能已被移除,或連結有誤。",
  "article.error.title": "無法載入",
  "article.error.body": "我們暫時無法連接到服務,請稍後再試。",

  // Partners
  "partners.eyebrow": "官方合作夥伴",
  "partners.title.line1": "連接全球",
  "partners.title.line2": "領先交易所。",

  // CoreStrengths
  "core.eyebrow": "核心優勢",
  "core.title.line1": "AI 驅動的洞察。",
  "core.title.line2": "智慧分析,可驗證的成果。",

  // Tutorials
  "tut.eyebrow": "從設定到成功",
  "tut.title.line1": "操作示範影片。",
  "tut.title.line2": "端到端的設定流程。",

  // Leaders
  "leaders.eyebrow": "即時排行榜",

  // Insights
  "insights.eyebrow": "洞察、新聞與市場動態",
  "insights.title.line1": "發現趨勢。",
  "insights.title.line2": "從數據中學習,保持領先。",
  "insights.lede":
    "CoinTech2u 團隊的研究筆記、市場簡報與產品更新。",
  "insights.rail.title": "最新市場動態",
  "insights.announcements.eyebrow": "最新公告",

  // AppDownload
  "app.eyebrow": "行動應用程式",
  "app.title.line1": "隨時隨地",
  "app.title.line2": "交易。",

  // FAQ
  "faq.eyebrow": "常見問題",
  "faq.title.line1": "問題,",
  "faq.title.line2": "簡明解答。",
  "faq.lede": "關於策略、安全、設定與績效的即時解答。",

  // Contact
  "contact.eyebrow": "聯絡我們",
  "contact.title.line1": "讓我們連結",
  "contact.title.line2": "共同成長。",
  "contact.lede": "留下您的聯絡方式 —— 我們的團隊會主動聯繫您。",

  // Archive
  "arch.news.eyebrow": "新聞與市場動態",
  "arch.news.title.line1": "加密貨幣新聞,",
  "arch.news.title.line2": "為您簡報。",
  "arch.news.lede":
    "精選閱讀 —— 上架、監管、總經訊號,以及行情背後的趨勢。",
  "arch.ann.eyebrow": "公告",
  "arch.ann.title.line1": "產品更新,",
  "arch.ann.title.line2": "直接來自團隊。",
  "arch.ann.lede":
    "CoinTech2u 的功能發布、平台升級與路線圖里程碑。",
  "arch.empty": "此分類暫無內容。",
};

const DICTIONARIES: Record<LangCode, Dict> = {
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

// === Context + Hook =======================================================
type Ctx = {
  lang: LangCode;
  setLang: (next: LangCode) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<Ctx>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key) => en[key] ?? key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  // SSR render uses DEFAULT_LANG to avoid hydration mismatch — we don't know
  // the user's saved preference until the client mounts. The effect below
  // promotes the saved value on the client only.
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && saved in DICTIONARIES) setLangState(saved as LangCode);
    } catch {
      // localStorage unavailable — stay on default.
    }
    // Listen for cross-tab updates AND the custom event the picker fires.
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ code: LangCode }>).detail;
      if (detail?.code && detail.code in DICTIONARIES) setLangState(detail.code);
    };
    window.addEventListener("ct2u:languageChange", onChange);
    return () => window.removeEventListener("ct2u:languageChange", onChange);
  }, []);

  const setLang = useCallback((next: LangCode) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Choice applies in-memory for this session only.
    }
    window.dispatchEvent(
      new CustomEvent("ct2u:languageChange", { detail: { code: next } }),
    );
  }, []);

  const t = useCallback(
    (key: string) => DICTIONARIES[lang][key] ?? DICTIONARIES.en[key] ?? key,
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// Convenience hook — most callers just need t().
export function useT() {
  return useContext(LanguageContext).t;
}

export const SUPPORTED_LANGUAGES: { code: LangCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
];
