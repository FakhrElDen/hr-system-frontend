<template>
  <div>
    <h2 class="text-xl text-black font-bold mb-4">Employees</h2>

    <!-- Search and Bulk delete -->
    <div class="flex items-center mb-4 gap-2 flex-wrap justify-between">
      <!-- LEFT SECTION -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Bulk delete button -->
        <button
          @click="bulkDelete"
          :disabled="!selected.length"
          class="bg-red-500 text-white mt-5 px-4 py-2 rounded disabled:opacity-50"
        >
          Bulk Delete
        </button>

        <!-- Search -->
        <div class="flex flex-col">
          <label class="text-sm mb-1 text-black">Search</label>
          <input
            v-model="search"
            type="text"
            placeholder="Search..."
            class="border text-black rounded px-3 py-2"
          />
        </div>

        <!-- Hired At filter -->
        <div class="flex flex-col">
          <label class="text-sm mb-1 text-black">Hired At</label>
          <input
            v-model="hiredAtFilter"
            type="date"
            class="border text-black rounded px-3 py-2"
          />
        </div>

        <!-- Status filter -->
        <div class="flex flex-col">
          <label class="text-sm mb-1 text-black">Status</label>
          <select
            v-model="statusFilter"
            class="border text-black rounded px-3 py-2"
          >
            <option value="" selected>All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
      </div>

      <!-- RIGHT SECTION (Create button) -->
      <div class="mt-5">
        <button
          @click="restoreTrashedEmployee"
          class="mr-10 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Restore Deleted Records
        </button>
        <button
          @click="exportEmployees()"
          class="mr-10 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Export
        </button>
        <button
          @click="goToCreateEmployee"
          class="bg-green-500 text-white px-4 py-2 rounded"
        >
          + Create
        </button>
      </div>
    </div>

    <!-- Table -->
    <table class="w-full bg-white shadow rounded">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="p-2">
            <input type="checkbox" @change="toggleAll" :checked="allSelected" />
          </th>
          <th class="p-2 text-black">Name</th>
          <th class="p-2 text-black">photo</th>
          <th class="p-2 text-black">Department</th>
          <th class="p-2 text-black">Email</th>
          <th class="p-2 text-black">Position</th>
          <th class="p-2 text-black">Status</th>
          <th class="p-2 text-black">Hired At</th>
          <th class="p-2 text-black">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emp in employees" :key="emp.id" class="border-t">
          <td class="p-2">
            <input type="checkbox" :value="emp.id" v-model="selected" />
          </td>
          <td class="p-2 text-black">{{ emp.name }}</td>
          <td class="p-2 text-black">
            <img
              v-if="emp.photo"
              :src="emp.photo"
              alt="Employee photo"
              class="w-12 h-12 object-cover rounded-full"
            />
            <span v-else class="text-gray-400 italic">No photo</span>
          </td>
          <td class="p-2 text-black">{{ emp.department?.name }}</td>
          <td class="p-2 text-black">{{ emp.email }}</td>
          <td class="p-2 text-black">{{ emp.position }}</td>
          <td class="p-2">
            <span
              v-if="emp.status === 1"
              class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
            >
              Active
            </span>
            <span
              v-else
              class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800"
            >
              Inactive
            </span>
          </td>
          <td class="p-2 text-black">{{ emp.hired_at }}</td>
          <td class="p-2 space-x-2">
            <button
              @click="editEmployee(emp.id)"
              class="bg-yellow-500 text-white px-2 py-1 rounded"
            >
              Edit
            </button>
            <button
              @click="deleteOne(emp.id)"
              class="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div class="flex justify-between items-center mt-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span class="text-black">Page {{ currentPage }} of {{ lastPage }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === lastPage"
        class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import api from "@/plugins/axios";

const router = useRouter();

// Reactive state
const employees = ref([]);
const selected = ref([]);
const search = ref("");
const hiredAtFilter = ref("");
const statusFilter = ref("");

const currentPage = ref(1);
const perPage = 10;
const lastPage = ref(1);
const loading = ref(false);
const error = ref("");

import axios from "axios";

async function fetchEmployees() {
  try {
    const response = await axios.get(
      "http://hr-system.localhost/api/employees",
      {
        params: {
          page: currentPage.value,
          per_page: perPage,
          search: search.value || undefined,
          hired_at: hiredAtFilter.value || undefined,
          status: statusFilter.value || undefined,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if you're using token auth
        },
      }
    );
    console.log(response)
    employees.value = response.data.data;
     lastPage.value = response.data.meta.last_page;
    currentPage.value = response.data.meta.current_page;
  } catch (err) {
    console.error(err);
  }
}

// Watch filters and reload automatically
watch([search, hiredAtFilter, statusFilter, currentPage], () => {
  fetchEmployees();
});

// On component mount
onMounted(fetchEmployees);

// Bulk delete
async function bulkDelete() {
  console.log(Array.from(selected.value));
  try {
    await api.post("/employees/bulk-delete", {
      ids: Array.from(selected.value),
    });
    // Refresh after deletion
    await fetchEmployees();
    selected.value = [];
  } catch (err) {
    console.error(err);
    alert("Bulk delete failed.");
  }
}

// Single delete
async function deleteOne(emp) {
  try {
    await api.delete(`/employees/${emp}`);
    await fetchEmployees();
    selected.value = selected.value.filter((s) => s !== id);
  } catch (err) {
    console.error(err);
    alert("Delete failed.");
  }
}

async function restoreTrashedEmployee() {
  try {
    await api.get(`/employees/restore`);
    await fetchEmployees();
  } catch (err) {
    console.error(err);
    alert("Restore failed.");
  }
}

function toggleAll(e) {
  if (e.target.checked) {
    selected.value = employees.value.map((emp) => emp.id);
  } else {
    selected.value = [];
  }
}

function goToCreateEmployee() {
  router.push({ name: "employee-create" });
}

function editEmployee(id) {
  router.push({ name: "employee-edit", params: { id } });
}

// Pagination controls
function nextPage() {
  if (currentPage.value < lastPage.value) {
    currentPage.value++;
  }
}
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}
</script>
