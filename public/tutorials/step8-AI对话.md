# 第八步：添加AI对话功能

> **状态**：✅ 已完成
> **AI服务**：阿里百炼（qwen-turbo）
> **费用**：免费（每月100万tokens）
> **联网搜索**：✅ 已开启

---

## 目标

给平台添加一个AI对话功能，可以和AI聊天、问问题、学习知识。

## 为什么选阿里百炼？

| AI服务 | 国内访问 | 免费额度 |
|--------|---------|---------|
| Google AI | ❌ 打不开 | — |
| Groq | ❌ 打不开 | — |
| DeepSeek | ✅ 能访问 | 有免费额度 |
| **阿里百炼** | **✅ 能访问** | **每月100万tokens** |

---

## 准备工作

确保您已经在阿里百炼创建了 API Key：
1. 访问：https://bailian.console.aliyun.com
2. 点击左侧「API-KEY管理」
3. 创建一个 API Key 并复制保存

---

## 1️⃣ 添加百炼 API Key 到环境变量

1. 打开项目中的 **`.env`** 文件
2. 添加一行（替换成您自己的 API Key）：

```
VITE_BAILIAN_API_KEY=您的百炼API_Key
```

3. 完整的 `.env` 文件应该是这样：

```
VITE_SUPABASE_URL=您的Supabase_URL
VITE_SUPABASE_ANON_KEY=您的Supabase_密钥
VITE_BAILIAN_API_KEY=您的百炼API_Key
```

4. 按 `Ctrl + S` 保存

> **💡 为什么环境变量有的有 VITE_ 前缀，有的没有？**
>
> | 使用位置 | 环境变量名 | 原因 |
> |---------|-----------|------|
> | **前端代码**（浏览器） | `VITE_SUPABASE_URL` | Vite 只暴露 `VITE_` 开头的变量给前端 |
> | **服务器端代码**（Netlify Functions） | `BAILIAN_API_KEY` | Node.js 环境，直接用 `process.env` 访问 |
>
> **简单理解**：
> - `VITE_` 前缀 = 给浏览器看的（前端）
> - 无前缀 = 给服务器看的（后端）
>
> **安全考虑**：
> - Supabase 的 `anon key` 是公开的，可以放前端
> - 百炼 API Key 是私密密钥，**不能暴露给前端**，只能在服务器端使用

---

## 2️⃣ 创建 Netlify 函数目录

在项目根目录创建文件夹结构：

1. 在 **`my-platform`** 文件夹下，右键 → **New Folder**
2. 命名为 **`netlify`**
3. 在 `netlify` 文件夹内，再创建 **`functions`** 文件夹
4. 最终结构：`my-platform/netlify/functions/`

---

## 2️⃣½ 创建 Netlify 配置文件

在项目根目录创建 **`netlify.toml`** 文件：

1. 在 **`my-platform`** 文件夹下，右键 → **New File**
2. 命名为 **`netlify.toml`**
3. 粘贴以下内容：

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

4. 按 `Ctrl + S` 保存

> 💡 这个文件告诉 Netlify 你的函数在哪个目录、构建命令是什么。

---

## 3️⃣ 创建 AI 聊天函数

在 `netlify/functions/` 文件夹内创建文件 **`ai-chat.js`**：

```javascript
export default async (request, context) => {
  // 只允许 POST 请求
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { messages, model } = await request.json()

    // 调用阿里百炼 API
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BAILIAN_API_KEY}`
      },
      body: JSON.stringify({
        model: model || 'qwen-turbo',  // 优先使用前端传来的模型，默认 qwen-turbo
        messages: messages,
        enable_search: true  // 开启联网搜索，AI 可以获取最新信息
      })
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
```

> ⚠️ **重要**：Netlify Functions v2 必须使用 `(request, context)` 参数格式，返回 `new Response()` 对象。旧的 `handler(event)` 和 `{ statusCode, body }` 格式已不再支持！

---

## 4️⃣ 创建 AI 聊天组件

在 `src/components/` 文件夹内创建文件 **`ChatAI.tsx`**：

```tsx
import { useState, useRef, useEffect } from 'react'

