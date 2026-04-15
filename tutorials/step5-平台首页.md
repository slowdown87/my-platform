# 第五步：创建平台首页

> **状态**：✅ 已完成
> **完成时间**：2026年4月13日
> **预计时间**：15分钟

---

## 目标

把默认的 React 页面改造成平台首页，包含左侧导航栏和功能卡片。

---

## 1️⃣ 替换主页面代码

1. 在 VS Code 中打开 **`src/App.tsx`**
2. **全选**（`Ctrl + A`）→ **删除**（`Delete`）
3. 粘贴以下代码：

```tsx
import { useState } from 'react'
import { Layout, Menu, Typography, Card, Row, Col } from 'antd'
import {
  DashboardOutlined,
  RobotOutlined,
  CodeOutlined,
  BookOutlined,
  MessageOutlined,
  VideoCameraOutlined,
  ToolOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import './App.css'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

function App() {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: '首页' },
    { key: 'ai', icon: <RobotOutlined />, label: 'AI 助手' },
    { key: 'code', icon: <CodeOutlined />, label: '在线编程' },
    { key: 'notes', icon: <BookOutlined />, label: '学习笔记' },
    { key: 'chat', icon: <MessageOutlined />, label: '实时聊天' },
    { key: 'video', icon: <VideoCameraOutlined />, label: '视频通话' },
    { key: 'tools', icon: <ToolOutlined />, label: '效率工具' },
    { key: 'entertainment', icon: <AppstoreOutlined />, label: '娱乐中心' },
  ]

  const features = [
    { title: 'AI 助手', desc: '智能对话、文本生成、代码助手', icon: '🤖', color: '#722ed1' },
    { title: '在线编程', desc: '多语言代码编辑器、在线运行', icon: '💻', color: '#1890ff' },
    { title: '学习笔记', desc: 'Markdown笔记、知识管理', icon: '📖', color: '#52c41a' },
    { title: '实时聊天', desc: '文字聊天、文件分享', icon: '💬', color: '#fa8c16' },
    { title: '视频通话', desc: '面对面视频、屏幕共享', icon: '📹', color: '#eb2f96' },
    { title: '效率工具', desc: '计算器、待办、日历', icon: '🔧', color: '#13c2c2' },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} style={{ background: '#001529' }}>
        <div style={{
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: collapsed ? 20 : 18, fontWeight: 'bold', borderBottom: '1px solid #333'
        }}>
          {collapsed ? '🚀' : '🚀 我的平台'}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']} items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{
          background: 'white', padding: '0 24px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          <Title level={4} style={{ margin: 0 }}>欢迎来到我的全功能平台</Title>
          <Text type="secondary">v1.0</Text>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#f5f5f5', borderRadius: 8 }}>
          <Title level={3} style={{ marginBottom: 24 }}>功能中心</Title>
          <Row gutter={[16, 16]}>
            {features.map((feature) => (
              <Col xs={24} sm={12} md={8} key={feature.title}>
                <Card hoverable style={{ height: '100%', borderRadius: 12 }} bodyStyle={{ padding: 24 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{feature.icon}</div>
                  <Title level={5} style={{ marginBottom: 8 }}>{feature.title}</Title>
                  <Text type="secondary">{feature.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
```

4. 按 `Ctrl + S` 保存

---

## 2️⃣ 替换样式文件

1. 打开 **`src/App.css`**
2. **全选删除**所有内容
3. 粘贴以下内容：

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.ant-card-hoverable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}
```

4. 按 `Ctrl + S` 保存

---

## 3️⃣ 查看效果

```bash
npm run dev
```

打开 **http://localhost:5173**，您应该看到：
- ✅ 左侧深色导航栏（8个功能菜单）
- ✅ 顶部"欢迎来到我的全功能平台"
- ✅ 6个功能卡片（AI助手、在线编程、学习笔记、实时聊天、视频通话、效率工具）

---

## 完成检查清单

| 任务 | 状态 |
|------|------|
| 替换了 src/App.tsx | ✅ |
| 替换了 src/App.css | ✅ |
| 能看到带导航栏的平台首页 | ✅ |
