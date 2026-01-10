<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1rem;">
    <div style="background: white; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); width: 100%; max-width: 420px;">
      
      <!-- Logo y título -->
      <div style="text-align: center; margin-bottom: 2rem;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">📋</div>
        <h1 style="font-size: 1.875rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem;">
          TaskMaster Pro
        </h1>
        <p style="color: #6b7280; font-size: 0.875rem;">
          Inicia sesión para continuar
        </p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleLogin" style="display: flex; flex-direction: column; gap: 1.25rem;">
        
        <!-- Email -->
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
            Correo electrónico
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="tu@email.com"
            required
            style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; transition: all 0.2s;"
          />
        </div>

        <!-- Contraseña -->
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
            Contraseña
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; transition: all 0.2s;"
          />
        </div>

        <!-- Error -->
        <div v-if="error" style="padding: 0.75rem; background: #fee2e2; border: 1px solid #fecaca; border-radius: 0.5rem; color: #dc2626; font-size: 0.875rem;">
          {{ error }}
        </div>

        <!-- Botón -->
        <button
          type="submit"
          style="width: 100%; padding: 0.875rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s;"
        >
          Iniciar sesión
        </button>

        <!-- Nota -->
        <div style="text-align: center; margin-top: 0.5rem;">
          <p style="font-size: 0.75rem; color: #6b7280; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            💡 Usa cualquier correo electrónico y contraseña para entrar
          </p>
        </div>
      </form>
    </div>
  </div>
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