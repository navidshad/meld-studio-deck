<script setup lang="ts">
defineProps<{
  label: string;
  active?: boolean;
  color?: 'indigo' | 'red' | 'green' | 'slate';
}>();

const emit = defineEmits(['click']);
</script>

<template>
  <button
    @click="emit('click')"
    class="glass glass-hover rounded-xl p-4 flex flex-col items-center justify-center aspect-square transition-all active:scale-95 group relative overflow-hidden"
    :class="{
      'ring-2 ring-indigo-500 bg-indigo-500/10': active && color === 'indigo',
      'ring-2 ring-red-500 bg-red-500/10': active && color === 'red',
      'ring-2 ring-green-500 bg-green-500/10': active && color === 'green',
      'ring-2 ring-slate-500 bg-slate-500/10': active && color === 'slate',
    }"
  >
    <div 
      class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-white to-transparent pointer-events-none"
    ></div>
    
    <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 group-hover:text-slate-300 transition-colors">
      {{ label }}
    </span>
    
    <slot name="icon"></slot>
    <slot></slot>
    
    <div 
      v-if="active" 
      class="absolute top-2 right-2 w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
      :class="{
        'bg-indigo-400': color === 'indigo',
        'bg-red-400': color === 'red',
        'bg-green-400': color === 'green',
        'bg-slate-400': color === 'slate',
      }"
    ></div>
  </button>
</template>
