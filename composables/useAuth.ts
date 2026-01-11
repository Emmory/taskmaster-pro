import type { User } from '@/types'
export const useAuth = () => {
  const user = useState<User | null>('user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  const login = (email: string, password: string) => {
    if (email && password) {
      user.value = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
      }
      
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      return true
    }
    return false
  }

  const logout = () => {
    user.value = null
    if (process.client) {
      localStorage.removeItem('user')
    }
  }

  const checkAuth = () => {
    if (process.client) {
      const userData = localStorage.getItem('user')
      if (userData) {
        user.value = JSON.parse(userData)
      }
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}