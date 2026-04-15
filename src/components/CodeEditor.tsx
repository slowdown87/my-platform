import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  const [html, setHtml] = useState(
    '<div class="container">\n  <h1>Hello World! 🌍</h1>\n  <p>在这里写代码试试</p>\n  <button onclick="alert(\'你好！\')">点我</button>\n</div>',
  );
  const [css, setCss] = useState(
    ".container {\n  text-align: center;\n  padding: 40px;\n  font-family: sans-serif;\n}\n\nh1 {\n  color: #667eea;\n}\n\nbutton {\n  padding: 10px 24px;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 16px;\n  cursor: pointer;\n  margin-top: 16px;\n}\n\nbutton:hover {\n  opacity: 0.9;\n}",
  );
  const [js, setJs] = useState(
    '// 在这里写 JavaScript\nconsole.log("Hello World!")',
  );
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");

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
</html>`;
  };

  const handleClear = () => {
    if (activeTab === "html") setHtml("");
    else if (activeTab === "css") setCss("");
    else setJs("");
  };

  const tabs = [
    { key: "html" as const, label: "HTML", color: "#e44d26" },
    { key: "css" as const, label: "CSS", color: "#264de4" },
    { key: "js" as const, label: "JS", color: "#f0db4f" },
  ];

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
        💻 在线编程
      </div>

      {/* 主内容区：左右分栏 */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* 左侧：代码编辑区 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #ddd",
          }}
        >
          {/* 标签切换 */}
          <div style={{ display: "flex", background: "#2d2d2d" }}>
            {tabs.map((tab) => (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "8px 20px",
                  color: activeTab === tab.key ? tab.color : "#999",
                  background: activeTab === tab.key ? "#1e1e1e" : "transparent",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: activeTab === tab.key ? "bold" : "normal",
                  borderRight: "1px solid #444",
                }}
              >
                {tab.label}
              </div>
            ))}
            <div style={{ flex: 1 }} />
            <button
              onClick={handleClear}
              style={{
                padding: "6px 12px",
                margin: "4px 8px",
                background: "transparent",
                border: "1px solid #555",
                borderRadius: "4px",
                color: "#999",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              清空
            </button>
          </div>

          {/* 编辑器 */}
          <div style={{ flex: 1 }}>
            {activeTab === "html" && (
              <Editor
                height="100%"
                language="html"
                theme="vs-dark"
                value={html}
                onChange={(value) => setHtml(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  automaticLayout: true,
                }}
              />
            )}
            {activeTab === "css" && (
              <Editor
                height="100%"
                language="css"
                theme="vs-dark"
                value={css}
                onChange={(value) => setCss(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  automaticLayout: true,
                }}
              />
            )}
            {activeTab === "js" && (
              <Editor
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={js}
                onChange={(value) => setJs(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  automaticLayout: true,
                }}
              />
            )}
          </div>
        </div>

        {/* 右侧：实时预览区 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "white",
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              background: "#f0f0f0",
              borderBottom: "1px solid #ddd",
              fontSize: "13px",
              color: "#666",
              fontWeight: "bold",
            }}
          >
            📺 实时预览
          </div>
          <iframe
            srcDoc={getPreviewContent()}
            title="preview"
            sandbox="allow-scripts"
            style={{
              flex: 1,
              border: "none",
              width: "100%",
              background: "white",
            }}
          />
        </div>
      </div>
    </div>
  );
}
