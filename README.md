# TaskMaster Pro - Prueba Técnica Senior Frontend

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.17-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)

Aplicación web completa de gestión de tareas desarrollada con Vue 3, Nuxt 3 y TypeScript como parte de la evaluación técnica para el puesto de Desarrollador Senior Frontend.

## 🚀 Características Implementadas

### Requisitos Técnicos
- ✅ **Framework**: Nuxt 3.17 con Vue 3
- ✅ **Tipado**: TypeScript estricto en todo el proyecto
- ✅ **Gestión de Estado**: Composables personalizados con Vue's Composition API
- ✅ **Estilos**: CSS personalizado con diseño responsivo
- ✅ **Librerías**: Chart.js, date-fns, vue-chartjs

### Funcionalidades
- ✅ **Autenticación**: Sistema de login con rutas públicas/privadas
- ✅ **Dashboard**: Estadísticas visuales con gráficas interactivas
- ✅ **CRUD Completo**: Gestión de tareas con filtros y paginación
- ✅ **Modo Oscuro/Claro**: Toggle persistente con localStorage
- ✅ **API de Navegador**: Geolocalización GPS integrada
- ✅ **Diseño Responsivo**: Adaptable a móvil, tablet y escritorio

### Páginas Implementadas
1. **Login** (`/login`) - Autenticación de usuarios
2. **Dashboard** (`/dashboard`) - Panel con estadísticas y gráficas
3. **Gestión de Tareas** (`/tasks`) - CRUD completo con tabla y filtros

## 📁 Estructura del Proyecto
```
taskmaster-pro/
├── assets/
│   └── css/
│       └── main.css           # Estilos globales
├── composables/
│   ├── useAuth.ts             # Lógica de autenticación
│   └── useTasks.ts            # Gestión de tareas
├── layouts/
│   ├── auth.vue               # Layout para login
│   └── default.vue            # Layout principal
├── middleware/
│   └── auth.ts                # Middleware de autenticación
├── pages/
│   ├── dashboard.vue          # Dashboard con gráficas
│   ├── index.vue              # Página inicial
│   ├── login.vue              # Página de login
│   └── tasks.vue              # Gestión de tareas
├── types/
│   └── index.ts               # Definiciones TypeScript
├── CASO-REAL.md               # Documentación del caso técnico
├── ARQUITECTURA-MONOREPO.md   # Diseño de arquitectura monorepo
├── nuxt.config.ts
├── package.json
└── README.md
```

## 🛠️ Instalación y Ejecución

### Requisitos Previos
- Node.js 20.x o superior
- npm 10.x o superior

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Emmory/taskmaster-pro.git

# Entrar al directorio
cd taskmaster-pro

# Instalar dependencias
npm install
```

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Acceder a http://localhost:3000
```

### Credenciales de Acceso
Puedes usar **cualquier email y contraseña** para acceder:
- Email: `test@test.com`
- Contraseña: `123456`

## 📊 Características Técnicas Destacadas

### 1. Tipado TypeScript Riguroso
Todos los modelos de datos están completamente tipados:
```typescript
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
```

### 2. Composables Reutilizables
Estado global manejado con composables personalizados:
```typescript
const { user, login, logout, checkAuth } = useAuth()
const { tasks, addTask, updateTask, deleteTask } = useTasks()
```

### 3. Middleware de Autenticación
Protección de rutas privadas con redirección automática:
```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})
```

### 4. Geolocalización Integrada
Uso de la API de Geolocalización del navegador:
```typescript
navigator.geolocation.getCurrentPosition(
  (position) => {
    location.value = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }
  }
)
```

## 📈 Gráficas y Visualizaciones

- **Gráfica de Dona**: Distribución de tareas por estado
- **Gráfica de Barras**: Tareas por nivel de prioridad
- **Estadísticas en Tiempo Real**: Contadores dinámicos

## 🎨 Diseño y UX

- **Interfaz Moderna**: Diseño limpio y profesional
- **Responsivo**: Funciona perfectamente en todos los dispositivos
- **Dark Mode**: Tema oscuro/claro con persistencia
- **Feedback Visual**: Estados de carga y animaciones suaves

## 📝 Documentación Técnica

### Caso Real
El archivo `CASO-REAL.md` documenta un caso técnico.

### Arquitectura Monorepo
El archivo `ARQUITECTURA-MONOREPO.md` presenta el diseño de un monorepo escalable con Nx, detallando:
- Estructura de 4 paquetes principales
- Justificación de decisiones técnicas
- Configuración y dependencias
- Flujos de trabajo

## 🔧 Tecnologías Utilizadas

- **Nuxt 3** - Meta-framework de Vue
- **Vue 3** - Framework JavaScript progresivo
- **TypeScript** - Tipado estático
- **Chart.js** - Visualización de datos
- **date-fns** - Manipulación de fechas
- **CSS Custom** - Estilos personalizados

## 📦 Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
```

## 👤 Autor

**Emmory Carias Gonzalez**
- Candidato para: Desarrollador Senior Frontend
- Fecha: Enero 2026

