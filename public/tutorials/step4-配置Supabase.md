# 第四步：配置 Supabase 数据库连接

> **状态**：✅ 已完成
> **完成时间**：2026年4月13日
> **预计时间**：10分钟

---

## 目标

在 Supabase 创建数据库项目，获取连接信息，配置到代码中。

---

## 1️⃣ 在 Supabase 创建项目

1. 打开浏览器，访问：**https://supabase.com/dashboard**
2. 用 GitHub 登录
3. 点击 **"New Project"**（新建项目）
4. 填写信息：
   - **Name**：`my-platform`
   - **Database Password**：设一个密码，**记住它！**
   - **Region**：选择 **Northeast Asia (Tokyo)** 或 **Southeast Asia (Singapore)**
5. 点击 **"Create new project"**
6. 等待 1-2 分钟，项目创建完成

---

## 2️⃣ 获取连接信息

1. 在 Supabase 控制面板，点击左侧 **⚙️ Settings**
2. 点击 **"API Keys"**（不是 General！）
3. 复制以下两个值，保存到记事本：

| 信息 | 说明 | 示例 |
|------|------|------|
| **Project URL** | 项目地址 | `https://xxxxx.supabase.co` |
| **anon public** | 公共密钥 | `eyJhbGciOiJI...` |

> ⚠️ **注意**：还有一个 `service_role` 密钥，**不要碰**，那个是管理员密钥。我们只需要 `anon public`。

---

## 3️⃣ 创建配置文件

1. 在 VS Code 中，右键点击 `src` 文件夹 → **New Folder** → 命名 `lib`
2. 右键点击 `lib` 文件夹 → **New File** → 命名 `supabase.ts`
3. 双击打开 `supabase.ts`，粘贴以下代码：

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = '您的Project URL'
const supabaseAnonKey = '您的anon public密钥'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

4. **替换** `'您的Project URL'` 和 `'您的anon public密钥'` 为您复制的真实值（保留引号）
5. 按 `Ctrl + S` 保存

---

## 完成检查清单

| 任务 | 状态 |
|------|------|
| Supabase 创建了项目 my-platform | ✅ |
| 复制了 Project URL | ✅ |
| 复制了 anon public 密钥 | ✅ |
| 创建了 src/lib/supabase.ts | ✅ |
| 填入了真实的 URL 和密钥 | ✅ |

---

## 常见问题

**Q: API Keys 在哪里找？**
A: 左侧菜单 → Settings → API Keys（不是 General 页面）

**Q: 填入密钥后代码报错怎么办？**
A: 确保引号是英文引号 `'...'`，不是中文引号 `'...'`
