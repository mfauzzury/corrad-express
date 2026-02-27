<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";
import { listUsers, createUser, updateUser, deleteUser, listRoles } from "@/api/cms";
import type { UserDetail, UserInput, Role } from "@/types";

const users = ref<UserDetail[]>([]);
const roles = ref<Role[]>([]);
const showForm = ref(false);
const editingId = ref<number | null>(null);
const saving = ref(false);

const form = ref<UserInput>({
  name: "",
  email: "",
  password: "",
  role: "editor",
  isActive: true,
});

async function load() {
  const [usersRes, rolesRes] = await Promise.all([listUsers(), listRoles()]);
  users.value = usersRes.data;
  roles.value = rolesRes.data;
}

function startNew() {
  editingId.value = null;
  form.value = { name: "", email: "", password: "", role: "editor", isActive: true };
  showForm.value = true;
}

function startEdit(user: UserDetail) {
  editingId.value = user.id;
  form.value = { name: user.name, email: user.email, role: user.role, isActive: user.isActive };
  showForm.value = true;
}

function cancelForm() {
  showForm.value = false;
  editingId.value = null;
}

async function save() {
  saving.value = true;
  try {
    if (editingId.value !== null) {
      await updateUser(editingId.value, form.value);
    } else {
      await createUser(form.value);
    }
    await load();
    showForm.value = false;
    editingId.value = null;
  } finally {
    saving.value = false;
  }
}

async function remove(id: number) {
  await deleteUser(id);
  await load();
}

onMounted(load);
</script>

<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">
      <!-- ───── Hero Header ───── -->
      <div class="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-6 py-5">
        <div class="absolute inset-0 opacity-[0.04]" style="background-image: radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0); background-size: 24px 24px;" />
        <div class="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">Users</h1>
            <p class="mt-1 text-slate-500">Manage admin users and their access.</p>
          </div>
          <button
            class="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
            @click="startNew"
          >
            <Plus class="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      <!-- ───── Form Card ───── -->
      <article v-if="showForm" class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
              <Pencil class="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold">{{ editingId ? 'Edit User' : 'New User' }}</h2>
              <p class="text-sm text-slate-500">{{ editingId ? 'Update user details.' : 'Create a new admin user.' }}</p>
            </div>
          </div>
        </div>
        <div class="space-y-4 p-6">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Name</label>
              <input v-model="form.name" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="Full name" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Email</label>
              <input v-model="form.email" type="email" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="user@example.com" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Password {{ editingId ? '(leave blank to keep)' : '' }}</label>
              <input v-model="form.password" type="password" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="••••••••" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Role</label>
              <select v-model="form.role" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200">
                <option v-for="r in roles" :key="r.id" :value="r.name">{{ r.name }}</option>
                <option v-if="roles.length === 0" value="admin">admin</option>
                <option v-if="roles.length === 0" value="editor">editor</option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <label class="relative inline-flex cursor-pointer items-center">
              <input v-model="form.isActive" type="checkbox" class="peer sr-only" />
              <div class="h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-violet-600 peer-checked:after:translate-x-full" />
            </label>
            <span class="text-sm text-slate-700">Active</span>
          </div>
          <div class="flex items-center gap-3 border-t border-slate-100 pt-4">
            <button
              class="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-50"
              :disabled="saving || !form.name || !form.email"
              @click="save"
            >
              <Save class="h-4 w-4" />
              {{ editingId ? 'Update' : 'Create' }}
            </button>
            <button class="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50" @click="cancelForm">
              <X class="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      </article>

      <!-- ───── Users Table ───── -->
      <article class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
              <Users class="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold">All Users</h2>
              <p class="text-sm text-slate-500">{{ users.length }} user{{ users.length !== 1 ? 's' : '' }} registered.</p>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-left">
                <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="user in users" :key="user.id" class="transition-colors hover:bg-slate-50">
                <td class="px-6 py-3 font-medium text-slate-900">{{ user.name }}</td>
                <td class="px-6 py-3 text-slate-500">{{ user.email }}</td>
                <td class="px-6 py-3">
                  <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{{ user.role }}</span>
                </td>
                <td class="px-6 py-3">
                  <span v-if="user.isActive" class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 class="h-3 w-3" /> Active
                  </span>
                  <span v-else class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                    <XCircle class="h-3 w-3" /> Inactive
                  </span>
                </td>
                <td class="px-6 py-3 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" title="Edit" @click="startEdit(user)">
                      <Pencil class="h-3.5 w-3.5" />
                    </button>
                    <button class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600" title="Delete" @click="remove(user.id)">
                      <Trash2 class="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-sm text-slate-400">No users found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  </AdminLayout>
</template>
