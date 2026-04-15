import { useState, useEffect } from "react";
import Markdown from "react-markdown";

interface TutorialItem {
  id: string;
  title: string;
  file: string;
  status: "done" | "wip" | "todo";
}

const tutorials: TutorialItem[] = [
  { id: "readme", title: "项目总览", file: "README.md", status: "done" },
  { id: "1", title: "安装必备软件", file: "step1-安装软件.md", status: "done" },
  {
    id: "2",
    title: "注册云服务账号",
    file: "step2-注册账号.md",
    status: "done",
  },
  { id: "3", title: "创建项目", file: "step3-创建项目.md", status: "done" },
  {
    id: "4",
    title: "配置 Supabase",
    file: "step4-配置Supabase.md",
    status: "done",
  },
  { id: "5", title: "创建平台首页", file: "step5-平台首页.md", status: "done" },
  { id: "6", title: "实现用户登录", file: "step6-用户登录.md", status: "done" },
  { id: "7", title: "部署上线", file: "step7-部署上线.md", status: "done" },
  { id: "8", title: "添加AI对话功能", file: "step8-AI对话.md", status: "done" },
  {
    id: "8b",
    title: "双部署 GitHub Pages",
    file: "step8-补充-双部署.md",
    status: "done",
  },
  {
    id: "9",
    title: "免费联网搜索",
    file: "step9-免费联网搜索.md",
    status: "done",
  },
  {
    id: "10",
    title: "在线编程功能",
    file: "step10-在线编程.md",
    status: "done",
  },
  { id: "traps", title: "踩坑记录", file: "踩坑记录.md", status: "done" },
];

export default function Tutorial() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedId) {
      setContent("");
      return;
    }

    const item = tutorials.find((t) => t.id === selectedId);
    if (!item) return;

    setLoading(true);
    fetch(`/tutorials/${item.file}`)
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch(() => setContent("加载失败，请稍后重试"))
      .finally(() => setLoading(false));
  }, [selectedId]);

  return (
    <div
      style={{
        height: "100%",
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
        📚 搭建教程
      </div>

      {/* 主内容区 */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* 左侧：教程列表 */}
        <div
          style={{
            width: "260px",
            background: "white",
            borderRight: "1px solid #eee",
            overflow: "auto",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              fontWeight: "bold",
              color: "#333",
              fontSize: "14px",
            }}
          >
            目录
          </div>
          {tutorials.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "14px",
                color: selectedId === item.id ? "#667eea" : "#333",
                background: selectedId === item.id ? "#f0f0ff" : "transparent",
                borderLeft:
                  selectedId === item.id
                    ? "3px solid #667eea"
                    : "3px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>
                {item.status === "done"
                  ? "✅"
                  : item.status === "wip"
                    ? "🔴"
                    : "⬜"}
              </span>
              <span>{item.title}</span>
            </div>
          ))}
        </div>

        {/* 右侧：教程内容 */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: selectedId ? "24px" : "0",
            background: "white",
          }}
        >
          {!selectedId ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📖</div>
              <p>选择左侧的步骤查看教程</p>
            </div>
          ) : loading ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#999" }}
            >
              加载中...
            </div>
          ) : (
            <div
              className="markdown-body"
              style={{
                maxWidth: "800px",
                lineHeight: "1.8",
                color: "#333",
              }}
            >
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
