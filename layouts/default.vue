<template>
  <div class="min-h-screen">
    <nav style="background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <div class="container">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold" style="color: #2563eb;">
              TaskMaster Pro
            </h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg transition-colors"
              style="background: transparent;"
            >
              <span v-if="isDark" class="text-2xl">☀️</span>
              <span v-else class="text-2xl">🌙</span>
            </button>
            
            <div v-if="user" class="flex items-center space-x-3">
              <img
                v-if="user.avatar"
                :src="user.avatar"
                :alt="user.name"
                style="width: 40px; height: 40px; border-radius: 50%;"
              />
              <span class="font-medium">{{ user.name }}</span>
            </div>
            
            <button
              @click="handleLogout"
              class="px-4 py-2 text-white rounded-lg transition-colors"
              style="background-color: #ef4444;"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="container py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const router = useRouter()
const isDark = ref(false)

onMounted(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme')
    isDark.value = savedTheme === 'dark'
    if (isDark.value) {
      document.body.classList.add('dark')
    }
  }
})

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  
  if (process.client) {
    if (isDark.value) {
      document.body.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }
}

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>