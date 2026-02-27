<script setup lang="ts">
import { computed } from "vue";
import {
  BarChart3,
  TrendingUp,
  Layers,
  Filter,
  PieChart,
  Table2,
  BookOpen,
  Database,
  CheckCircle2,
  XCircle,
} from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";

const monthlyViews = [120, 180, 150, 220, 260, 310, 280];
const monthlyPosts = [4, 6, 5, 8, 9, 12, 10];
const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthlyTraffic = [
  { month: "Jan", organic: 4200, social: 1500, referral: 900 },
  { month: "Feb", organic: 4700, social: 1800, referral: 1100 },
  { month: "Mar", organic: 5100, social: 2100, referral: 1300 },
  { month: "Apr", organic: 5600, social: 2400, referral: 1450 },
  { month: "May", organic: 6000, social: 2600, referral: 1600 },
  { month: "Jun", organic: 6400, social: 2900, referral: 1850 },
];

const funnel = [
  { stage: "Visitors", value: 12000 },
  { stage: "Signups", value: 3600 },
  { stage: "Qualified Leads", value: 1250 },
  { stage: "Customers", value: 420 },
];

const sourceShare = [
  { source: "Organic", value: 52 },
  { source: "Social", value: 26 },
  { source: "Referral", value: 14 },
  { source: "Direct", value: 8 },
];

const maxViews = computed(() => Math.max(...monthlyViews));
const maxPosts = computed(() => Math.max(...monthlyPosts));
const maxTraffic = computed(() =>
  Math.max(...monthlyTraffic.map((item) => item.organic + item.social + item.referral)),
);
const maxFunnel = computed(() => Math.max(...funnel.map((item) => item.value)));

const linePoints = computed(() => {
  const width = 560;
  const height = 180;
  const step = width / (monthlyViews.length - 1);

  return monthlyViews
    .map((value, index) => {
      const x = index * step;
      const y = height - (value / maxViews.value) * height;
      return `${x},${y}`;
    })
    .join(" ");
});

const areaPath = computed(() => {
  const width = 560;
  const height = 180;
  const step = width / (monthlyViews.length - 1);

  const points = monthlyViews.map((value, index) => {
    const x = index * step;
    const y = height - (value / maxViews.value) * height;
    return `${x},${y}`;
  });

  return `M0,${height} L${points.join(" L")} L${width},${height} Z`;
});

const totalShare = computed(() => sourceShare.reduce((sum, row) => sum + row.value, 0));
const pieGradient = computed(() => {
  let start = 0;
  const colors = ["#0f172a", "#475569", "#94a3b8", "#cbd5e1"];
  const segments = sourceShare.map((row, index) => {
    const end = start + row.value;
    const segment = `${colors[index % colors.length]} ${start}% ${end}%`;
    start = end;
    return segment;
  });
  return `conic-gradient(${segments.join(", ")})`;
});

const sectionLinks = [
  { id: "bar-chart", label: "Bar Chart", icon: BarChart3 },
  { id: "line-chart", label: "Line Chart", icon: TrendingUp },
  { id: "stacked-bar", label: "Stacked Bar", icon: Layers },
  { id: "funnel", label: "Funnel", icon: Filter },
  { id: "pie-chart", label: "Pie Chart", icon: PieChart },
  { id: "data-table", label: "Data Table", icon: Table2 },
];
</script>

