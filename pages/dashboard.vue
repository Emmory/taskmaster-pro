<template>
  <NuxtLayout name="default">
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;"></div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Dashboard</h1>
      <p>Bienvenido, {{ user?.name }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm mb-2">Total de Tareas</p>
            <p class="text-3xl font-bold">{{ stats.totalTasks }}</p>
          </div>
          <div class="text-4xl">📋</div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm mb-2">Completadas</p>
            <p class="text-3xl font-bold">{{ stats.completedTasks }}</p>
          </div>
          <div class="text-4xl">✅</div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm mb-2">En Progreso</p>
            <p class="text-3xl font-bold">{{ stats.inProgressTasks }}</p>
          </div>
          <div class="text-4xl">⏳</div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm mb-2">Pendientes</p>
            <p class="text-3xl font-bold">{{ stats.pendingTasks }}</p>
          </div>
          <div class="text-4xl">📌</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Estado de Tareas</h3>
        <div class="h-64">
          <Doughnut :data="doughnutData" :options="chartOptions" />
        </div>
      </div>

      <div class="card">
        <h3 class="text-xl font-bold mb-4">Prioridad de Tareas</h3>
        <div class="h-64">
          <Bar :data="barData" :options="chartOptions" />
        </div>
      </div>
    </div>

    <div class="card">
      <h3 class="text-xl font-bold mb-4">Tu Ubicacion Actual</h3>
      
      <div v-if="loading" class="text-center py-8">
        <div class="spinner"></div>
        <p class="mt-4">Obteniendo ubicacion...</p>
      </div>

      <div v-else-if="location" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-blue-600 text-white rounded-lg">
            <p class="text-sm">Latitud</p>
            <p class="text-lg font-semibold">{{ location.latitude }}</p>
          </div>
          <div class="p-4 bg-blue-600 text-white rounded-lg">
            <p class="text-sm">Longitud</p>
            <p class="text-lg font-semibold">{{ location.longitude }}</p>
          </div>
        </div>
        
        <a :href="mapsUrl" target="_blank" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">
          Ver en Google Maps
        </a>
      </div>

      <div v-else class="text-center py-8">
        <p class="text-red-500 mb-4">{{ locationError }}</p>
        <button @click="getLocation" class="px-6 py-2 bg-blue-600 text-white rounded-lg">
          Intentar de nuevo
        </button>
      </div>
    </div>

    <div class="mt-8">
      <NuxtLink to="/tasks" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
        Ver todas las tareas
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Doughnut, Bar } from 'vue-chartjs'
import type { DashboardStats } from '@/types'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
const { tasks, completedTasks, pendingTasks, inProgressTasks, loadTasks } = useTasks()

onMounted(() => {
  loadTasks()
  getLocation()
})

const stats = computed<DashboardStats>(() => ({
  totalTasks: tasks.value.length,
  completedTasks: completedTasks.value.length,
  pendingTasks: pendingTasks.value.length,
  inProgressTasks: inProgressTasks.value.length
}))

const doughnutData = computed(() => ({
  labels: ['Completadas', 'En Progreso', 'Pendientes'],
  datasets: [{
    data: [stats.value.completedTasks, stats.value.inProgressTasks, stats.value.pendingTasks],
    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
    borderWidth: 0
  }]
}))

const barData = computed(() => {
  const priorities = { low: 0, medium: 0, high: 0 }
  tasks.value.forEach(task => {
    priorities[task.priority]++
  })

  return {
    labels: ['Baja', 'Media', 'Alta'],
    datasets: [{
      label: 'Tareas por prioridad',
      data: [priorities.low, priorities.medium, priorities.high],
      backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444']
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}

const location = ref<{ latitude: number; longitude: number } | null>(null)
const loading = ref(false)
const locationError = ref('')

const mapsUrl = computed(() => {
  if (!location.value) return ''
  return `https://www.google.com/maps?q=${location.value.latitude},${location.value.longitude}`
})

const getLocation = () => {
  if (!navigator.geolocation) {
    locationError.value = 'Tu navegador no soporta geolocalizacion'
    return
  }

  loading.value = true
  locationError.value = ''

  navigator.geolocation.getCurrentPosition(
    (position) => {
      location.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      loading.value = false
    },
    () => {
      loading.value = false
      locationError.value = 'No se pudo obtener tu ubicacion'
    }
  )
}
</script>