// AI 服务配置（修改这里就能切换模型）
const AI_MODEL = 'qwen-turbo'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/.netlify/functions/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          model: AI_MODEL  // 动态传递模型名称
        })
      })

      const data = await response.json()

      if (data.choices && data.choices[0]) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.choices[0].message.content
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error?.message || 'AI 响应异常')
      }
    } catch (error: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ 错误：${error.message}`
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

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
        🤖 AI 智能助手
      </div>

      {/* 消息区域 */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '20px'
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: '#999',
            marginTop: '100px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <div>开始和 AI 聊天吧！</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>
              模型：{AI_MODEL}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '16px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'white',
              color: msg.role === 'user' ? 'white' : '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', wordBreak: 'break-word' }}>{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '16px',
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <span className="loading-dots">AI 正在思考</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div style={{
        padding: '16px 20px',
        background: 'white',
        borderTop: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息...（Enter 发送，Shift+Enter 换行）"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '24px',
              fontSize: '14px',
              resize: 'none',
              height: '48px',
              outline: 'none'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 24px',
              background: loading || !input.trim()
                ? '#ccc'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '24px',
              fontSize: '14px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '发送中...' : '发送'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

---

## 5️⃣ 更新 App.tsx 添加导航

打开 **`src/App.tsx`**，修改为：

```tsx
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import ChatAI from './components/ChatAI'
import './App.css'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    // 检查当前登录状态
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">加载中...</div>
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={() => {}} />
  }

  // 渲染不同页面
  const renderPage = () => {
    switch (currentPage) {
      case 'chat-ai':
        return <ChatAI />
      default:
        return (
          <div className="home-content">
            <h2>欢迎来到您的个人平台！</h2>
            <p>选择下方功能开始使用</p>
          </div>
        )
    }
  }

  return (
    <div className="app">
      {/* 顶部导航栏 */}
      <header className="header">
        <div className="header-left">
          <span className="logo">🌟 我的平台</span>
        </div>
        <div className="header-right">
          <span className="user-info">{user.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            退出登录
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="main">
        {renderPage()}
      </main>

      {/* 底部导航栏 */}
      <nav className="bottom-nav">
        <div
          className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-text">首页</span>
        </div>
        <div
          className={`nav-item ${currentPage === 'chat-ai' ? 'active' : ''}`}
          onClick={() => setCurrentPage('chat-ai')}
        >
          <span className="nav-icon">🤖</span>
          <span className="nav-text">AI对话</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">💻</span>
          <span className="nav-text">编程</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📝</span>
          <span className="nav-text">笔记</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">设置</span>
        </div>
      </nav>
    </div>
  )
}

export default App
```

---

## 5️⃣½ 更新 App.css 添加底部导航样式

打开 **`src/App.css`**，**全选删除**，替换为：

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f5f5;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  font-size: 14px;
  opacity: 0.9;
}

.logout-btn {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 主内容区 */
.main {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.home-content {
  text-align: center;
  padding-top: 60px;
}

.home-content h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 12px;
}

.home-content p {
  color: #666;
  font-size: 14px;
}

/* 底部导航栏 */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  background: white;
  border-top: 1px solid #eee;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
  border-radius: 8px;
}

.nav-item:hover {
  background: #f5f5f5;
  color: #667eea;
}

.nav-item.active {
  color: #667eea;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 4px;
  transition: transform 0.3s;
}

.nav-text {
  font-size: 12px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loading {
  font-size: 18px;
  color: #666;
}
```

按 `Ctrl + S` 保存。

---

## 6️⃣ 本地测试

在命令行运行：

```bash
npm run dev
```

打开 http://localhost:5173，测试：
1. ✅ 能看到底部导航栏
2. ✅ 点击"AI对话"能进入聊天页面
3. ✅ 能发送消息并收到 AI 回复

---

## 7️⃣ 部署到 Netlify

### 添加环境变量

1. 打开 Netlify 控制台：https://app.netlify.com
2. 选择您的站点
3. 点击 **Site configuration** → **Environment variables**
4. 点击 **Add a variable**，添加：

| Key | Value |
|-----|-------|
| `BAILIAN_API_KEY` | 您的百炼 API Key |

⚠️ **注意**：这里用 `BAILIAN_API_KEY`（没有 VITE_ 前缀），因为是在服务器端使用。

### 推送代码

```bash
git add .
git commit -m "添加AI对话功能"
git push origin main
```

Netlify 会自动重新部署！

---

## 8️⃣ 验证

打开您的网站 https://my-platform87.netlify.app，测试：
1. ✅ 登录后能看到底部导航
2. ✅ 点击"AI对话"进入聊天页面
3. ✅ 能发送消息并收到 AI 回复

---

## 常见问题

**Q: 本地测试 AI 不回复？**
A: 检查 `.env` 文件中的 `VITE_BAILIAN_API_KEY` 是否正确。

**Q: 部署后 AI 不回复？**
A: 检查 Netlify 环境变量 `BAILIAN_API_KEY` 是否已添加。

**Q: 报错 "fetch failed"？**
A: 可能是网络问题或 API Key 无效，检查控制台错误信息。

**Q: AI 回复很慢？**
A: 正常现象，AI 模型需要处理时间，耐心等待。

---

## 踩坑记录

| 问题 | 解决方案 |
|------|---------|
| 本地 AI 不回复 | 检查 .env 里的 API Key |
| 部署后 AI 不回复 | Netlify 要添加 BAILIAN_API_KEY 环境变量 |
| 环境变量名称错误 | 本地用 VITE_ 前缀，服务器端不用 |
| NetlifyUserError: Function returned unsupported value | 函数要用 `return new Response()` 格式，不是 `{ statusCode, body }` |
| Method not allowed | Netlify Functions v2 用 `(request, context)` 参数，不是 `handler(event)` |
| 本地 netlify dev 无法测试 | 直接部署到线上测试，或配置 netlify.toml |

---

## Netlify Functions 正确格式

```javascript
// ✅ 正确格式（Netlify Functions v2）
export default async (request, context) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { messages } = await request.json()
  // ... 处理逻辑

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

```javascript
// ❌ 错误格式（旧版 Lambda 格式，不再支持）
export default async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: '...' }) }
  }
  const { messages } = JSON.parse(event.body)
  return { statusCode: 200, body: JSON.stringify(data) }
}
```

---

## 下一步

AI 对话功能完成后，继续 **第九步：添加在线编程功能**！
