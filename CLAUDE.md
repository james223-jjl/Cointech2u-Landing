# CoinTech2u Landing（官网着陆页 · 静态版）

CoinTech2u 官网 landing site 的**纯静态 HTML 导出版**（源自 Next.js 项目导出），git 仓库 `james223-jjl/Cointech2u-Landing`，当前分支 **v6**。

## 页面

- `index.html` 首页 · `news/` 新闻 · `announcements/` 公告 · `404.html`
- 资产：`_next/`（CSS/JS bundles）、`videos/`、`icons/`、`logos/`、`strengths/`
- 视觉：渐变 + glassmorphism + glow + 粒子 canvas；JS 含导航滚动、scroll reveal、语言切换

## ⚠️ 注意

1. README 声明此为**导出产物、不建议手改**（source of truth 是上游 Next.js app，本仓库只有静态版）。小改可以直接动 HTML/CSS，但大改要意识到没有上游源码在本机。
2. 分支在 **v6**，改动 commit 前确认还在 v6（`git branch --show-current`）。
3. 本地预览：`python3 serve.py <端口>`（默认 8666；带 /api 代理 → app.cointech2u.com/api/v2，公告与排行榜才有实时数据）。纯静态 `python3 -m http.server` 也能跑但 /api 404、只显示内置兜底数据。生产部署同样需要把 /api/announcements、/api/leaders 重写到该后端。
4. 属于 CoinTech2u 业务线（同线项目：cointech2u-affiliate、cointech2u-finance*）。
