import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import EmployeesPage from '../views/EmployeesPage.vue'
import CreateEmployee from '../views/CreateEmployee.vue'

const routes = [
  { path: '/login', name: 'login', component: LoginPage },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', redirect: '/employees' },
      { path: 'employees', name: 'employees', component: EmployeesPage },
      { path: 'employees/create', name: 'employee-create', component: CreateEmployee },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
