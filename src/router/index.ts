import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import EmployeesPage from '../views/EmployeesPage.vue'
import CreateEmployee from '../views/CreateEmployee.vue'
import EditEmployee from '../views/EditEmployee.vue'

const routes = [
  { path: '/login', name: 'login', component: LoginPage },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', redirect: '/employees' },
      { path: 'employees', name: 'employees', component: EmployeesPage },
      { path: 'employees/create', name: 'employee-create', component: CreateEmployee },
      { path: 'employees/:id/edit', name: 'employee-edit', component: EditEmployee },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
