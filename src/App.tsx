import { useState, useEffect } from 'react'
import { Layout, Menu, Typography, Card, Row, Col, Button, Avatar, Dropdown } from 'antd'
import {
  DashboardOutlined,
  RobotOutlined,
  CodeOutlined,
  BookOutlined,
  MessageOutlined,
  VideoCameraOutlined,
  ToolOutlined,
  AppstoreOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import './App.css'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 检查用户是否已登录
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null)
      setLoading(false)
    })

    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 退出登录
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserEmail(null)
  }

  // 登录成功回调
  const handleLogin = (email: string) => {
    setUserEmail(email)
  }

  // 侧边栏菜单项
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

  // 功能卡片数据
  const features = [
    { title: 'AI 助手', desc: '智能对话、文本生成、代码助手', icon: '🤖', color: '#722ed1' },
    { title: '在线编程', desc: '多语言代码编辑器、在线运行', icon: '💻', color: '#1890ff' },
    { title: '学习笔记', desc: 'Markdown笔记、知识管理', icon: '📖', color: '#52c41a' },
    { title: '实时聊天', desc: '文字聊天、文件分享', icon: '💬', color: '#fa8c16' },
    { title: '视频通话', desc: '面对面视频、屏幕共享', icon: '📹', color: '#eb2f96' },
    { title: '效率工具', desc: '计算器、待办、日历', icon: '🔧', color: '#13c2c2' },
  ]

  // 加载中
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 24
      }}>
        加载中...
      </div>
    )
  }

  // 未登录 → 显示登录页
  if (!userEmail) {
    return <Login onLogin={handleLogin} />
  }

  // 已登录 → 显示平台主页
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ background: '#001529' }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? 20 : 18,
          fontWeight: 'bold',
          borderBottom: '1px solid #333'
        }}>
          {collapsed ? '🚀' : '🚀 我的平台'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header style={{
          background: 'white',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          <Title level={4} style={{ margin: 0 }}>欢迎回来！</Title>
          <Dropdown menu={{
            items: [
              { key: 'email', label: userEmail, disabled: true },
              { type: 'divider' },
              { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, danger: true },
            ],
            onClick: ({ key }) => { if (key === 'logout') handleLogout() }
          }}>
            <Button type="text" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} style={{ background: '#722ed1' }} />
              <Text>{userEmail}</Text>
            </Button>
          </Dropdown>
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