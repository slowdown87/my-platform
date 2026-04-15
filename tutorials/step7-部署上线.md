# 第七步：部署上线（Netlify）

> **状态**：✅ 已完成
> **完成时间**：2026年4月14日
> **部署地址**：https://my-platform87.netlify.app

---

## 目标

把平台部署到 Netlify，让全世界的人都能通过网址访问。

## 为什么选 Netlify？

| 平台 | 国内访问部署的网站 | 说明 |
|------|-----------------|------|
| Vercel | ❌ 打不开 | 国内无法访问 |
| Gitee Pages | ✅ 能访问 | 但不支持环境变量 |
| **Netlify** | **✅ 能访问** | **支持环境变量，功能完善** |

---

## 1️⃣ 创建环境变量文件

1. 在 VS Code 中，右键点击 **`my-platform`** 文件夹 → **New File**
2. 命名为 **`.env`**（注意前面有个点！）
3. 粘贴以下内容（替换成您自己的值）：

```
VITE_SUPABASE_URL=您的Project URL
VITE_SUPABASE_ANON_KEY=您的anon public密钥
```

4. 按 `Ctrl + S` 保存

---

## 2️⃣ 更新 supabase.ts 使用环境变量

1. 打开 **`src/lib/supabase.ts`**，**全选删除**
2. 粘贴以下代码：

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

3. 按 `Ctrl + S` 保存

---

## 3️⃣ 检查 .gitignore

确保 `.env` 不会被上传到 GitHub。打开 **`.gitignore`**，确认包含：

```
.env
.env.local
.env.production
```

---

## 4️⃣ 注册 Netlify

1. 打开浏览器，访问：**https://app.netlify.com**
2. 点击 **"Sign up"**
3. 选择 **"Continue with GitHub"**
4. 授权 Netlify 访问您的 GitHub

---

## 5️⃣ 导入项目并配置

1. 登录后，点击 **"Add new site"** → **"Import an existing project"**
2. 选择 **"GitHub"**
3. 找到 **my-platform**，点击 **"Import"**
4. 配置：
   - **Build command**：`npm run build`
   - **Publish directory**：`dist`
5. ⚠️ **先不要点 Deploy！** 先添加环境变量（下一步）

---

## 6️⃣ 添加环境变量（必须做！）

> ⚠️ **重要**：`.env` 文件不会上传到 GitHub，Netlify 需要单独配置密钥！

在 Import 页面展开 **"Advanced build settings"** 或 **"Environment variables"**：

1. 点击 **"Edit variables"** 或 **"New variable"**
2. 添加两个变量：

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | 您的 Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | 您的 Supabase anon public 密钥 |

3. 每个添加后确认
4. 点击 **"Deploy site"**

---

## 7️⃣ 等待部署完成

大约 1-2 分钟，看到 **"Your site is live! 🎉"** 就成功了！

Netlify 会给您一个网址，类似：
```
https://my-platform87.netlify.app
```

---

## 8️⃣ 验证

打开您的网址，测试：
1. ✅ 能看到登录页面
2. ✅ 能注册新账号
3. ✅ 能登录并看到平台主页
4. ✅ 能退出登录

---

## 以后更新代码的流程

每次修改代码后，在命令行执行：

```bash
git add .
git commit -m "更新说明"
git push origin main
```

Netlify 会**自动检测到更新并重新部署**！

---

## 常见问题

**Q: 部署报错 "Deploy directory 'dist' does not exist"？**
A: 检查 `vite.config.ts`，确保没有 `outDir: 'docs'`。应该用默认的 `dist`。

**Q: 部署成功但网站报错？**
A: 检查环境变量是否配置正确（Site configuration → Environment variables，不是 Team settings）。

**Q: 网站打不开？**
A: Netlify 部署的网站国内可以正常访问。如果打不开，等几分钟再试。

**Q: 更新代码后怎么重新部署？**
A: `git push` 后 Netlify 自动部署，不用手动操作。

---

## 踩坑记录

| 问题 | 解决方案 |
|------|---------|
| Vercel 部署成功但国内打不开 | 换成 Netlify |
| Gitee Pages 不支持环境变量 | 放弃 Gitee Pages |
| Netlify "dist does not exist" | 删除 vite.config.ts 里的 outDir 配置 |
| Netlify 环境变量在 Team settings 找不到 | 应该在 Site configuration → Environment variables |
| TypeScript 报 "data declared but never read" | 删除未使用的变量 |
