import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        }),
      });

      const data = await response.json();

      // 调试：把完整返回显示在页面上
      if (!data.choices || !data.choices[0]) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `🔍 调试信息：${JSON.stringify(data)}`,
          },
        ]);
        setLoading(false);
        return;
      }

      if (data.choices && data.choices[0]) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.choices[0].message.content,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error?.message || "AI 响应异常");
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
              模型：qwen2.5-omni-7b
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
