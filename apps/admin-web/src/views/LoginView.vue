<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Shield, LogIn, AlertCircle } from "lucide-vue-next";

import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const email = ref("admin@example.com");
const password = ref("admin12345");
const error = ref("");

async function submit() {
  error.value = "";
  try {
    await auth.signIn(email.value, password.value);
    router.push("/");
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Login failed";
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0); background-size: 24px 24px;" />

    <div class="relative w-full max-w-md">
      <!-- Card -->
      <div class="rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <!-- Branding -->
        <div class="mb-8 flex flex-col items-center text-center">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200">
            <Shield class="h-6 w-6 text-white" />
          </div>
          <h1 class="text-xl font-bold tracking-tight text-slate-900">CORRAD+</h1>
          <p class="mt-1 text-sm text-slate-500">Sign in to the Admin panel</p>
        </div>

        <!-- Form -->
        <form class="space-y-4" @submit.prevent="submit">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-slate-700">Email</label>
            <input
              v-model="email"
              type="email"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="you@example.com"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-slate-700">Password</label>
            <input
              v-model="password"
              type="password"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Enter your password"
            />
          </div>

          <!-- Error -->
          <div v-if="error" class="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
            <AlertCircle class="h-4 w-4 shrink-0" />
            {{ error }}
          </div>

          <button
            type="submit"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-50"
            :disabled="auth.loading"
          >
            <LogIn v-if="!auth.loading" class="h-4 w-4" />
            {{ auth.loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>

      <!-- Footer -->
      <p class="mt-6 text-center text-xs text-slate-400">CORRAD+ Admin &middot; CMS</p>
    </div>
  </div>
</template>
