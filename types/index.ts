export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  createdAt: string
  userId: string
}

export type TaskCreate = Omit<Task, 'id' | 'createdAt'>

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export interface TaskFilters {
  status?: string
  priority?: string
  search?: string
}

export interface DashboardStats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  inProgressTasks: number
}
