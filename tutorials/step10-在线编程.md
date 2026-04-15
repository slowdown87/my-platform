# 第十步：在线编程功能

> **状态**：🔴 待实操
> **编辑器**：Monaco Editor（VS Code 同款）
> **费用**：完全免费

---

## 目标

在平台中添加一个在线编程页面，可以：
- 写 HTML/CSS/JavaScript 代码
- 实时预览效果
- 支持 HTML + CSS + JS 三种语言

```
┌─────────────────────────────────────────────────┐
│  💻 在线编程                                     │
├──────────────────────┬──────────────────────────┤
│                      │                          │
│   代码编辑区          │     实时预览区            │
│   (Monaco Editor)    │     (iframe)             │
│                      │                          │
│                      │                          │
├──────────────────────┴──────────────────────────┤
│  [HTML] [CSS] [JS]   [运行] [清空]              │
└─────────────────────────────────────────────────┘
```

---

## 1️⃣ 安装 Monaco Editor

Monaco Editor 是 VS Code 的编辑器内核，支持语法高亮、代码提示。

在终端运行：

```bash
npm install @monaco-editor/react
```

---

## 2️⃣ 创建在线编程组件

在 `src/components/` 文件夹内创建文件 **`CodeEditor.tsx`**：

```tsx
import { useState } from 'react'
import Editor from '@monaco-editor/react'

export default function CodeEditor() {
  const [html, setHtml] = useState('<div class="container">\n  <h1>Hello World! 🌍</h1>\n  <p>在这里写代码试试</p>\n  <button onclick="alert(\'你好！\')">点我</button>\n</div>')
  const [css, setCss] = useState('.container {\n  text-align: center;\n  padding: 40px;\n  font-family: sans-serif;\n}\n\nh1 {\n  color: #667eea;\n}\n\nbutton {\n  padding: 10px 24px;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 16px;\n  cursor: pointer;\n  margin-top: 16px;\n}\n\nbutton:hover {\n  opacity: 0.9;\n}')
  const [js, setJs] = useState('// 在这里写 JavaScript\nconsole.log("Hello World!")')
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html')

  // 生成预览页面的完整 HTML
  const getPreviewContent = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>${js}<\/script>
</body>
</html>`
  }

  const handleClear = () => {
    if (activeTab === 'html') setHtml('')
    else if (activeTab === 'css') setCss('')
    else setJs('')
  }

  const tabs = [
    { key: 'html' as const, label: 'HTML', color: '#e44d26' },
    { key: 'css' as const, label: 'CSS', color: '#264de4' },
    { key: 'js' as const, label: 'JS', color: '#f0db4f' },
  ]

  return (
    <div style={{
      height: 'calc(100vh - 120px)',
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
        💻 在线编程
      </div>

      {/* 主内容区：左右分栏 */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 左侧：代码编辑区 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #ddd' }}>
          {/* 标签切换 */}
          <div style={{ display: 'flex', background: '#2d2d2d' }}>
            {tabs.map(tab => (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '8px 20px',
                  color: activeTab === tab.key ? tab.color : '#999',
                  background: activeTab === tab.key ? '#1e1e1e' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                  borderRight: '1px solid #444'
                }}
              >
                {tab.label}
              </div>
            ))}
            <div style={{ flex: 1 }} />
            <button
              onClick={handleClear}
              style={{
                padding: '6px 12px',
                margin: '4px 8px',
                background: 'transparent',
                border: '1px solid #555',
                borderRadius: '4px',
                color: '#999',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              清空
            </button>
          </div>

          {/* 编辑器 */}
          <div style={{ flex: 1 }}>
            {activeTab === 'html' && (
              <Editor
                height="100%"
                language="html"
                theme="vs-dark"
                value={html}
                onChange={(value) => setHtml(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            )}
            {activeTab === 'css' && (
              <Editor
                height="100%"
                language="css"
                theme="vs-dark"
                value={css}
                onChange={(value) => setCss(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            )}
            {activeTab === 'js' && (
              <Editor
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={js}
                onChange={(value) => setJs(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            )}
          </div>
        </div>

        {/* 右侧：实时预览区 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
          <div style={{
            padding: '8px 16px',
            background: '#f0f0f0',
            borderBottom: '1px solid #ddd',
            fontSize: '13px',
            color: '#666',
            fontWeight: 'bold'
          }}>
            📺 实时预览
          </div>
          <iframe
            srcDoc={getPreviewContent()}
            title="preview"
            sandbox="allow-scripts"
            style={{
              flex: 1,
              border: 'none',
              width: '100%',
              background: 'white'
            }}
          />
        </div>
      </div>
    </div>
  )
}
```

---

## 3️⃣ 更新 App.tsx 添加编程页面

打开 `src/App.tsx`，做以下修改：

### 3.1 添加导入

在文件顶部找到其他 import 的地方，添加：
```tsx
import CodeEditor from './components/CodeEditor'
```

### 3.2 添加页面路由

在 `renderPage` 函数中添加 case：
```tsx
const renderPage = () => {
  switch (currentPage) {
    case 'chat-ai':
      return <ChatAI />
    case 'code-editor':
      return <CodeEditor />
    case 'settings':
      return <Settings />
    default:
      return (
        <div className="home-content">
          <h2>欢迎来到您的个人平台！</h2>
          <p>选择下方功能开始使用</p>
        </div>
      )
  }
}
```

### 3.3 更新底部导航栏的编程按钮

找到底部导航栏中的编程项：
```tsx
<div className="nav-item">
  <span className="nav-icon">💻</span>
  <span className="nav-text">编程</span>
</div>
```

替换为（添加点击事件）：
```tsx
<div
  className={`nav-item ${currentPage === 'code-editor' ? 'active' : ''}`}
  onClick={() => setCurrentPage('code-editor')}
>
  <span className="nav-icon">💻</span>
  <span className="nav-text">编程</span>
</div>
```

---

## 4️⃣ 推送部署

```bash
git add .
git commit -m "添加在线编程功能"
git push origin main
```

---

## 5️⃣ 测试

打开 https://my-platform87.netlify.app ，点击底部导航的"💻 编程"：

1. ✅ 能看到代码编辑器（VS Code 风格）
2. ✅ 能切换 HTML / CSS / JS 标签
3. ✅ 右侧实时预览效果
4. ✅ 修改代码后预览自动更新
5. ✅ 清空按钮能清空当前标签的代码

---

## 功能说明

| 功能 | 说明 |
|------|------|
| **语法高亮** | HTML/CSS/JS 三种语言自动识别 |
| **实时预览** | 代码修改后右侧立即更新 |
| **代码提示** | 输入时自动弹出代码补全 |
| **清空** | 清空当前标签的代码 |
| **暗色主题** | 编辑器使用 VS Code 暗色主题 |

---

## 常见问题

**Q: 编辑器加载很慢？**
A: Monaco Editor 首次加载需要下载语言包，之后会缓存。可以耐心等待几秒。

**Q: 预览区空白？**
A: 检查 HTML 代码是否有语法错误。

**Q: CSS 没有生效？**
A: 确认选择的是 CSS 标签，不是 HTML 标签。

**Q: JavaScript 报错？**
A: 按 F12 打开预览区的控制台查看错误信息。

---

## 踩坑记录

| 问题 | 解决方案 |
|------|---------|
| Monaco Editor 加载慢 | 首次加载正常，之后会缓存 |
| iframe 预览不更新 | 检查 srcDoc 是否正确拼接 |
| 代码没有语法高亮 | 确认 language 属性设置正确 |
