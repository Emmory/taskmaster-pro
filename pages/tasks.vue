<template>
  <NuxtLayout name="default">
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
      
      <!-- Header con navegación -->
      <div style="margin-bottom: 2rem;">
        <NuxtLink 
          to="/dashboard" 
          style="display: inline-flex; align-items: center; gap: 0.5rem; color: #2563eb; text-decoration: none; margin-bottom: 1rem; font-weight: 500;"
        >
          ← Volver al Dashboard
        </NuxtLink>
        
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 class="text-3xl font-bold mb-2">Gestión de Tareas</h1>
            <p style="color: #6b7280;">Total: {{ filteredTasks.length }} tareas</p>
          </div>
          
          <button
            @click="openCreateModal"
            style="padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;"
          >
            ➕ Nueva Tarea
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card mb-6">
        <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">🔍 Filtros</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">Buscar</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Buscar por título..."
              style="width: 100%;"
            />
          </div>

          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">Estado</label>
            <select v-model="filters.status" style="width: 100%;">
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="in-progress">En Progreso</option>
              <option value="completed">Completada</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">Prioridad</label>
            <select v-model="filters.priority" style="width: 100%;">
              <option value="">Todas</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabla de tareas -->
      <div class="card" style="overflow: hidden;">
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 500; text-transform: uppercase; color: #6b7280;">
                  Título
                </th>
                <th style="padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 500; text-transform: uppercase; color: #6b7280;">
                  Estado
                </th>
                <th style="padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 500; text-transform: uppercase; color: #6b7280;">
                  Prioridad
                </th>
                <th style="padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 500; text-transform: uppercase; color: #6b7280;">
                  Fecha límite
                </th>
                <th style="padding: 0.75rem 1.5rem; text-align: right; font-size: 0.75rem; font-weight: 500; text-transform: uppercase; color: #6b7280;">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="task in paginatedTasks"
                :key="task.id"
                style="border-top: 1px solid #e5e7eb; transition: background-color 0.2s;"
              >
                <td style="padding: 1rem 1.5rem;">
                  <div style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem;">
                    {{ task.title }}
                  </div>
                  <div style="font-size: 0.875rem; color: #6b7280;">
                    {{ task.description }}
                  </div>
                </td>
                <td style="padding: 1rem 1.5rem;">
                  <span :class="getStatusClass(task.status)">
                    {{ getStatusLabel(task.status) }}
                  </span>
                </td>
                <td style="padding: 1rem 1.5rem;">
                  <span :class="getPriorityClass(task.priority)">
                    {{ getPriorityLabel(task.priority) }}
                  </span>
                </td>
                <td style="padding: 1rem 1.5rem; font-size: 0.875rem; color: #6b7280;">
                  {{ formatDate(task.dueDate) }}
                </td>
                <td style="padding: 1rem 1.5rem; text-align: right;">
                  <button
                    @click="openEditModal(task)"
                    style="background: none; border: none; cursor: pointer; font-size: 1.25rem; margin-right: 0.5rem;"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    @click="handleDeleteTask(task.id)"
                    style="background: none; border: none; cursor: pointer; font-size: 1.25rem;"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación mejorada -->
        <div style="background: #f9fafb; padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div style="font-size: 0.875rem; color: #6b7280;">
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredTasks.length) }} de {{ filteredTasks.length }} resultados
          </div>
          
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              style="padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #d1d5db; background: white; cursor: pointer; font-weight: 500;"
              :style="currentPage === 1 ? 'opacity: 0.5; cursor: not-allowed;' : ''"
            >
              ← Anterior
            </button>
            
            <span style="padding: 0.5rem 1rem; font-weight: 500;">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              style="padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #d1d5db; background: white; cursor: pointer; font-weight: 500;"
              :style="currentPage === totalPages ? 'opacity: 0.5; cursor: not-allowed;' : ''"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>

      <!-- Modal crear/editar -->
      <div
        v-if="showModal"
        class="modal-overlay"
        @click.self="closeModal"
      >
        <div class="modal-content" style="max-height: 90vh; overflow-y: auto;">
          <div class="p-6">
            <h2 class="text-2xl font-bold mb-6">
              {{ isEditing ? '✏️ Editar Tarea' : '➕ Nueva Tarea' }}
            </h2>

            <form @submit.prevent="saveTask" style="display: flex; flex-direction: column; gap: 1rem;">
            <!-- Campo Título -->
                <div>
                <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; color: #374151;">
                  Título *
                </label>
               <input
                v-model="formData.title"
                type="text"
                placeholder="Ej: Completar informe mensual"
                required
                style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;"
    />
  </div>

               <!-- Campo Descripción -->
  <div>
    <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; color: #374151;">
      Descripción *
    </label>
    <textarea
      v-model="formData.description"
      placeholder="Describe la tarea..."
      required
      rows="3"
      style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; resize: vertical;"
    ></textarea>
  </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">
                    Estado *
                  </label>
                  <select v-model="formData.status" required>
                    <option value="pending">Pendiente</option>
                    <option value="in-progress">En Progreso</option>
                    <option value="completed">Completada</option>
                  </select>
                </div>

                <div>
                  <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">
                    Prioridad *
                  </label>
                  <select v-model="formData.priority" required>
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div>
                  <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">
                    Fecha límite *
                  </label>
                  <input
                    v-model="formData.dueDate"
                    type="date"
                    required
                  />
                </div>
              </div>

              <div style="display: flex; gap: 1rem; padding-top: 1rem;">
                <button
                  type="submit"
                  style="flex: 1; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;"
                >
                  {{ isEditing ? 'Actualizar' : 'Crear' }}
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  style="flex: 1; padding: 0.75rem; background: #6b7280; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
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

const filters = reactive({
  search: '',
  status: '',
  priority: ''
})

const currentPage = ref(1)
const itemsPerPage = 5

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

const totalPages = computed(() => Math.ceil(filteredTasks.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)
const paginatedTasks = computed(() => filteredTasks.value.slice(startIndex.value, endIndex.value))

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