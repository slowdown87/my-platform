# 第十一步：教程展示页面

> **状态**：🔴 待实操
> **用途**：把搭建教程发布到网站上，展示您的搭建过程
> **依赖**：react-markdown

---

## 目标

在平台中添加一个教程页面，展示从零搭建平台的完整过程：

```
┌─────────────────────────────────────┐
│  📚 搭建教程                         │
├─────────────────────────────────────┤
│                                     │
│  ✅ 第一步：安装必备软件              │
│  ✅ 第二步：注册云服务账号             │
│  ✅ 第三步：创建项目                  │
│  ...                                │
│                                     │
│  点击步骤查看详细教程 →               │
│                                     │
└─────────────────────────────────────┘
```

---

## 1️⃣ 安装 react-markdown

```bash
npm install react-markdown
```

---

## 2️⃣ 把教程文件放到 public 目录

为了让网站能读取教程内容，需要把教程文件复制到 `public/` 目录。

在项目根目录运行：

```bash
mkdir public\tutorials
copy tutorial\steps\step1-安装软件.md public\tutorials\
copy tutorial\steps\step2-注册账号.md public\tutorials\
copy tutorial\steps\step3-创建项目.md public\tutorials\
copy tutorial\steps\step4-配置Supabase.md public\tutorials\
copy tutorial\steps\step5-平台首页.md public\tutorials\
copy tutorial\steps\step6-用户登录.md public\tutorials\
copy tutorial\steps\step7-部署上线.md public\tutorials\
copy tutorial\steps\step8-AI对话.md public\tutorials\
copy tutorial\steps\step8-补充-双部署.md public\tutorials\
copy tutorial\steps\step9-免费联网搜索.md public\tutorials\
copy tutorial\steps\step10-在线编程.md public\tutorials\
copy tutorial\steps\踩坑记录.md public\tutorials\
```

> 💡 或者手动复制：打开 `tutorial/steps/` 文件夹，把所有 `.md` 文件复制到 `public/tutorials/` 文件夹中。

---

## 3️⃣ 创建教程展示组件

在 `src/components/` 文件夹内创建 **`Tutorial.tsx`**：

```tsx
import { useState, useEffect } from 'react'
import Markdown from 'react-markdown'

interface TutorialItem {
  id: string
  title: string
  file: string
  status: 'done' | 'wip' | 'todo'
}

const tutorials: TutorialItem[] = [
  { id: '1', title: '安装必备软件', file: 'step1-安装软件.md', status: 'done' },
  { id: '2', title: '注册云服务账号', file: 'step2-注册账号.md', status: 'done' },
  { id: '3', title: '创建项目', file: 'step3-创建项目.md', status: 'done' },
  { id: '4', title: '配置 Supabase', file: 'step4-配置Supabase.md', status: 'done' },
  { id: '5', title: '创建平台首页', file: 'step5-平台首页.md', status: 'done' },
  { id: '6', title: '实现用户登录', file: 'step6-用户登录.md', status: 'done' },
  { id: '7', title: '部署上线', file: 'step7-部署上线.md', status: 'done' },
  { id: '8', title: '添加AI对话功能', file: 'step8-AI对话.md', status: 'done' },
  { id: '8b', title: '双部署 GitHub Pages', file: 'step8-补充-双部署.md', status: 'done' },
  { id: '9', title: '免费联网搜索', file: 'step9-免费联网搜索.md', status: 'done' },
  { id: '10', title: '在线编程功能', file: 'step10-在线编程.md', status: 'done' },
  { id: 'traps', title: '踩坑记录', file: '踩坑记录.md', status: 'done' },
]

export default function Tutorial() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedId) {
      setContent('')
      return
    }

    const item = tutorials.find(t => t.id === selectedId)
    if (!item) return

    setLoading(true)
    fetch(`/tutorials/${item.file}`)
      .then(res => res.text())
      .then(text => setContent(text))
      .catch(() => setContent('加载失败，请稍后重试'))
      .finally(() => setLoading(false))
  }, [selectedId])

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#f5f5f5',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* 标题栏 */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        📚 搭建教程
      </div>

      {/* 主内容区 */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 左侧：教程列表 */}
        <div style={{
          width: '260px',
          background: 'white',
          borderRight: '1px solid #eee',
          overflow: 'auto',
          flexShrink: 0
        }}>
          <div style={{ padding: '12px 16px', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>
            目录
          </div>
          {tutorials.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                color: selectedId === item.id ? '#667eea' : '#333',
                background: selectedId === item.id ? '#f0f0ff' : 'transparent',
                borderLeft: selectedId === item.id ? '3px solid #667eea' : '3px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{item.status === 'done' ? '✅' : item.status === 'wip' ? '🔴' : '⬜'}</span>
              <span>{item.title}</span>
            </div>
          ))}
        </div>

        {/* 右侧：教程内容 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: selectedId ? '24px' : '0',
          background: 'white'
        }}>
          {!selectedId ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
              <p>选择左侧的步骤查看教程</p>
            </div>
          ) : loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              加载中...
            </div>
          ) : (
            <div className="markdown-body" style={{
              maxWidth: '800px',
              lineHeight: '1.8',
              color: '#333'
            }}>
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## 4️⃣ 更新 App.tsx

打开 `src/App.tsx`，做以下修改：

### 4.1 添加导入

```tsx
import Tutorial from './components/Tutorial'
```

### 4.2 添加页面路由

在 `renderPage` 函数中添加：
```tsx
case 'tutorial':
  return <Tutorial />
