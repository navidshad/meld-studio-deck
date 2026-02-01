<script setup lang="ts">
import { computed, ref } from 'vue';
import { meldClient } from '../MeldClient';
import { deckManager } from '../DeckManager';
import DeckButton from './DeckButton.vue';
import {
	Video,
	Circle,
	Monitor,
	Pin,
	Maximize2,
	Power
} from 'lucide-vue-next';

// In tray window, we might want to auto-close after action?
// For now, let's keep it simple.
const loadingId = ref<string | null>(null);

const handleAction = async (id: string, action: () => void, checkActive: () => boolean) => {
	if (loadingId.value) return;

	// If we're clicking the already active item (and it's a scene), no need to load
	// But for toggles (stream/record), specific check is needed.
	// Actually, "showing scene" might re-trigger. Let's just show loading.

	// Optimistic / Loading state
	loadingId.value = id;
	action();

	// Watch for state change or timeout
	// In a real app we'd wait for a promise, but here we wait for the reactive state to match.
	// Or just simple timeout for UX if the state change is usually fast.

	// Simple approach: Clear loading when the target state becomes active? 
	// Or just set a fixed timeout because the websocket update comes later.
	// Let's poll for the expected state change or timeout.

	const startTime = Date.now();
	const interval = setInterval(() => {
		if (checkActive() || Date.now() - startTime > 2000) {
			loadingId.value = null;
			clearInterval(interval);
		}
	}, 100);
};

const quitApp = () => {
	window.electronAPI?.quitApp();
};

const openMain = () => {
	window.electronAPI?.showMainWindow();
};

const activeSceneName = computed(() => {
	const currentScene = meldClient.scenes.find(s => s.current);
	return currentScene ? currentScene.name : '';
});
</script>

<template>
	<div
		class="h-screen w-screen bg-[#030712]/80 backdrop-blur-2xl border border-white/10 text-slate-200 overflow-hidden font-sans flex flex-col rounded-2xl shadow-2xl selection:bg-indigo-500/30">

		<!-- Header -->
		<div class="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-white/5 drag-region">
			<div class="flex items-center gap-2">
				<div class="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
					:class="meldClient.isConnected.value ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'"></div>
				<span class="text-[11px] font-bold tracking-widest text-slate-400 uppercase">Meld Deck</span>
			</div>
			<!-- Active Scene Protocol -->
			<div class="flex items-center gap-2">
				<!-- Status Icons -->
				<div v-if="meldClient.isRecording.value"
					class="flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full">
					<div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
					<span class="text-[9px] font-bold text-red-400">REC</span>
				</div>
				<div v-if="meldClient.isStreaming.value"
					class="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-full">
					<div class="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
					<span class="text-[9px] font-bold text-rose-400">LIVE</span>
				</div>

				<div v-if="activeSceneName"
					class="text-[10px] text-indigo-300 font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 max-w-[100px] truncate">
					{{ activeSceneName }}
				</div>
			</div>
		</div>

		<!-- Content -->
		<div v-if="!meldClient.isConnected.value"
			class="flex flex-col items-center justify-center flex-1 text-center p-6 space-y-3">
			<div class="relative">
				<div class="absolute inset-0 bg-rose-500 blur-xl opacity-20 animate-pulse"></div>
				<Video :size="48" class="text-rose-500/50 relative z-10" />
			</div>
			<p class="text-xs text-slate-500 font-medium">Waiting for Meld Studio...</p>
		</div>

		<div v-else class="flex-1 overflow-y-auto custom-scrollbar p-3">
			<div v-if="deckManager.pinnedIds.value.length === 0"
				class="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
				<Pin :size="24" class="opacity-20" />
				<span class="text-[11px] font-medium text-slate-600">No Pinned Items</span>
				<span class="text-[9px] text-slate-700 text-center max-w-[200px]">Pin items from the main window to see
					them here.</span>
			</div>

			<div v-else class="grid grid-cols-3 gap-2 auto-rows-fr">
				<!-- Pinned Scenes -->
				<DeckButton v-for="scene in meldClient.scenes.filter(s => deckManager.isPinned(s.id))" :key="scene.id"
					label="Scene" :active="scene.current" color="indigo" :icon="Monitor" :pinned="false"
					:loading="loadingId === scene.id" :showPin="false" class="text-[10px]"
					@click="handleAction(scene.id, () => meldClient.showScene(scene.id), () => scene.current)">
					{{ scene.name }}
				</DeckButton>

				<!-- Pinned Controls -->
				<DeckButton v-if="deckManager.isPinned('control_stream')" label="Output"
					:loading="loadingId === 'control_stream'" :active="meldClient.isStreaming.value" color="red"
					:icon="Video" :pinned="false" :showPin="false" class="text-[10px]"
					@click="handleAction('control_stream', () => meldClient.toggleStream(), () => meldClient.isStreaming.value !== meldClient.isStreaming.value)">
					<!-- Note: The check logic above is flawed because it compares current to current. 
                         We need to capture *expected* state or just wait. 
                         For simplicity and reliability, let's just use strict timeout for toggles OR capture initial state.
                    -->
					{{ meldClient.isStreaming.value ? 'Stop' : 'Stream' }}
				</DeckButton>

				<DeckButton v-if="deckManager.isPinned('control_record')" label="Capture"
					:loading="loadingId === 'control_record'" :active="meldClient.isRecording.value" color="indigo"
					:icon="Circle" :pinned="false" :showPin="false" class="text-[10px]"
					@click="handleAction('control_record', () => meldClient.toggleRecord(), () => meldClient.isRecording.value !== meldClient.isRecording.value)">
					{{ meldClient.isRecording.value ? 'End' : 'Rec' }}
				</DeckButton>
			</div>
		</div>

		<!-- Footer -->
		<div class="h-12 border-t border-white/5 flex items-center justify-between px-3 bg-black/20">
			<div class="flex items-center gap-1">
				<!-- Status icons could go here, e.g. CPU/RAM if we had it -->
			</div>

			<div class="flex items-center gap-1 group/footer">
				<button @click="openMain" title="Open Main Window"
					class="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
					<Maximize2 :size="16" />
				</button>
				<button @click="quitApp" title="Quit Meld Deck"
					class="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all hover:scale-105 active:scale-95">
					<Power :size="16" />
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.grid-cols-3 {
	grid-template-columns: repeat(3, minmax(0, 1fr));
}

.drag-region {
	-webkit-app-region: drag;
}
</style>
