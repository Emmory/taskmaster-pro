<template>
  <NuxtLayout name="auth">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📋 TaskMaster Pro
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Inicia sesión para continuar
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Correo electrónico
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="tu@email.com"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all"
            />
          </div>

          <div v-if="error" class="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                   rounded-lg transition-colors shadow-lg hover:shadow-xl
                   transform hover:scale-105 duration-200"
          >
            Iniciar Sesión
          </button>
        </form>

        <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p class="text-sm text-blue-800 dark:text-blue-200 text-center">
            💡 Usa cualquier email y contraseña para entrar
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const { login, checkAuth, isAuthenticated } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

onMounted(() => {
  checkAuth()
  if (isAuthenticated.value) {
    router.push('/dashboard')
  }
})

const handleLogin = () => {
  if (!email.value || !password.value) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  const success = login(email.value, password.value)
  
  if (success) {
    router.push('/dashboard')
  } else {
    error.value = 'Error al iniciar sesión'
  }
}
</script>