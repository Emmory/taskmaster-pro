import type { Task } from '@/types'

export const useTasks = () => {
  const tasks = useState<Task[]>('tasks', () => [])

  const loadTasks = () => {
    if (process.client) {
      const saved = localStorage.getItem('tasks')
      if (saved) {
        tasks.value = JSON.parse(saved)
      } else {
        initializeDemoTasks()
      }
    }
  }

  const initializeDemoTasks = () => {
    tasks.value = [
      {
        id: '1',
        title: 'Completar documentación del proyecto',
        description: 'Escribir la documentación técnica completa',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2026-01-15',
        createdAt: '2026-01-08',
        userId: '1'
      },
      {
        id: '2',
        title: 'Revisar código del equipo',
        description: 'Code review de los pull requests pendientes',
        status: 'pending',
        priority: 'medium',
        dueDate: '2026-01-12',
        createdAt: '2026-01-09',
        userId: '1'
      },
      {
        id: '3',
        title: 'Implementar tests unitarios',
        description: 'Agregar tests para los componentes nuevos',
        status: 'completed',
        priority: 'high',
        dueDate: '2026-01-10',
        createdAt: '2026-01-05',
        userId: '1'
      }
    ]
    saveTasks()
  }

  const saveTasks = () => {
    if (process.client) {
      localStorage.setItem('tasks', JSON.stringify(tasks.value))
    }
  }

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    tasks.value.push(newTask)
    saveTasks()
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates }
      saveTasks()
    }
  }

  const deleteTask = (id: string) => {
    tasks.value = tasks.value.filter(t => t.id !== id)
    saveTasks()
  }

  const completedTasks = computed(() => 
    tasks.value.filter(t => t.status === 'completed')
  )

  const pendingTasks = computed(() => 
    tasks.value.filter(t => t.status === 'pending')
  )

  const inProgressTasks = computed(() => 
    tasks.value.filter(t => t.status === 'in-progress')
  )

  return {
    tasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    loadTasks,
    addTask,
    updateTask,
    deleteTask
  }
}