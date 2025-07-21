<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../plugins/axios"; // 👈 import the axios instance you created

const router = useRouter();

// Form fields (same as before)
const name = ref("");
const email = ref("");
const phone = ref("");
const position = ref("");
const salary = ref<number | null>(null);
const hired_at = ref("");
const status = ref("1");
const photo = ref<File | null>(null);

// Errors
const errors = ref<Record<string, string>>({});
const submitting = ref(false);

function handlePhotoChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    photo.value = target.files[0];
  }
}

function validate() {
  errors.value = {};
  if (!name.value) errors.value.name = "Name is required";
  if (!email.value) errors.value.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(email.value))
    errors.value.email = "Invalid email format";
  if (!position.value) errors.value.position = "Position is required";
  if (salary.value === null || isNaN(salary.value)) {
    errors.value.salary = "Salary is required";
  } else if (Number(salary.value) < 0) {
    errors.value.salary = "Salary must be >= 0";
  }
  if (!hired_at.value) errors.value.hired_at = "Hired At is required";
  if (status.value !== "1" && status.value !== "0")
    errors.value.status = "Status is required";
  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;

  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("email", email.value);
  formData.append("phone", phone.value);
  formData.append("position", position.value);
  formData.append("salary", String(salary.value));
  formData.append("hired_at", hired_at.value);
  formData.append("status", status.value);
  if (photo.value) {
    formData.append("photo", photo.value);
  }

  submitting.value = true;
  try {
    const response = await api.post("/employees", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Employee created:", response.data);
    // navigate back to employees list
    router.push("/employees");
  } catch (err: any) {
    console.error(err);
    if (err.response?.data?.errors) {
      // Laravel validation errors
      const backendErrors = err.response.data.errors;
      for (const key in backendErrors) {
        errors.value[key] = backendErrors[key][0];
      }
    } else {
      alert("Something went wrong. Please try again.");
    }
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  router.push("/employees");
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Create Employee</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4 max-w-xl">
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium mb-1">Name</label>
        <input
          v-model="name"
          type="text"
          class="border rounded w-full px-3 py-2"
        />
        <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          class="border rounded w-full px-3 py-2"
        />
        <p v-if="errors.email" class="text-red-500 text-sm">
          {{ errors.email }}
        </p>
      </div>

      <!-- Phone -->
      <div>
        <label class="block text-sm font-medium mb-1">Phone (optional)</label>
        <input
          v-model="phone"
          type="text"
          class="border rounded w-full px-3 py-2"
        />
      </div>

      <!-- Position -->
      <div>
        <label class="block text-sm font-medium mb-1">Position</label>
        <input
          v-model="position"
          type="text"
          class="border rounded w-full px-3 py-2"
        />
        <p v-if="errors.position" class="text-red-500 text-sm">
          {{ errors.position }}
        </p>
      </div>

      <!-- Salary -->
      <div>
        <label class="block text-sm font-medium mb-1">Salary</label>
        <input
          v-model.number="salary"
          type="number"
          step="0.01"
          class="border rounded w-full px-3 py-2"
        />
        <p v-if="errors.salary" class="text-red-500 text-sm">
          {{ errors.salary }}
        </p>
      </div>

      <!-- Hired At -->
      <div>
        <label class="block text-sm font-medium mb-1">Hired At</label>
        <input
          v-model="hired_at"
          type="date"
          class="border rounded w-full px-3 py-2"
        />
        <p v-if="errors.hired_at" class="text-red-500 text-sm">
          {{ errors.hired_at }}
        </p>
      </div>

      <!-- Status -->
      <div>
        <label class="block text-sm font-medium mb-1">Status</label>
        <select v-model="status" class="border rounded w-full px-3 py-2">
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
        <p v-if="errors.status" class="text-red-500 text-sm">
          {{ errors.status }}
        </p>
      </div>

      <!-- Photo -->
      <div>
        <label class="block text-sm font-medium mb-1">Photo (optional)</label>
        <input
          type="file"
          @change="handlePhotoChange"
          class="border rounded w-full px-3 py-2"
        />
      </div>

      <!-- Buttons -->
      <div class="flex justify-between mt-6">
        <button
          type="button"
          @click="goBack"
          class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Back
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
        >
          {{ submitting ? "Saving..." : "Save" }}
        </button>
      </div>
    </form>
  </div>
</template>
