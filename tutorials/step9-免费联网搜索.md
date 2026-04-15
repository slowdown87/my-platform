# 第九步：免费联网搜索（Tavily + 百炼）

> **状态**：🔴 待实操
> **搜索服务**：Tavily（每月 1000 次免费）
> **AI 服务**：阿里百炼 qwen-turbo（免费额度）
> **总费用**：完全免费

---

## 目标

实现 AI 联网搜索功能，**搜索和对话都免费**：

```
用户提问 → Tavily 搜索（免费1000次/月）→ 获取网页结果 → 百炼 AI 总结回答（免费）
```

---

## 为什么选 Tavily？

| 搜索 API | 免费额度 | 需要绑卡 | 国内可用 | 专为 AI 设计 |
|----------|---------|---------|---------|------------|
| **Tavily** | **1000次/月** | **不需要** | **✅** | **✅** |
| Brave Search | 2000次/月 | 需要 | ✅ | ❌ |
| SerpAPI | 100次/月 | 不需要 | ⚠️ | ❌ |
| 百炼 enable_search | ¥0.003/次 | — | ✅ | ✅ |

**Tavily 优势**：
- 注册就能用，不需要绑信用卡
- 专门为 AI Agent 设计，返回结构化结果
- 每月 1000 次免费，个人使用完全够

---

## 1️⃣ 注册 Tavily 获取 API Key

1. 打开浏览器，访问：**https://tavily.com**
2. 点击 **"Sign Up"**（注册）
3. 用邮箱或 Google/GitHub 账号注册
4. 登录后，点击左侧 **"API Keys"**
5. 点击 **"Create API Key"**
6. 复制生成的 API Key（格式类似 `tvly-xxxxxxxxxx`）

> ⚠️ 如果 https://tavily.com 打不开，试试 https://app.tavily.com

---

## 2️⃣ 添加 Tavily API Key 到环境变量

### 本地 .env 文件

打开 `.env` 文件，添加一行：

```
VITE_TAVILY_API_KEY=您的Tavily_API_Key
TAVILY_API_KEY=您的Tavily_API_Key
```

完整的 `.env` 文件：

```
VITE_SUPABASE_URL=您的Supabase_URL
VITE_SUPABASE_ANON_KEY=您的Supabase_密钥
VITE_BAILIAN_API_KEY=您的百炼API_Key
BAILIAN_API_KEY=您的百炼API_Key
VITE_BASE_URL=/
VITE_TAVILY_API_KEY=tvly-xxxxxxxxxx
TAVILY_API_KEY=tvly-xxxxxxxxxx
```

### Netlify 环境变量

1. 打开 https://app.netlify.com
2. 选择您的站点 → **Site configuration** → **Environment variables**
3. 点击 **Add a variable**，添加：

| Key | Value |
|-----|-------|
| `TAVILY_API_KEY` | `tvly-xxxxxxxxxx`（您的 Tavily API Key） |

---

## 3️⃣ 更新 ai-chat.js

打开 `netlify/functions/ai-chat.js`，**全部替换为**：

```javascript
export default async (request, context) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { messages, model, search } = await request.json()

    // 获取用户最新的问题
    const userMessage = messages.filter(m => m.role === 'user').pop()?.content || ''

    // 第一步：用 Tavily 搜索最新信息（仅当用户开启搜索时）
    let searchResults = null
    if (search !== false) {
      try {
      const tavilyResponse = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: userMessage,
          max_results: 3,
          include_answer: true
        })
      })
      searchResults = await tavilyResponse.json()
      } catch (searchError) {
        // 搜索失败不影响对话，继续使用 AI 自身知识
        console.log('搜索失败，使用 AI 自身知识:', searchError.message)
      }
    }

    // 第二步：构建带搜索结果的提示词
    let enhancedMessages = [...messages]

    if (searchResults && searchResults.results && searchResults.results.length > 0) {
      // 有搜索结果，把结果附加到系统提示中
      const searchContext = searchResults.results.map((r, i) =>
        `[${i + 1}] ${r.title}\n${r.content}\n来源: ${r.url}`
      ).join('\n\n')

      const systemMessage = {
        role: 'system',
        content: `你是一个有帮助的AI助手。你刚刚通过搜索工具获取了以下最新的互联网信息。请**直接根据这些搜索结果**回答用户的问题，不要说"无法访问互联网"或"无法获取最新信息"。

搜索结果：
${searchContext}

要求：
1. 直接基于搜索结果回答，不要声称无法上网
2. 用中文回答
3. 在回答末尾列出参考来源`
      }

      // 把系统消息放在最前面
      enhancedMessages = [systemMessage, ...messages]
    }

    // 第三步：调用百炼 AI 生成回答
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BAILIAN_API_KEY}`
      },
      body: JSON.stringify({
        model: model || 'qwen-turbo',
        messages: enhancedMessages,
        enable_search: false  // 关闭百炼自带的联网搜索（用 Tavily 代替，省钱）
      })
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message || 'API 调用失败')
    }

    // 第四步：如果 AI 回答中没有参考来源，则自动附加
    let finalContent = data.choices[0].message.content

    if (searchResults && searchResults.results && searchResults.results.length > 0) {
      // 检查 AI 是否已经在回答中包含了来源，避免重复
      if (!finalContent.includes('参考来源') && !finalContent.includes('来源')) {
        const sources = searchResults.results.map(r =>
          `- [${r.title}](${r.url})`
        ).join('\n')
        finalContent += '\n\n---\n📚 **参考来源**：\n' + sources
      }
    }

    // 返回修改后的结果
    data.choices[0].message.content = finalContent

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

