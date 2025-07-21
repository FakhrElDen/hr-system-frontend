<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

async function logout() {
  try {
    // Call your backend logout endpoint
    await axios.post('http://hr-system.localhost/api/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    // Remove token from localStorage
    localStorage.removeItem('token')

    // Redirect to login page
    router.push('/login')
  } catch (err) {
    console.error('Logout failed:', err)
    // Still clear token and redirect just in case
    localStorage.removeItem('token')
    router.push('/login')
  }
}
</script>

<template>
  <div class="flex h-screen w-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 text-white flex flex-col">
      <div class="p-4 text-xl font-bold border-b border-gray-700">
        My Dashboard
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <RouterLink
          to="/employees"
          class="block py-2 px-3 rounded hover:bg-gray-700"
          active-class="bg-gray-700"
        >
          Employees
        </RouterLink>
      </nav>
      <!-- <footer class="p-4 border-t border-gray-700 text-sm">
        © 2025
      </footer> -->
    </aside>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow p-4 flex justify-between items-center">
        <h1 class="text-lg font-bold text-black">Dashboard</h1>
        <button class="text-red-500" @click="logout" >Logout</button>
      </header>

      <!-- Page content -->
      <main class="p-4 flex-1 overflow-y-auto">
        <RouterView />
      </main>

      <!-- Footer -->
      <footer class="bg-white shadow p-4 text-center text-black text-sm">
        Dashboard Footer
      </footer>
    </div>
  </div>
</template>
