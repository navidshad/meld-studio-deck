<script setup lang="ts">
import { meldClient } from '../MeldClient';
import { deckManager } from '../DeckManager';
import DeckButton from './DeckButton.vue';
import {
	Video,
	Circle,
	Monitor,
	Pin
} from 'lucide-vue-next';

// In tray window, we might want to auto-close after action?
// For now, let's keep it simple.

const quitApp = () => {
	window.electronAPI?.quitApp();
};

const openMain = () => {
	window.electronAPI?.showMainWindow();
};
</script>

<template>
	<div
		class="h-screen w-screen bg-[#030712]/90 backdrop-blur-xl border border-white/10 text-slate-200 overflow-hidden font-sans flex flex-col p-4 rounded-xl">

		<div v-if="!meldClient.isConnected.value" class="flex flex-col items-center justify-center flex-1 text-center">
			<p class="text-xs text-slate-500">Connecting...</p>
		</div>

		<div v-else class="flex-1 overflow-y-auto custom-scrollbar">
			<div v-if="deckManager.pinnedIds.value.length === 0"
				class="flex flex-col items-center justify-center h-full text-slate-500">
				<Pin :size="20" class="mb-2 opacity-50" />
				<span class="text-[10px]">No Pins</span>
			</div>

			<div v-else class="grid grid-cols-3 gap-2">
				<!-- Pinned Scenes -->
				<DeckButton v-for="scene in meldClient.scenes.filter(s => deckManager.isPinned(s.id))" :key="scene.id"
					label="Scene" :active="scene.current" color="indigo" :icon="Monitor" :pinned="false"
					:showPin="false" class="h-20 text-[10px]" @click="meldClient.showScene(scene.id)">
					{{ scene.name }}
				</DeckButton>

				<!-- Pinned Controls -->
				<DeckButton v-if="deckManager.isPinned('control_stream')" label="Output"
					:active="meldClient.isStreaming.value" color="red" :icon="Video" :pinned="false" :showPin="false"
					class="h-20 text-[10px]" @click="meldClient.toggleStream()">
					{{ meldClient.isStreaming.value ? 'Stop' : 'Stream' }}
				</DeckButton>

				<DeckButton v-if="deckManager.isPinned('control_record')" label="Capture"
					:active="meldClient.isRecording.value" color="indigo" :icon="Circle" :pinned="false"
					:showPin="false" class="h-20 text-[10px]" @click="meldClient.toggleRecord()">
					{{ meldClient.isRecording.value ? 'End' : 'Rec' }}
				</DeckButton>
			</div>
		</div>

		<div class="pt-4 mt-auto border-t border-white/5 flex justify-between items-center px-1">
			<div class="flex items-center gap-2">
				<span class="text-[10px] text-slate-600 font-bold tracking-wider">MELD DECK</span>
			</div>

			<div class="flex items-center gap-2">
				<button @click="openMain"
					class="text-[10px] bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white px-3 py-1 rounded-lg transition-colors">
					Open App
				</button>
				<button @click="quitApp"
					class="text-[10px] bg-white/5 hover:bg-red-500/20 hover:text-red-400 px-3 py-1 rounded-lg transition-colors">
					Quit
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.grid-cols-3 {
	grid-template-columns: repeat(3, minmax(0, 1fr));
}
</style>
