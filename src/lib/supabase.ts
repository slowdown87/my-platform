import { createClient } from '@supabase/supabase-js'

// 直接写死配置（Gitee Pages 不支持环境变量）
const supabaseUrl = 'https://fbyddjtvazfrdtzczrig.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZieWRkanR2YXpmcmR0emN6cmlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDg1MDgsImV4cCI6MjA5MTYyNDUwOH0.JrQs4l12Q7ZOBxKP6JwejkpRm7NsquKhHER91NYPAw4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)