<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next';
import { Pin, PinOff } from 'lucide-vue-next';

defineProps<{
  label: string;
  active?: boolean;
  color?: 'indigo' | 'red' | 'green' | 'slate';
  icon?: LucideIcon;
  pinned?: boolean;
  showPin?: boolean;
}>();

const emit = defineEmits(['click', 'togglePin']);
</script>

<template>
  <div class="relative group/deck">
    <button @click="emit('click')"
      class="w-full glass-card rounded-2xl p-4 flex flex-col items-center justify-center gap-3 aspect-square relative overflow-hidden active:scale-95 group"
      :class="{
        'border-indigo-500/30 bg-indigo-500/5 glow-indigo': active && color === 'indigo',
        'border-brand-rose/30 bg-brand-rose/5 glow-rose': active && color === 'red',
        'border-brand-emerald/30 bg-brand-emerald/5 glow-emerald': active && color === 'green',
        'border-slate-500/30 bg-slate-500/5': active && color === 'slate',
      }">
      <!-- Background Sparkle Effect -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style="background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06) 0%, transparent 80%);">
      </div>

      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-white/5 border border-white/5 group-hover:bg-white/10"
        :class="{
          'text-indigo-400': color === 'indigo',
          'text-brand-rose': color === 'red',
          'text-brand-emerald': color === 'green',
          'text-slate-400': color === 'slate' || !color,
        }">
        <component :is="icon" v-if="icon" :size="20" stroke-width="2" />
        <slot v-else name="icon"></slot>
      </div>

      <div class="flex flex-col items-center gap-0.5">
        <span
          class="text-[10px] font-bold uppercase tracking-[0.15em] opacity-40 group-hover:opacity-60 transition-opacity">
          {{ label }}
        </span>
        <div class="text-[13px] font-semibold text-slate-200 text-center leading-tight">
          <slot></slot>
        </div>
      </div>

      <!-- Active Indicator Pill -->
      <div v-if="active" class="absolute bottom-3 w-1.5 h-1.5 rounded-full transition-all duration-500" :class="{
        'bg-indigo-400 glow-indigo shadow-[0_0_10px_rgba(99,102,241,0.8)]': color === 'indigo',
        'bg-brand-rose glow-rose shadow-[0_0_10px_rgba(244,63,94,0.8)]': color === 'red',
        'bg-brand-emerald glow-emerald shadow-[0_0_10px_rgba(16,185,129,0.8)]': color === 'green',
        'bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.8)]': color === 'slate',
      }"></div>
    </button>

    <!-- Pin Toggle -->
    <button v-if="showPin" @click.stop="emit('togglePin')"
      class="absolute top-2 right-2 p-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/5 text-slate-500 hover:text-white transition-all opacity-0 group-hover/deck:opacity-100"
      :class="{ 'opacity-100 text-brand-indigo': pinned }">
      <component :is="pinned ? PinOff : Pin" :size="14" />
    </button>
  </div>
</template>
