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
    <div class="mx-auto max-w-7xl space-y-4">
      <!-- ───── Hero Header ───── -->
      <div class="flex items-center justify-between">
        <h1 class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-[1.45rem] font-bold tracking-tight text-transparent">Users</h1>
        <button
          class="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
          @click="startNew"
        >
          <Plus class="h-4 w-4" />
          Add User
        </button>
      </div>

      <!-- ───── Form Card ───── -->
      <article v-if="showForm" class="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
          <Pencil class="h-4 w-4 text-violet-600" />
          <h2 class="text-sm font-semibold text-slate-900">{{ editingId ? 'Edit User' : 'New User' }}</h2>
        </div>
        <div class="space-y-3 p-4">
          <div class="grid gap-3 md:grid-cols-2">
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
          <div class="flex items-center gap-3 border-t border-slate-100 pt-3">
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
      <article class="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
          <Users class="h-4 w-4 text-blue-600" />
          <h2 class="text-sm font-semibold text-slate-900">All Users</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-left">
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th class="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="user in users" :key="user.id" class="transition-colors hover:bg-slate-50">
                <td class="px-4 py-2 font-medium text-slate-900">{{ user.name }}</td>
                <td class="px-4 py-2 text-slate-500">{{ user.email }}</td>
                <td class="px-4 py-2">
                  <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{{ user.role }}</span>
                </td>
                <td class="px-4 py-2">
                  <span v-if="user.isActive" class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 class="h-3 w-3" /> Active
                  </span>
                  <span v-else class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                    <XCircle class="h-3 w-3" /> Inactive
                  </span>
                </td>
                <td class="px-4 py-2 text-right">
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
                <td colspan="5" class="px-4 py-6 text-center text-sm text-slate-400">No users found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  </AdminLayout>
</template>
