import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Login from "./components/Login";
import ChatAI from "./components/ChatAI";
import "./App.css";
import CodeEditor from "./components/CodeEditor";
import Settings from "./components/Settings";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    // 检查当前登录状态
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 监听登录状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  // 渲染不同页面
  const renderPage = () => {
    switch (currentPage) {
      case "chat-ai":
        return <ChatAI />;
      case "code-editor":
        return <CodeEditor />;
      case "settings":
        return <Settings />;
      default:
        return (
          <div className="home-content">
            <h2>欢迎来到您的个人平台！</h2>
            <p>选择下方功能开始使用</p>
          </div>
        );
    }
  };

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
      <main className="main">{renderPage()}</main>

      {/* 底部导航栏 */}
      <nav className="bottom-nav">
        <div
          className={`nav-item ${currentPage === "home" ? "active" : ""}`}
          onClick={() => setCurrentPage("home")}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-text">首页</span>
        </div>
        <div
          className={`nav-item ${currentPage === "chat-ai" ? "active" : ""}`}
          onClick={() => setCurrentPage("chat-ai")}
        >
          <span className="nav-icon">🤖</span>
          <span className="nav-text">AI对话</span>
        </div>
        <div
          className={`nav-item ${currentPage === "code-editor" ? "active" : ""}`}
          onClick={() => setCurrentPage("code-editor")}
        >
          <span className="nav-icon">💻</span>
          <span className="nav-text">编程</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📝</span>
          <span className="nav-text">笔记</span>
        </div>
        <div
          className={`nav-item ${currentPage === "settings" ? "active" : ""}`}
          onClick={() => setCurrentPage("settings")}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">设置</span>
        </div>
      </nav>
    </div>
  );
}

export default App;