<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-4">
      <!-- ───── Hero Header ───── -->
      <div class="flex items-center justify-between">
        <h1 class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-[1.45rem] font-bold tracking-tight text-transparent">Kitchen Sink: Charts</h1>
        <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{{ sectionLinks.length }} Charts</span>
      </div>

      <!-- ───── Quick Jump Nav ───── -->
      <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Jump</p>
        <div class="grid gap-1.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <a
            v-for="link in sectionLinks"
            :key="link.id"
            :href="`#${link.id}`"
            class="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
          >
            <component :is="link.icon" class="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-600" />
            {{ link.label }}
          </a>
        </div>
      </div>

      <section class="grid gap-4 md:grid-cols-2">
        <!-- ═══════ BAR CHART ═══════ -->
        <article id="bar-chart" class="scroll-mt-24 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <BarChart3 class="h-4 w-4 text-blue-600" />
            <h2 class="text-sm font-semibold text-slate-900">Bar Chart</h2>
          </div>
          <div class="p-4">
            <div class="flex h-64 items-end justify-between gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-5">
              <div v-for="(value, index) in monthlyPosts" :key="labels[index]" class="flex flex-1 flex-col items-center gap-2">
                <div class="text-xs font-medium text-slate-500">{{ value }}</div>
                <div
                  class="w-full rounded-t-md bg-slate-900 transition-all"
                  :style="{ height: `${(value / maxPosts) * 180}px`, minHeight: '10px' }"
                />
                <div class="text-xs font-medium text-slate-600">{{ labels[index] }}</div>
              </div>
            </div>
          </div>
        </article>

        <!-- ═══════ LINE CHART ═══════ -->
        <article id="line-chart" class="scroll-mt-24 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <TrendingUp class="h-4 w-4 text-emerald-600" />
            <h2 class="text-sm font-semibold text-slate-900">Line Chart</h2>
          </div>
          <div class="p-4">
            <div class="rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-5">
              <svg viewBox="0 0 560 220" class="h-64 w-full">
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0f172a" stop-opacity="0.12" />
                    <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
                  </linearGradient>
                </defs>
                <!-- grid lines -->
                <line v-for="i in 4" :key="`grid-${i}`" x1="0" :y1="(i - 1) * 60" x2="560" :y2="(i - 1) * 60" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4 4" />
                <line x1="0" y1="180" x2="560" y2="180" stroke="#cbd5e1" stroke-width="1" />
                <!-- area fill -->
                <path :d="areaPath" fill="url(#areaFill)" />
                <!-- line -->
                <polyline :points="linePoints" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                <!-- dots -->
                <g v-for="(value, index) in monthlyViews" :key="`point-${labels[index]}`">
                  <circle
                    :cx="(560 / (monthlyViews.length - 1)) * index"
                    :cy="180 - (value / maxViews) * 180"
                    r="5"
                    fill="white"
                    stroke="#0f172a"
                    stroke-width="2.5"
                  />
                </g>
              </svg>
              <div class="mt-2 grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-600">
                <span v-for="label in labels" :key="label">{{ label }}</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section class="grid gap-4 md:grid-cols-2">
        <!-- ═══════ STACKED BAR ═══════ -->
        <article id="stacked-bar" class="scroll-mt-24 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <Layers class="h-4 w-4 text-violet-600" />
            <h2 class="text-sm font-semibold text-slate-900">Stacked Bar (Traffic Mix)</h2>
          </div>
          <div class="p-4">
            <div class="space-y-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-5">
              <div v-for="item in monthlyTraffic" :key="item.month" class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-medium text-slate-700">{{ item.month }}</span>
                  <span class="font-mono text-slate-500">{{ (item.organic + item.social + item.referral).toLocaleString() }}</span>
                </div>
                <div class="flex h-5 overflow-hidden rounded-md bg-slate-200">
                  <div
                    class="bg-slate-900 transition-all"
                    :style="{ width: `${((item.organic / maxTraffic) * 100).toFixed(2)}%` }"
                  />
                  <div
                    class="bg-slate-500 transition-all"
                    :style="{ width: `${((item.social / maxTraffic) * 100).toFixed(2)}%` }"
                  />
                  <div
                    class="bg-slate-300 transition-all"
                    :style="{ width: `${((item.referral / maxTraffic) * 100).toFixed(2)}%` }"
                  />
                </div>
              </div>
              <div class="flex items-center gap-5 border-t border-slate-200 pt-3 text-xs text-slate-600">
                <span class="flex items-center gap-1.5"><span class="inline-block h-2.5 w-2.5 rounded bg-slate-900" />Organic</span>
                <span class="flex items-center gap-1.5"><span class="inline-block h-2.5 w-2.5 rounded bg-slate-500" />Social</span>
                <span class="flex items-center gap-1.5"><span class="inline-block h-2.5 w-2.5 rounded bg-slate-300" />Referral</span>
              </div>
            </div>
          </div>
        </article>

        <!-- ═══════ FUNNEL ═══════ -->
        <article id="funnel" class="scroll-mt-24 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <Filter class="h-4 w-4 text-amber-600" />
            <h2 class="text-sm font-semibold text-slate-900">Funnel Chart</h2>
          </div>
          <div class="p-4">
            <div class="space-y-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-5">
              <div v-for="step in funnel" :key="step.stage" class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-medium text-slate-700">{{ step.stage }}</span>
                  <span class="font-mono text-slate-500">{{ step.value.toLocaleString() }}</span>
                </div>
                <div class="h-8 rounded-lg bg-slate-200 p-1">
                  <div
                    class="flex h-full items-center rounded-md bg-slate-900 px-2.5 text-xs font-medium text-white transition-all"
                    :style="{ width: `${Math.max((step.value / maxFunnel) * 100, 10).toFixed(2)}%` }"
                  >
                    {{ Math.round((step.value / maxFunnel) * 100) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section class="grid gap-4 md:grid-cols-2">
        <!-- ═══════ PIE CHART ═══════ -->
        <article id="pie-chart" class="scroll-mt-24 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <PieChart class="h-4 w-4 text-pink-600" />
            <h2 class="text-sm font-semibold text-slate-900">Pie Chart Breakdown</h2>
          </div>
          <div class="p-4">
            <div class="rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-5">
              <div class="flex items-center gap-8">
                <div class="h-40 w-40 shrink-0 rounded-full shadow-inner" :style="{ background: pieGradient }" />
                <div class="flex-1 space-y-2.5">
                  <div v-for="(row, idx) in sourceShare" :key="row.source" class="flex items-center justify-between text-sm">
                    <span class="flex items-center gap-2 text-slate-700">
                      <span
                        class="inline-block h-3 w-3 rounded"
                        :class="idx === 0 ? 'bg-slate-900' : idx === 1 ? 'bg-slate-600' : idx === 2 ? 'bg-slate-400' : 'bg-slate-300'"
                      />
                      {{ row.source }}
                    </span>
                    <span class="font-mono text-sm font-medium text-slate-900">{{ row.value }}%</span>
                  </div>
                  <div class="border-t border-slate-200 pt-2 text-xs text-slate-400">Total: {{ totalShare }}%</div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- ═══════ DATA TABLE ═══════ -->
        <article id="data-table" class="scroll-mt-24 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <Table2 class="h-4 w-4 text-rose-600" />
            <h2 class="text-sm font-semibold text-slate-900">Sample Dataset Table</h2>
          </div>
          <div class="p-4">
            <div class="overflow-x-auto rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-5">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-slate-200">
                    <th class="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Month</th>
                    <th class="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Organic</th>
                    <th class="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Social</th>
                    <th class="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Referral</th>
                    <th class="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in monthlyTraffic" :key="`row-${item.month}`" class="border-b border-slate-100 transition-colors hover:bg-white">
                    <td class="py-3 font-medium text-slate-900">{{ item.month }}</td>
                    <td class="py-3 font-mono text-slate-600">{{ item.organic.toLocaleString() }}</td>
                    <td class="py-3 font-mono text-slate-600">{{ item.social.toLocaleString() }}</td>
                    <td class="py-3 font-mono text-slate-600">{{ item.referral.toLocaleString() }}</td>
                    <td class="py-3 text-right font-mono font-medium text-slate-900">{{ (item.organic + item.social + item.referral).toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </section>

      <section class="grid gap-4 md:grid-cols-2">
        <!-- ═══════ USAGE NOTES ═══════ -->
        <article class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <BookOpen class="h-4 w-4 text-teal-600" />
            <h2 class="text-sm font-semibold text-slate-900">Usage Notes</h2>
          </div>
          <div class="space-y-4 p-4">
            <div class="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
              <CheckCircle2 class="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div class="text-sm text-emerald-900">
                <p class="mb-1 font-semibold">Do</p>
                <p>Use consistent scales and short time labels for quick scanning.</p>
              </div>
            </div>
            <div class="flex gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
              <XCircle class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div class="text-sm text-amber-900">
                <p class="mb-1 font-semibold">Don&apos;t</p>
                <p>Do not mix too many metrics in one chart without clear legends.</p>
              </div>
            </div>
          </div>
        </article>

        <!-- ═══════ SAMPLING NOTES ═══════ -->
        <article class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <Database class="h-4 w-4 text-indigo-600" />
            <h2 class="text-sm font-semibold text-slate-900">Sampling Notes</h2>
          </div>
          <div class="p-4">
            <div class="space-y-2.5 rounded-lg border border-slate-200 bg-slate-50/50 p-5 text-sm text-slate-600">
              <div class="flex items-start gap-2">
                <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                <p>Dataset window: 7-day and 6-month samples.</p>
              </div>
              <div class="flex items-start gap-2">
                <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                <p>Traffic mix includes organic, social, and referral channels.</p>
              </div>
              <div class="flex items-start gap-2">
                <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                <p>Funnel values are sampled for demo, not real production telemetry.</p>
              </div>
              <div class="flex items-start gap-2">
                <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                <p>Recommended refresh cadence: daily aggregate updates.</p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  </AdminLayout>
</template>
