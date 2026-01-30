<script setup lang="ts">
defineProps<{
	label: string;
	active?: boolean;
	type: 'live' | 'rec' | 'connection';
}>();
</script>

<template>
	<div class="flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-500 border"
		:class="{
			'bg-brand-rose/10 text-brand-rose border-brand-rose/20 glow-rose': (type === 'live' && active) || (type === 'connection' && !active),
			'bg-slate-500/10 text-slate-400 border-slate-500/10': (type === 'live' && !active) || (type === 'rec' && !active),
			'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20 glow-indigo': type === 'rec' && active,
			'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20 glow-emerald': type === 'connection' && active,
		}">
		<span v-if="active" class="relative flex h-2 w-2">
			<span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="{
				'bg-brand-rose': type === 'live' || (type === 'connection' && !active),
				'bg-brand-indigo': type === 'rec',
				'bg-brand-emerald': type === 'connection' && active,
			}"></span>
			<span class="relative inline-flex rounded-full h-2 w-2" :class="{
				'bg-brand-rose': type === 'live' || (type === 'connection' && !active),
				'bg-brand-indigo': type === 'rec',
				'bg-brand-emerald': type === 'connection' && active,
			}"></span>
		</span>
		<div v-else class="w-2 h-2 rounded-full bg-current opacity-30"></div>
		{{ label }}
	</div>
</template>
