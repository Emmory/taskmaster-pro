<template>
  <div class="min-h-screen">
    <nav style="background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100;">
      <div style="max-width: 1400px; margin: 0 auto; padding: 0.5rem 1rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; min-height: 60px; flex-wrap: wrap; gap: 0.5rem;">
          
          <!-- Logo - Se oculta en móvil -->
          <div style="flex-shrink: 0;">
            <h1 style="font-size: clamp(1rem, 3vw, 1.5rem); font-weight: 700; color: #2563eb; white-space: nowrap;">
              📋 TaskMaster Pro
            </h1>
          </div>
          
          <!-- Botones de la derecha -->
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            
            <!-- Botón Modo Oscuro -->
            <button
              @click="toggleDarkMode"
              style="
                background: #f3f4f6; 
                border: 2px solid #e5e7eb; 
                cursor: pointer; 
                width: 44px; 
                height: 44px; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                border-radius: 0.5rem;
                flex-shrink: 0;
                transition: all 0.2s;
              "
              title="Cambiar tema"
            >
              <span style="font-size: 20px;">{{ isDark ? '☀️' : '🌙' }}</span>
            </button>
            
            <!-- Info Usuario -->
            <div 
              v-if="user" 
              style="
                display: flex; 
                align-items: center; 
                gap: 0.5rem; 
                padding: 0.4rem 0.75rem; 
                background: #f9fafb; 
                border-radius: 0.5rem;
                flex-shrink: 0;
              "
            >
              <img
                v-if="user.avatar"
                :src="user.avatar"
                :alt="user.name"
                style="width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;"
              />
              <span style="font-weight: 500; font-size: 0.875rem; white-space: nowrap;">
                {{ user.name }}
              </span>
            </div>
            
            <!-- Botón Salir -->
            <button
              @click="handleLogout"
              style="
                background-color: #ef4444; 
                color: white;
                cursor: pointer; 
                font-weight: 600;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                border: none;
                font-size: 0.875rem;
                flex-shrink: 0;
                transition: all 0.2s;
              "
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <main style="max-width: 1400px; margin: 0 auto; padding: 1.5rem 1rem;">
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