<template>
  <div>
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gestión de Tareas
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Total: {{ filteredTasks.length }} tareas
        </p>
      </div>
      
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
      >
        ➕ Nueva Tarea
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔍 Filtros</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Buscar
          </label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Buscar por título..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estado
          </label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="in-progress">En Progreso</option>
            <option value="completed">Completada</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prioridad
          </label>
          <select
            v-model="filters.priority"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla de tareas -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Título
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                Prioridad
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                Fecha límite
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="task in paginatedTasks"
              :key="task.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ task.title }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ task.description }}
                </div>
              </td>
              <td class="px-6 py-4 hidden md:table-cell">
                <span :class="getStatusClass(task.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                  {{ getStatusLabel(task.status) }}
                </span>
              </td>
              <td class="px-6 py-4 hidden lg:table-cell">
                <span :class="getPriorityClass(task.priority)" class="px-3 py-1 rounded-full text-xs font-semibold">
                  {{ getPriorityLabel(task.priority) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                {{ formatDate(task.dueDate) }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium space-x-2">
                <button
                  @click="openEditModal(task)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  ✏️
                </button>
                <button
                  @click="handleDeleteTask(task.id)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredTasks.length) }} de {{ filteredTasks.length }} resultados
        </div>
        
        <div class="flex space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
              currentPage === 1
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            Anterior
          </button>
          
          <span class="px-4 py-2 text-gray-700 dark:text-gray-300">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
          
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
              currentPage === totalPages
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- Modal crear/editar -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {{ isEditing ? '✏️ Editar Tarea' : '➕ Nueva Tarea' }}
          </h2>

          <form @submit.prevent="saveTask" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título *
              </label>
              <input
                v-model="formData.title"
                type="text"
                required
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción *
              </label>
              <textarea
                v-model="formData.description"
                required
                rows="3"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado *
                </label>
                <select
                  v-model="formData.status"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in-progress">En Progreso</option>
                  <option value="completed">Completada</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prioridad *
                </label>
                <select
                  v-model="formData.priority"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha límite *
                </label>
                <input
                  v-model="formData.dueDate"
                  type="date"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="flex space-x-4 pt-4">
              <button
                type="submit"
                class="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {{ isEditing ? 'Actualizar' : 'Crear' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="flex-1 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import type { Task } from '@/types'

definePageMeta({
  middleware: 'auth'
})

const { tasks, addTask, updateTask, deleteTask } = useTasks()

onMounted(() => {
  const { loadTasks } = useTasks()
  loadTasks()
})

// Filtros
const filters = reactive({
  search: '',
  status: '',
  priority: ''
})

// Paginación
const currentPage = ref(1)
const itemsPerPage = 5

// Tareas filtradas
const filteredTasks = computed(() => {
  let filtered = tasks.value

  if (filters.search) {
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.search.toLowerCase())
    )
  }

  if (filters.status) {
    filtered = filtered.filter(task => task.status === filters.status)
  }

  if (filters.priority) {
    filtered = filtered.filter(task => task.priority === filters.priority)
  }

  return filtered
})

// Paginación calculada
const totalPages = computed(() => Math.ceil(filteredTasks.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)
const paginatedTasks = computed(() => filteredTasks.value.slice(startIndex.value, endIndex.value))

// Modal
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref('')

const formData = reactive({
  title: '',
  description: '',
  status: 'pending' as 'pending' | 'in-progress' | 'completed',
  priority: 'medium' as 'low' | 'medium' | 'high',
  dueDate: '',
  userId: '1'
})

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

const openEditModal = (task: Task) => {
  isEditing.value = true
  editingId.value = task.id
  Object.assign(formData, {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    userId: task.userId
  })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.title = ''
  formData.description = ''
  formData.status = 'pending'
  formData.priority = 'medium'
  formData.dueDate = ''
  formData.userId = '1'
}

const saveTask = () => {
  if (isEditing.value) {
    updateTask(editingId.value, formData)
  } else {
    addTask(formData)
  }
  closeModal()
}

const handleDeleteTask = (id: string) => {
  if (confirm('¿Estás seguro de eliminar esta tarea?')) {
    deleteTask(id)
  }
}

// Funciones auxiliares
const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd/MM/yyyy')
  } catch {
    return date
  }
}

const getStatusLabel = (status: string) => {
  const labels = {
    'pending': 'Pendiente',
    'in-progress': 'En Progreso',
    'completed': 'Completada'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusClass = (status: string) => {
  const classes = {
    'pending': 'badge badge-pending',
    'in-progress': 'badge badge-in-progress',
    'completed': 'badge badge-completed'
  }
  return classes[status as keyof typeof classes] || 'badge'
}

const getPriorityLabel = (priority: string) => {
  const labels = {
    'low': 'Baja',
    'medium': 'Media',
    'high': 'Alta'
  }
  return labels[priority as keyof typeof labels] || priority
}

const getPriorityClass = (priority: string) => {
  const classes = {
    'low': 'badge badge-completed',
    'medium': 'badge badge-in-progress',
    'high': 'badge badge-pending'
  }
  return classes[priority as keyof typeof classes] || 'badge'
}
</script>