---

## 4️⃣ 更新 ChatAI.tsx 添加搜索开关

打开 `src/components/ChatAI.tsx`，做以下修改：

### 4.1 添加搜索开关状态

找到：
```tsx
const [loading, setLoading] = useState(false)
```

在它后面加一行：
```tsx
const [searchEnabled, setSearchEnabled] = useState(true)
```

### 4.2 修改 sendMessage 传递开关状态

找到 `body: JSON.stringify({` 部分，添加 `search` 参数：
```tsx
body: JSON.stringify({
  messages: [...messages, userMessage].map(m => ({
    role: m.role,
    content: m.content
  })),
  model: AI_MODEL,
  search: searchEnabled
})
```

### 4.3 在标题栏添加开关按钮

找到标题栏部分：
```tsx
{/* 标题栏 */}
      <div
        style={{
          padding: "16px 20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        🤖 AI 智能助手
      </div>
```

替换为：
```tsx
{/* 标题栏 */}
      <div
        style={{
          padding: "16px 20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>🤖 AI 智能助手</span>
        <div
          onClick={() => setSearchEnabled(!searchEnabled)}
          style={{
            fontSize: "13px",
            opacity: 0.9,
            cursor: "pointer",
            padding: "4px 10px",
            borderRadius: "12px",
            background: searchEnabled ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
          }}
        >
          {searchEnabled ? "🔍 联网搜索 ON" : "🧠 纯AI模式"}
        </div>
      </div>
```

### 效果

| 模式 | 显示 | 行为 |
|------|------|------|
| **🔍 联网搜索 ON** | 白色高亮背景 | 先搜索再回答，适合问时事、天气、新闻 |
| **🧠 纯AI模式** | 暗色背景 | 直接用 AI 知识回答，适合问数学、编程、知识 |

点击标题栏右侧即可切换！

---

## 5️⃣ 推送部署

```bash
git add .
git commit -m "添加Tavily免费联网搜索功能"
git push origin main
```

等 Netlify 自动部署完成后测试。

---

## 6️⃣ 测试

打开 https://my-platform87.netlify.app ，登录后进入 AI 对话，试试这些问题：

- "今天有什么新闻？"
- "最新的 AI 模型有哪些？"
- "北京明天天气怎么样？"

如果搜索成功，AI 回答底部会显示 **📚 参考来源** 链接。

---

## 工作原理

```
┌─────────────────────────────────────────────────────────┐
│                    用户提问                               │
│              "今天有什么新闻？"                            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Tavily 搜索（免费）                          │
│         搜索互联网，获取最新网页结果                        │
│         返回：标题 + 摘要 + 链接                           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│           百炼 AI 回答（免费）                             │
│    把搜索结果 + 用户问题一起发给 AI                        │
│    AI 基于搜索结果生成回答，并标注来源                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  返回给用户                               │
│   AI 回答内容 + 📚 参考来源链接                           │
└─────────────────────────────────────────────────────────┘
```

---

## 费用说明

| 服务 | 费用 | 免费额度 |
|------|------|---------|
| Tavily 搜索 | 免费 | 1000 次/月 |
| 百炼 AI 对话 | 免费 | 100 万 tokens/月 |
| **总计** | **免费** | 日常使用完全够 |

> 💡 每月 1000 次搜索，平均每天 33 次，个人使用绑绑有余。

---

## 常见问题

**Q: Tavily 搜索失败怎么办？**
A: 代码已做了容错处理。搜索失败时，AI 会使用自身知识回答，不影响正常对话。

**Q: 搜索结果不准确？**
A: Tavily 返回 3 条结果，AI 会综合判断。可以修改 `max_results: 3` 为 `5` 获取更多结果。

**Q: 想关闭联网搜索？**
A: 在 Netlify 环境变量中删除 `TAVILY_API_KEY`，或将其值清空即可。

**Q: Tavily 注册不了？**
A: 如果 tavily.com 打不开，试试 app.tavily.com，或者用 VPN 注册后拿到 Key 就行，后续 API 调用国内直连。

---

## 踩坑记录

| 问题 | 解决方案 |
|------|---------|
| Tavily 网站打不开 | 试试 app.tavily.com 或用 VPN 注册 |
| 搜索结果为空 | 检查 TAVILY_API_KEY 是否正确配置 |
| AI 回答没有来源链接 | 检查 Tavily 是否返回了 results |
| 百炼还是收费 | 确认 enable_search 已设为 false |
