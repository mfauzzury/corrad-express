<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  User,
  Lock,
  Camera,
  Save,
  CheckCircle2,
  Upload,
  Trash2,
} from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";
import { useAuthStore } from "@/stores/auth";
import { API_BASE_URL } from "@/env";

const auth = useAuthStore();

const profileForm = ref({ name: "", email: "" });
const passwordForm = ref({ currentPassword: "", newPassword: "", confirmPassword: "" });

const savingProfile = ref(false);
const savingPassword = ref(false);
const uploadingAvatar = ref(false);
const profileSaved = ref(false);
const passwordChanged = ref(false);
const profileError = ref("");
const passwordError = ref("");
const avatarError = ref("");

const fileInput = ref<HTMLInputElement>();

const userInitials = computed(() => {
  if (!auth.user?.name) return "A";
  return auth.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

function resolveUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}

function syncProfileForm() {
  if (auth.user) {
    profileForm.value.name = auth.user.name;
    profileForm.value.email = auth.user.email;
  }
}

watch(() => auth.user, syncProfileForm, { immediate: true });

async function saveProfile() {
  savingProfile.value = true;
  profileError.value = "";
  try {
    await auth.updateProfile(profileForm.value);
    profileSaved.value = true;
    setTimeout(() => { profileSaved.value = false; }, 2000);
  } catch (e: unknown) {
    profileError.value = e instanceof Error ? e.message : "Failed to update profile";
  } finally {
    savingProfile.value = false;
  }
}

async function savePassword() {
  passwordError.value = "";
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = "New password and confirmation do not match";
    return;
  }
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    passwordError.value = "Please fill in all password fields";
    return;
  }
  savingPassword.value = true;
  try {
    await auth.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    });
    passwordChanged.value = true;
    passwordForm.value = { currentPassword: "", newPassword: "", confirmPassword: "" };
    setTimeout(() => { passwordChanged.value = false; }, 2000);
  } catch (e: unknown) {
    passwordError.value = e instanceof Error ? e.message : "Failed to change password";
  } finally {
    savingPassword.value = false;
  }
}

async function onAvatarUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  uploadingAvatar.value = true;
  avatarError.value = "";
  try {
    await auth.uploadAvatar(file);
  } catch (e: unknown) {
    avatarError.value = e instanceof Error ? e.message : "Failed to upload photo";
  } finally {
    uploadingAvatar.value = false;
    (event.target as HTMLInputElement).value = "";
  }
}

async function onRemoveAvatar() {
  avatarError.value = "";
  try {
    await auth.removeAvatar();
  } catch (e: unknown) {
    avatarError.value = e instanceof Error ? e.message : "Failed to remove photo";
  }
}
</script>

<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-4">
      <!-- ───── Page Title ───── -->
      <div class="flex items-center justify-between">
        <h1 class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-[1.45rem] font-bold tracking-tight text-transparent">My Profile</h1>
      </div>

      <div class="grid gap-4 lg:grid-cols-[1fr_280px]">
        <!-- ═══════ LEFT COLUMN ═══════ -->
        <div class="space-y-4">
          <!-- ── Profile Information ── -->
          <article class="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
              <User class="h-4 w-4 text-violet-600" />
              <h2 class="text-sm font-semibold text-slate-900">Profile Information</h2>
            </div>
            <div class="p-4">
              <div v-if="profileError" class="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {{ profileError }}
              </div>
              <div v-if="profileSaved" class="mb-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                <CheckCircle2 class="h-4 w-4" />
                Profile updated successfully
              </div>
              <div class="grid gap-3 md:grid-cols-2">
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    v-model="profileForm.name"
                    type="text"
                    class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Email Address</label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>
              <div class="mt-4 flex justify-end">
                <button
                  class="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
                  :disabled="savingProfile"
                  @click="saveProfile"
                >
                  <Save class="h-3.5 w-3.5" />
                  {{ savingProfile ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </article>

          <!-- ── Change Password ── -->
          <article class="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
              <Lock class="h-4 w-4 text-amber-600" />
              <h2 class="text-sm font-semibold text-slate-900">Change Password</h2>
            </div>
            <div class="p-4">
              <div v-if="passwordError" class="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {{ passwordError }}
              </div>
              <div v-if="passwordChanged" class="mb-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                <CheckCircle2 class="h-4 w-4" />
                Password changed successfully
              </div>
              <div class="space-y-3">
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Current Password</label>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
                <div class="grid gap-3 md:grid-cols-2">
                  <div class="space-y-1.5">
                    <label class="text-sm font-medium text-slate-700">New Password</label>
                    <input
                      v-model="passwordForm.newPassword"
                      type="password"
                      class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                </div>
              </div>
              <div class="mt-4 flex justify-end">
                <button
                  class="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
                  :disabled="savingPassword"
                  @click="savePassword"
                >
                  <Lock class="h-3.5 w-3.5" />
                  {{ savingPassword ? 'Changing...' : 'Change Password' }}
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- ═══════ RIGHT COLUMN ═══════ -->
        <div class="space-y-4">
          <!-- ── Profile Photo ── -->
          <article class="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
              <Camera class="h-4 w-4 text-indigo-600" />
              <h2 class="text-sm font-semibold text-slate-900">Profile Photo</h2>
            </div>
            <div class="flex flex-col items-center p-4">
              <div v-if="avatarError" class="mb-3 w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {{ avatarError }}
              </div>
              <!-- Avatar preview -->
              <div class="mb-4">
                <img
                  v-if="auth.user?.photoUrl"
                  :src="resolveUrl(auth.user.photoUrl)"
                  alt="Profile photo"
                  class="h-24 w-24 rounded-full border-2 border-slate-200 object-cover"
                />
                <div
                  v-else
                  class="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-2xl font-semibold text-white"
                >
                  {{ userInitials }}
                </div>
              </div>
              <!-- Upload / Remove -->
              <div class="flex items-center gap-2">
                <label
                  class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  :class="uploadingAvatar ? 'opacity-50 pointer-events-none' : ''"
                >
                  <Upload class="h-4 w-4" />
                  {{ uploadingAvatar ? 'Uploading...' : 'Upload' }}
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    :disabled="uploadingAvatar"
                    @change="onAvatarUpload"
                  />
                </label>
                <button
                  v-if="auth.user?.photoUrl"
                  class="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  @click="onRemoveAvatar"
                >
                  <Trash2 class="h-4 w-4" />
                  Remove
                </button>
              </div>
              <p class="mt-3 text-center text-xs text-slate-400">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
