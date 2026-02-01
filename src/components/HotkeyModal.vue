<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { X, Command, Delete, Save } from 'lucide-vue-next';

const props = defineProps<{
	actionId: string;
	currentShortcut?: string;
	actionName?: string;
}>();

const emit = defineEmits(['close', 'save', 'clear']);

const recording = ref(true);
const keys = ref<string[]>([]);

// Mapping for display
const keyDisplayMap: Record<string, string> = {
	'Meta': '⌘',
	'Control': 'Ctrl',
	'Alt': 'Alt',
	'Shift': 'Shift',
	' ': 'Space'
};

const handleKeyDown = (e: KeyboardEvent) => {
	if (!recording.value) return;
	e.preventDefault();
	e.stopPropagation();

	// Reset if it's the start of a new combo (no modifiers held yet)
	// But actually we just want to capture the current set of keys pressed?
	// Electron Accelerator format needs modifiers + key.

	// Let's build the array based on what's pressed.
	const currentKeys = new Set<string>();
	if (e.metaKey) currentKeys.add('CommandOrControl');
	if (e.ctrlKey) currentKeys.add('Control');
	if (e.altKey) currentKeys.add('Alt');
	if (e.shiftKey) currentKeys.add('Shift');

	const key = e.key.toUpperCase();
	// Filter out modifier keys from the "key" part
	if (!['META', 'CONTROL', 'ALT', 'SHIFT'].includes(key)) {
		// If it's a regular key, add it
		// Handle special keys mapping if needed for Electron
		let finalKey = key;
		if (e.code.startsWith('Digit')) finalKey = e.code.replace('Digit', '');
		if (e.code.startsWith('Key')) finalKey = e.code.replace('Key', '');
		if (key === ' ') finalKey = 'Space';

		currentKeys.add(finalKey);
	}

	// Convert Set to Array and sort for consistency
	// Order: Command, Control, Alt, Shift, Key
	const sorted: string[] = [];
	if (currentKeys.has('CommandOrControl')) sorted.push('CommandOrControl');
	if (currentKeys.has('Control')) sorted.push('Control');
	if (currentKeys.has('Alt')) sorted.push('Alt');
	if (currentKeys.has('Shift')) sorted.push('Shift');

	// Add rest
	currentKeys.forEach(k => {
		if (!['CommandOrControl', 'Control', 'Alt', 'Shift'].includes(k)) {
			sorted.push(k);
		}
	});

	keys.value = sorted;
};

// Start listening globally for this modal
onMounted(() => {
	window.addEventListener('keydown', handleKeyDown);
	if (props.currentShortcut) {
		keys.value = props.currentShortcut.split('+');
		// Don't start recording immediately if existing? 
		// Actually typically you want to click "Record" or just type.
		// Let's assume typing overwrites.
	} else {
		keys.value = [];
	}
});

onUnmounted(() => {
	window.removeEventListener('keydown', handleKeyDown);
});

const save = () => {
	if (keys.value.length === 0) return;
	emit('save', keys.value.join('+'));
};

const clear = () => {
	keys.value = [];
	emit('clear');
};

const displayKey = (k: string) => {
	if (k === 'CommandOrControl') return '⌘';
	return keyDisplayMap[k] || k;
};
</script>

<template>
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
		@click.self="emit('close')">
		<div
			class="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
			<!-- Header -->
			<div class="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
				<h3 class="text-white font-bold text-lg flex items-center gap-2">
					<Command :size="20" class="text-brand-indigo" />
					Set Hotkey
				</h3>
				<button @click="emit('close')" class="text-slate-400 hover:text-white transition-colors">
					<X :size="20" />
				</button>
			</div>

			<!-- Content -->
			<div class="p-8 flex flex-col items-center gap-6">
				<p class="text-slate-400 text-sm text-center">
					Press the key combination you want to use for <br>
					<strong class="text-white">{{ actionName || 'this action' }}</strong>
				</p>

				<!-- Key Display -->
				<div class="h-24 w-full bg-black/30 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center gap-2 transition-all"
					:class="{ 'border-brand-indigo/50 bg-brand-indigo/5': recording }">

					<span v-if="keys.length === 0" class="text-slate-600 font-medium animate-pulse">
						Listening for keys...
					</span>

					<template v-else>
						<div v-for="(k, i) in keys" :key="i" class="flex items-center">
							<kbd
								class="px-3 py-1.5 rounded-lg bg-white/10 border-b-2 border-white/5 text-white font-mono font-bold text-lg min-w-[2rem] text-center shadow-lg">
								{{ displayKey(k) }}
							</kbd>
							<span v-if="i < keys.length - 1" class="mx-2 text-slate-500">+</span>
						</div>
					</template>
				</div>

				<div class="flex gap-3 w-full">
					<button @click="clear"
						class="flex-1 py-3 bg-white/5 hover:bg-white/10 hover:text-rose-400 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
						<Delete :size="16" />
						Clear
					</button>
					<button @click="save" :disabled="keys.length === 0"
						class="flex-[2] py-3 bg-brand-indigo hover:bg-brand-indigo/80 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20">
						<Save :size="16" />
						Save Shortcut
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
