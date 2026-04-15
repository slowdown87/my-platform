# 第三步：创建 React 项目

> **状态**：✅ 已完成
> **完成时间**：2026年4月13日
> **预计时间**：15-20分钟

---

## 目标

在电脑上创建一个 React + TypeScript 项目，这是您网站的基础框架。

---

## 1️⃣ 打开命令行

1. 在键盘上按 `Win + R`
2. 输入 `cmd`
3. 按回车，会弹出一个**黑色窗口**

---

## 2️⃣ 创建项目文件夹

在黑色窗口中，依次输入以下命令（每输入一行按一次回车）：

```bash
d:
mkdir my-platform
cd my-platform
```

**说明：**
- `d:` — 切换到 D 盘
- `mkdir my-platform` — 创建项目文件夹
- `cd my-platform` — 进入文件夹

---

## 3️⃣ 初始化 React 项目

```bash
npm create vite@latest . -- --template react-ts
```

> ⚠️ 注意末尾有一个 `.`（点），代表"在当前文件夹创建"
>
> 如果提示 "Need to install the following packages?"，输入 `y` 然后按回车。

等它运行完（大约10-30秒），项目就创建好了！

---

## 4️⃣ 安装项目依赖

```bash
npm install
```

这会自动下载项目需要的所有工具包，可能需要1-2分钟。

> 💡 **如果很慢**，先换国内镜像源：
> ```bash
> npm config set registry https://registry.npmmirror.com
> ```

---

## 5️⃣ 安装核心依赖包

```bash
npm install @supabase/supabase-js react-router-dom
npm install antd @ant-design/icons
```

这些是项目需要的额外工具：
- `@supabase/supabase-js` — 连接数据库
- `react-router-dom` — 页面跳转
- `antd` — 好看的UI组件库
- `@ant-design/icons` — 图标库

---

## 6️⃣ 启动项目看看效果

```bash
npm run dev
```

看到类似输出就说明成功了：
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

**打开浏览器，访问：http://localhost:5173**

🎉 您应该能看到一个 React + Vite 的默认页面！

> 💡 **停止服务器**：按 `Ctrl + C`。下次再输入 `npm run dev` 就行。

---

## 完成检查清单

| 任务 | 验证方法 | 状态 |
|------|---------|------|
| 创建项目文件夹 | D盘下有 my-platform 文件夹 | ✅ |
| 初始化 React 项目 | 文件夹里有 src、package.json 等文件 | ✅ |
| 安装依赖 | `npm install` 无报错 | ✅ |
| 安装核心依赖 | antd、supabase 等安装成功 | ✅ |
| 启动项目 | 浏览器打开 localhost:5173 能看到页面 | ✅ |
