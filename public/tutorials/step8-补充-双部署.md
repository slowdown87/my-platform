# 第八步（补充）：双部署 - GitHub Pages + Netlify

> **状态**：✅ 已完成
> **目的**：同时部署到 GitHub Pages（展示/备份）和 Netlify（主站）

---

## 目标

让您的项目同时运行在两个地址：

| 平台 | 地址 | 功能 |
|------|------|------|
| **Netlify（主站）** | https://my-platform87.netlify.app | 全部功能可用 |
| **GitHub Pages（展示）** | https://slowdown87.github.io/my-platform/ | 部分功能（AI不可用） |

---

## 为什么需要双部署？

| 场景 | GitHub Pages | Netlify |
|------|-------------|---------|
| 项目展示/作品集 | ✅ 适合 | ✅ 适合 |
| AI 对话功能 | ❌ 不支持 | ✅ 支持 |
| 国内访问速度 | ⚠️ 有时慢 | ✅ 较快 |
| 备份/容灾 | ✅ 有用 | ✅ 有用 |

---

## 1️⃣ 安装 gh-pages 工具

在终端运行：

```bash
npm install --save-dev gh-pages
```

---

## 2️⃣ 修改 package.json

打开 `package.json`，找到 `scripts` 部分，添加 `deploy` 命令：

```json
{
  "name": "my-platform",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "homepage": "https://slowdown87.github.io/my-platform/",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

⚠️ **重要**：
- 在 `scripts` 同级添加 `"homepage"` 字段
- 在 `scripts` 中添加 `"deploy"` 命令

---

## 3️⃣ 修改 vite.config.ts

打开 `vite.config.ts`，修改为：

```typescript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    // GitHub Pages 用子路径，Netlify 用根路径（通过环境变量控制）
    base: env.VITE_BASE_URL || '/my-platform/',
  }
})
```

> 💡 **原理**：
> - 本地开发 / GitHub Pages：`base` 为 `/my-platform/`
> - Netlify 部署：通过环境变量 `VITE_BASE_URL=/` 覆盖为根路径

---

## 4️⃣ 更新 .env 文件

在 `.env` 文件末尾添加：

```
VITE_BASE_URL=/
```

这样本地开发和 Netlify 部署都使用根路径。

---

## 5️⃣ 更新 netlify.toml

打开 `netlify.toml`（如果没有就创建），确保包含 `VITE_BASE_URL` 环境变量：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_BASE_URL = "/"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

> ⚠️ **关键**：`[build.environment]` 中的 `VITE_BASE_URL = "/"` 确保 Netlify 构建时使用根路径。

---

## 6️⃣ 在 ChatAI.tsx 添加 GitHub Pages 检测

打开 `src/components/ChatAI.tsx`，在所有 state 定义之后，`useEffect` 之前，添加检测代码：

```tsx
export default function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ⬇️ 在这里添加以下代码 ⬇️

  // 检测是否在 GitHub Pages 上
  const isGitHubPages = window.location.hostname.includes('github.io')

  if (isGitHubPages) {
    return (
      <div style={{
        height: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🤖</div>
        <h2 style={{ marginBottom: '16px', color: '#333' }}>AI 对话功能</h2>
        <p style={{ color: '#666', marginBottom: '24px', maxWidth: '400px' }}>
          GitHub Pages 不支持服务器端功能，AI 对话在此不可用。
        </p>
        <a
          href="https://my-platform87.netlify.app"
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          前往主站使用 AI 对话 →
        </a>
      </div>
    )
  }

  // ⬆️ 检测代码结束 ⬆️

  // ... 后面的代码保持不变 ...
```

---

## 7️⃣ 部署到 GitHub Pages

在终端运行：

```bash
npm run deploy
```

这会：
1. 构建项目（使用 `/my-platform/` 子路径）
2. 创建 `gh-pages` 分支
3. 推送到 GitHub

---

## 8️⃣ 在 GitHub 启用 Pages

1. 打开 https://github.com/slowdown87/my-platform/settings/pages
2. **Source** 选择 **Deploy from a branch**
3. **Branch** 选择 **gh-pages** 分支，文件夹选 **/(root)**
4. 点击 **Save**
5. 等待几分钟，访问 https://slowdown87.github.io/my-platform/

---

## 9️⃣ 推送所有更改到 main 分支

```bash
git add .
git commit -m "配置双部署：GitHub Pages + Netlify"
git push origin main
```

> ⚠️ `git push` 后 Netlify 会自动重新部署，同时 GitHub Pages 也会更新。

---

## 🔟 以后更新代码的流程

每次修改代码后：

```bash
# 1. 推送到 main（触发 Netlify 自动部署）
git add .
git commit -m "更新说明"
git push origin main

# 2. 部署到 GitHub Pages（需要单独构建，因为 base 路径不同）
# PowerShell 语法：
$env:VITE_BASE_URL="/my-platform/"; npm run build; npx gh-pages -d dist
# 如果网络断了，不用重新构建，直接重试推送：
npx gh-pages -d dist
```

> ⚠️ **注意**：
> - 必须用 `$env:VITE_BASE_URL="..."`（PowerShell 语法），不能用 `set VITE_BASE_URL=...`（CMD 语法，环境变量不会传递给 npm）
> - 如果 `gh-pages` 推送失败（网络问题），只需重试 `npx gh-pages -d dist`，不用重新构建

---

## 自动化部署（可选）

可以配置 GitHub Actions 自动部署 GitHub Pages，每次 push 后自动更新。

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_BASE_URL: /my-platform/
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

然后在 GitHub 仓库 **Settings → Secrets and variables → Actions** 中添加：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 验证

| 平台 | 地址 | 检查项 |
|------|------|--------|
| Netlify | https://my-platform87.netlify.app | AI 对话正常工作 |
| GitHub Pages | https://slowdown87.github.io/my-platform/ | 显示"前往主站"提示 |

---

## 常见问题

**Q: GitHub Pages 显示空白页？**
A: 检查 `vite.config.ts` 的 `base` 配置是否为 `/my-platform/`。

**Q: GitHub Pages 样式错乱？**
A: 确认 `base` 路径末尾有斜杠 `/my-platform/`。

**Q: Netlify 部署后样式也错乱？**
A: 检查 `netlify.toml` 中 `VITE_BASE_URL` 是否设置为 `/`。

**Q: 每次都要手动运行 npm run deploy？**
A: 配置 GitHub Actions 实现自动部署（见上方可选步骤）。

**Q: gh-pages 推送失败？**
A: 检查 GitHub 登录状态，可能需要用 Personal Access Token。

---

## 踩坑记录

| 问题 | 解决方案 |
|------|---------|
| GitHub Pages 空白 | 检查 vite.config.ts 的 base 配置 |
| Netlify 样式错乱 | 确保 netlify.toml 中 VITE_BASE_URL=/ |
| gh-pages 分支推送失败 | 检查 GitHub 登录状态 |
| GitHub Actions 构建失败 | 检查 Secrets 是否正确配置 |
| 两个平台路径冲突 | 用 VITE_BASE_URL 环境变量区分 |