```

### 4.3 更新底部导航栏的笔记按钮

找到笔记导航项：
```tsx
<div className="nav-item">
  <span className="nav-icon">📝</span>
  <span className="nav-text">笔记</span>
</div>
```

替换为：
```tsx
<div
  className={`nav-item ${currentPage === "tutorial" ? "active" : ""}`}
  onClick={() => setCurrentPage("tutorial")}
>
  <span className="nav-icon">📚</span>
  <span className="nav-text">教程</span>
</div>
```

---

## 5️⃣ 添加 Markdown 样式

打开 `src/App.css`，在文件末尾添加：

```css
/* Markdown 教程样式 */
.markdown-body h1 {
  font-size: 24px;
  color: #333;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
  margin-top: 24px;
}

.markdown-body h2 {
  font-size: 20px;
  color: #444;
  margin-top: 20px;
}

.markdown-body h3 {
  font-size: 16px;
  color: #555;
  margin-top: 16px;
}

.markdown-body p {
  margin: 12px 0;
}

.markdown-body code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
  color: #e83e8c;
}

.markdown-body pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
}

.markdown-body pre code {
  background: none;
  color: inherit;
  padding: 0;
}

.markdown-body ul, .markdown-body ol {
  padding-left: 24px;
  margin: 12px 0;
}

.markdown-body li {
  margin: 4px 0;
}

.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
}

.markdown-body th, .markdown-body td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.markdown-body th {
  background: #f5f5f5;
  font-weight: bold;
}

.markdown-body blockquote {
  border-left: 4px solid #667eea;
  padding: 8px 16px;
  margin: 12px 0;
  background: #f9f9ff;
  color: #666;
}

.markdown-body a {
  color: #667eea;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body strong {
  color: #333;
}

.markdown-body hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
}
```

---

## 6️⃣ 推送部署

```bash
git add .
git commit -m "添加教程展示页面"
git push origin main
```

GitHub Pages 也需要更新：
```powershell
$env:VITE_BASE_URL="/my-platform/"; npm run build; npx gh-pages -d dist
```

---

## 7️⃣ 测试

1. ✅ 点击底部"📚 教程"能看到教程列表
2. ✅ 点击某个步骤能显示教程内容
3. ✅ Markdown 格式正确渲染（标题、代码块、表格等）
4. ✅ 左侧列表有选中高亮效果

---

## 常见问题

**Q: 教程内容显示空白？**
A: 确认 `public/tutorials/` 文件夹里有 `.md` 文件。

**Q: 代码块没有高亮？**
A: 基础的 react-markdown 不支持语法高亮，如需高亮可以安装 `react-syntax-highlighter`。

**Q: 表格样式错乱？**
A: 确认 `App.css` 中添加了 `.markdown-body` 相关样式。

---

## 踩坑记录

| 问题 | 解决方案 |
|------|---------|
| 教程内容加载 404 | 确认文件在 `public/tutorials/` 目录下 |
| Markdown 没有样式 | 添加 `.markdown-body` CSS 样式 |
| 代码块太宽超出 | 添加 `overflow-x: auto` |
