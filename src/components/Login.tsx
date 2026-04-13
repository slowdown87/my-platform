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
      const { error } = await supabase.auth.signUp({
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
          <Input
            prefix={<MailOutlined />}
            placeholder="邮箱"
            size="large"
            value={loginData.email}
            onChange={e => setLoginData({ ...loginData, email: e.target.value })}
          />
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
            size="large"
            value={loginData.password}
            onChange={e => setLoginData({ ...loginData, password: e.target.value })}
            onPressEnter={handleLogin}
          />
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleLogin}
            style={{ height: 48 }}
          >
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
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名"
            size="large"
            value={registerData.username}
            onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
          />
          <Input
            prefix={<MailOutlined />}
            placeholder="邮箱"
            size="large"
            value={registerData.email}
            onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
          />
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码（至少6位）"
            size="large"
            value={registerData.password}
            onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
            onPressEnter={handleRegister}
          />
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleRegister}
            style={{ height: 48 }}
          >
            注册
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
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