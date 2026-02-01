<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next';
import { Pin, PinOff, Loader2, Keyboard } from 'lucide-vue-next';

defineProps<{
  label?: string;
  active?: boolean;
  loading?: boolean;
  color?: 'indigo' | 'red' | 'green' | 'slate';
  icon?: LucideIcon;
  pinned?: boolean;
  showPin?: boolean;
  enableHotkeyConfig?: boolean;
}>();

const emit = defineEmits(['click', 'togglePin', 'openHotkeyModal']);
</script>

<template>
  <div class="relative group/deck h-full">
    <button @click="emit('click')" :disabled="loading"
      class="w-full h-full glass-card rounded-xl p-2 flex flex-col items-center justify-center gap-2 relative overflow-hidden active:scale-95 group transition-all duration-200 outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer disabled:opacity-80 disabled:cursor-wait"
      :class="{
        'border-indigo-500/50 bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]': active && color === 'indigo' && !loading,
        'border-rose-500/50 bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.3)]': active && color === 'red' && !loading,
        'border-emerald-500/50 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]': active && color === 'green' && !loading,
        'border-slate-500/50 bg-slate-500/20 shadow-[0_0_15px_rgba(148,163,184,0.3)]': active && color === 'slate' && !loading,
        'hover:bg-white/5 border-white/5': !active && !loading,
        'border-white/10 bg-white/5': loading
      }">

      <!-- Icon Container -->
      <div class="rounded-lg flex items-center justify-center transition-all duration-300" :class="{
        'text-indigo-300 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]': active && color === 'indigo' && !loading,
        'text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]': active && color === 'red' && !loading,
        'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]': active && color === 'green' && !loading,
        'text-slate-300': active && color === 'slate' && !loading,
        'text-slate-400 group-hover:text-slate-200': !active && !loading,
        'text-slate-400': loading
      }">
        <Loader2 v-if="loading" :size="24" class="animate-spin" />
        <template v-else>
          <component :is="icon" v-if="icon" :size="24" stroke-width="2" />
          <slot v-else name="icon"></slot>
        </template>
      </div>

      <!-- Title -->
      <div class="text-[11px] font-medium text-center leading-tight transition-colors"
        :class="active && !loading ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'">
        <slot></slot>
      </div>

    </button>

    <!-- Pin Toggle -->
    <button v-if="showPin" @click.stop="emit('togglePin')"
      class="absolute top-1 right-1 p-1.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-slate-500 hover:text-white transition-all opacity-0 group-hover/deck:opacity-100 scale-90 hover:scale-100"
      :class="{ 'opacity-100 text-indigo-400 border-indigo-500/30': pinned }">
      <component :is="pinned ? PinOff : Pin" :size="12" />
    </button>

    <!-- Hotkey Trigger -->
    <button v-if="enableHotkeyConfig" @click.stop="emit('openHotkeyModal')"
      class="absolute bottom-1 right-1 p-1.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-slate-500 hover:text-white transition-all opacity-0 group-hover/deck:opacity-100 scale-90 hover:scale-100"
      title="Set Hotkey">
      <Keyboard :size="12" />
    </button>
  </div>
</template>
