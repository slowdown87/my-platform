# 🚀 个人全功能在线平台 - 搭建教程

> **从零开始，一步一步搭建属于你自己的全功能在线平台**
>
> 最后更新：2026年4月14日 | 当前进度：85%

---

## 📋 项目信息

| 项目 | 说明 |
|------|------|
| 技术栈 | React + TypeScript + Supabase + Netlify |
| 总成本 | ¥0/月（全部使用免费服务） |
| 适用人群 | 零编程基础 |
| 在线地址 | https://my-platform87.netlify.app |

### 技术选型（最终版）

| 用途 | 技术 | 费用 | 备注 |
|------|------|------|------|
| 前端框架 | React + TypeScript | 免费 | — |
| 托管平台 | **Netlify** | 免费 | 国内可访问 |
| 数据库 | Supabase (PostgreSQL) | 免费（500MB） | — |
| AI对话 | 阿里百炼 qwen-turbo | 免费（每月100万tokens） | 国内直连，联网搜索用 Tavily（免费1000次/月） |
| 文件存储 | Supabase Storage | 免费（1GB） | — |

---

## 📊 总体进度

```
[██████████░] 90%

✅ 第一步：安装必备软件
✅ 第二步：注册云服务账号
✅ 第三步：创建项目
✅ 第四步：配置 Supabase
✅ 第五步：创建平台首页
✅ 第六步：实现用户登录功能
✅ 第七步：部署上线（Netlify）
✅ 第八步：添加AI对话功能
✅ 第八步补充：双部署 GitHub Pages + Netlify
✅ 第九步：免费联网搜索（Tavily + 百炼）
🔴 第十步：在线编程功能（待实操）
⬜ 第十一步：教程展示页面
⬜ 第十二步：其他功能模块
```

---

## 📁 教程目录

### 准备阶段

| 步骤 | 标题 | 状态 | 文件 |
|------|------|------|------|
| 第一步 | 安装必备软件（VS Code、Node.js、Git） | ✅ 已完成 | [step1-安装软件.md](./steps/step1-安装软件.md) |
| 第二步 | 注册云服务账号（GitHub、Supabase、百炼） | ✅ 已完成 | [step2-注册账号.md](./steps/step2-注册账号.md) |

### 开发阶段

| 步骤 | 标题 | 状态 | 文件 |
|------|------|------|------|
| 第三步 | 创建 React 项目 | ✅ 已完成 | [step3-创建项目.md](./steps/step3-创建项目.md) |
| 第四步 | 配置 Supabase 数据库连接 | ✅ 已完成 | [step4-配置Supabase.md](./steps/step4-配置Supabase.md) |
| 第五步 | 创建平台首页（导航栏+功能卡片） | ✅ 已完成 | [step5-平台首页.md](./steps/step5-平台首页.md) |
| 第六步 | 实现用户登录功能 | ✅ 已完成 | [step6-用户登录.md](./steps/step6-用户登录.md) |
| 第七步 | 部署上线（Netlify） | ✅ 已完成 | [step7-部署上线.md](./steps/step7-部署上线.md) |
| 第八步 | 添加AI对话功能（含联网搜索） | ✅ 已完成 | [step8-AI对话.md](./steps/step8-AI对话.md) |
| 第八步补充 | 双部署：GitHub Pages + Netlify | ✅ 已完成 | [step8-补充-双部署.md](./steps/step8-补充-双部署.md) |
| 第九步 | 免费联网搜索（Tavily + 百炼） | ✅ 已完成 | [step9-免费联网搜索.md](./steps/step9-免费联网搜索.md) |
| 第十步 | 在线编程功能（Monaco Editor） | ✅ 已完成 | [step10-在线编程.md](./steps/step10-在线编程.md) |
| 第十一步 | 教程展示页面 | ⬜ 待开始 | step11-教程展示.md |
| 第十二步 | 其他功能模块 | ⬜ 待开始 | step12-其他功能.md |

---

## 💬 踩坑记录

> 📖 完整的踩坑详情（含原因分析、代码对比）请查看：[踩坑记录.md](./steps/踩坑记录.md)

### 快速索引

| 类别 | 问题数 | 常见问题 |
|------|--------|---------|
| 服务选择 | 7个 | Cloudflare/Vercel/Google AI/Groq 国内打不开 |
| 开发踩坑 | 11个 | 环境变量、白屏、样式、模型选择、百炼联网搜索收费 |
| 部署踩坑 | 8个 | git push、Netlify Functions、GitHub Pages |

---

## 📌 快速参考

### 常用命令

```bash
# 启动开发服务器
npm run dev

# 停止服务器
Ctrl + C

# 安装新依赖包
npm install 包名

# 用 VS Code 打开项目
code .

# 构建项目
npm run build

# 推送代码到 GitHub（自动触发 Netlify 部署）
git add .
git commit -m "更新说明"
git push origin main
```

### 项目文件结构

```
my-platform/
├── src/
│   ├── components/     # 组件（登录页等）
│   │   └── Login.tsx
│   ├── lib/            # 工具配置
│   │   └── supabase.ts
│   ├── App.tsx         # 主页面
│   ├── App.css         # 全局样式
│   └── main.tsx        # 程序入口
├── .env                # 环境变量（密钥，不上传）
├── .gitignore          # Git 忽略规则
├── package.json        # 项目配置
└── vite.config.ts      # Vite 配置
```

### 账号和密钥清单

| 服务 | 用途 | 保存位置 |
|------|------|---------|
| GitHub 账号 | 代码托管 | — |
| Gitee 账号 | 代码备份（国内） | — |
| Netlify 账号 | 网站部署 | — |
| Supabase Project URL | 数据库连接 | `.env` + Netlify 环境变量 |
| Supabase anon public | 数据库密钥 | `.env` + Netlify 环境变量 |
| 百炼 API Key | AI对话功能 | `.env` + Netlify 环境变量 |
| Tavily API Key | 联网搜索（免费） | `.env` + Netlify 环境变量 |

### 网址汇总

| 服务 | 地址 |
|------|------|
| **您的平台** | https://my-platform87.netlify.app |
| GitHub 仓库 | https://github.com/slowdown87/my-platform |
| Supabase 控制台 | https://supabase.com/dashboard |
| Netlify 控制台 | https://app.netlify.com |
| 阿里百炼 | https://bailian.console.aliyun.com |
| Tavily | https://tavily.com |

---

*教程持续更新中，跟着进度一步步来！*
