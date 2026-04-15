# 第六步：实现用户登录功能

> **状态**：✅ 已完成
> **完成时间**：2026年4月13日

---

## 目标

实现用户注册和登录功能。未登录用户看到登录页，登录后才能进入平台。

---

## 🅰 第一部分：配置 Supabase（浏览器操作）

### 1️⃣ 关闭邮箱验证（方便测试）

> ⚠️ **注意**：不是在 Email 模板页面！是在 Sign In / Providers 页面！

**正确路径：**
1. 打开 **https://supabase.com/dashboard**，进入您的项目
2. 左侧菜单找到 **Authentication** → **CONFIGURATION** 区域
3. 点击 **"Sign In / Providers"**
4. 在 **"User Signups"** 区域找到 **"Confirm email"** 开关
5. 确保它是**关闭的**（灰色 = 关闭，绿色 = 开启）
6. 点击底部的 **"Save changes"**

**❌ 常见误区：**
- 不要去 `Notifications → Email → Confirm sign up`（那是编辑邮件模板的，不是开关）
- 正确位置在 `Configuration → Sign In / Providers → User Signups → Confirm email`

### 2️⃣ 设置允许的跳转地址

1. 左侧菜单点击 **Authentication** → **URL Configuration**
2. 找到 **"Redirect URLs"**
3. 添加：`http://localhost:5173`
4. 点击 **Save**

---

## 🅱 第二部分：写代码（VS Code 操作）

### 3️⃣ 创建登录页面组件

1. 在 VS Code，右键点击 `src` 文件夹 → **New Folder** → 命名 `components`
2. 右键点击 `components` → **New File** → 命名 `Login.tsx`
3. 粘贴以下代码：

```tsx
import { useState } from 'react'
import { Card, Input, Button, Typography, Tabs, message } from 'antd'
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { supabase } from '../lib/supabase'

const { Title, Text } = Typography

interface LoginProps {
  onLogin: (email: string) => void
}

function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false)
  const [registerData, setRegisterData] = useState({ email: '', password: '', username: '' })
  const [loginData, setLoginData] = useState({ email: '', password: '' })

  // 注册
  const handleRegister = async () => {
    if (!registerData.email || !registerData.password || !registerData.username) {
      message.error('请填写所有字段')
      return
    }
    if (registerData.password.length < 6) {
      message.error('密码至少6位')
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: { username: registerData.username }
        }
      })
      if (error) throw error
      message.success('注册成功！请登录')
      setLoginData({ email: registerData.email, password: '' })
    } catch (err: any) {
      message.error(err.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  // 登录
  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      message.error('请填写邮箱和密码')
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      })
      if (error) throw error
      message.success('登录成功！')
      if (data.user?.email) onLogin(data.user.email)
    } catch (err: any) {
      message.error(err.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  const tabItems = [
    {
      key: 'login',
      label: '登录',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input prefix={<MailOutlined />} placeholder="邮箱" size="large"
            value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} />
          <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large"
            value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })}
            onPressEnter={handleLogin} />
          <Button type="primary" size="large" loading={loading} onClick={handleLogin} style={{ height: 48 }}>
            登录
          </Button>
        </div>
      ),
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input prefix={<UserOutlined />} placeholder="用户名" size="large"
            value={registerData.username} onChange={e => setRegisterData({ ...registerData, username: e.target.value })} />
          <Input prefix={<MailOutlined />} placeholder="邮箱" size="large"
            value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />
          <Input.Password prefix={<LockOutlined />} placeholder="密码（至少6位）" size="large"
            value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
            onPressEnter={handleRegister} />
          <Button type="primary" size="large" loading={loading} onClick={handleRegister} style={{ height: 48 }}>
            注册
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400, borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 8 }}>🚀 我的平台</Title>
          <Text type="secondary">登录或注册以继续</Text>
        </div>
        <Tabs items={tabItems} centered />
      </Card>
    </div>
  )
}

export default Login
```

4. 按 `Ctrl + S` 保存

---

### 4️⃣ 更新主页面（加入登录判断）

1. 打开 **`src/App.tsx`**，**全选删除**
2. 粘贴以下代码：

```tsx
import { useState, useEffect } from 'react'
import { Layout, Menu, Typography, Card, Row, Col, Button, Avatar, Dropdown } from 'antd'
import {
  DashboardOutlined, RobotOutlined, CodeOutlined, BookOutlined,
  MessageOutlined, VideoCameraOutlined, ToolOutlined, AppstoreOutlined,
  UserOutlined, LogoutOutlined
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserEmail(null)
  }

  const handleLogin = (email: string) => {
    setUserEmail(email)
  }

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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 24 }}>
        加载中...
      </div>
    )
  }

  if (!userEmail) {
    return <Login onLogin={handleLogin} />
  }

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
```

3. 按 `Ctrl + S` 保存

---

## 5️⃣ 查看效果

```bash
npm run dev
```

打开 **http://localhost:5173**，测试流程：

1. 看到**紫色渐变背景的登录页**
2. 点 **"注册"** 标签，输入用户名、邮箱、密码，点注册
3. 切到 **"登录"** 标签，用刚才的邮箱密码登录
4. 登录成功 → 进入平台主页，**右上角显示邮箱**
5. 点击右上角邮箱 → **退出登录** → 回到登录页

---

## 完成检查清单

| 任务 | 状态 |
|------|------|
| Supabase 关闭了邮箱验证 | ✅ |
| 创建了 src/components/Login.tsx | ✅ |
| 更新了 src/App.tsx | ✅ |
| 能看到登录页面 | ✅ |
| 能成功注册新账号 | ✅ |
| 能登录并看到平台主页 | ✅ |
| 右上角能退出登录 | ✅ |
