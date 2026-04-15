import { useState, useRef, useEffect } from "react";

// AI 服务配置（修改这里就能切换模型）
const AI_MODEL = "qwen-turbo";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 检测是否在 GitHub Pages 上
  const isGitHubPages = window.location.hostname.includes("github.io");

  // 如果在 GitHub Pages，显示提示
  if (isGitHubPages) {
    return (
      <div
        style={{
          height: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>🤖</div>
        <h2 style={{ marginBottom: "16px", color: "#333" }}>AI 对话功能</h2>
        <p style={{ color: "#666", marginBottom: "24px", maxWidth: "400px" }}>
          GitHub Pages 不支持服务器端功能，AI 对话在此不可用。
        </p>
        <a
          href="https://my-platform87.netlify.app"
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          前往主站使用 AI 对话 →
        </a>
      </div>
    );
  }

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/.netlify/functions/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: AI_MODEL,
        }),
      });

      const data = await response.json();

      if (data.choices && data.choices[0]) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.choices[0].message.content,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error?.message || "AI 响应异常，请稍后重试");
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ 错误：${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        background: "#f5f5f5",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
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
        <span style={{ fontSize: "12px", opacity: 0.8, marginLeft: "8px" }}>
          🔍 联网搜索已开启
        </span>
      </div>

      {/* 消息区域 */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#999",
              marginTop: "100px",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
            <div>开始和 AI 聊天吧！</div>
            <div style={{ fontSize: "12px", marginTop: "8px" }}>
              模型：{AI_MODEL}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius: "16px",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "white",
                color: msg.role === "user" ? "white" : "#333",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "16px",
                background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <span className="loading-dots">AI 正在思考</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div
        style={{
          padding: "16px 20px",
          background: "white",
          borderTop: "1px solid #eee",
        }}
      >
        <div style={{ display: "flex", gap: "12px" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息...（Enter 发送，Shift+Enter 换行）"
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: "24px",
              fontSize: "14px",
              resize: "none",
              height: "48px",
              outline: "none",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: "12px 24px",
              background:
                loading || !input.trim()
                  ? "#ccc"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "24px",
              fontSize: "14px",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "发送中..." : "发送"}
          </button>
        </div>
      </div>
    </div>
  );
}
