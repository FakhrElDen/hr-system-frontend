<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="login" class="bg-white shadow-md rounded p-8 w-96">
      <h2 class="text-2xl mb-4 font-bold text-black">Login</h2>
      <div class="mb-4">
        <label class="block mb-1 text-black">Email</label>
        <input v-model="email" type="email" class="text-black w-full border rounded px-3 py-2" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 text-black">Password</label>
        <input v-model="password" type="password" class="text-black w-full border rounded px-3 py-2" />
      </div>
      <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full">
        Login
      </button>
    </form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'

const router = useRouter()
const email = ref('')
const password = ref('')

async function login() {
  try {
    const response = await axios.post('http://hr-system.localhost/api/auth/login', {
      email: email.value,
      password: password.value
    })

    const token = response.data.token

    localStorage.setItem('token', token)

    localStorage.setItem('user', JSON.stringify(response.data.user))

    router.push('/employees')
  } catch (error) {
    console.error(error)
    alert('Login failed. Check your credentials.')
  }
}
</script>
