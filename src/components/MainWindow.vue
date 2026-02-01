<script setup lang="ts">
import { ref } from 'vue';
import { meldClient } from '../MeldClient';
import { deckManager } from '../DeckManager';
import DeckButton from './DeckButton.vue';
import StatusBadge from './StatusBadge.vue';
import {
	LayoutDashboard,
	Settings,
	Activity,
	Video,
	Circle,
	Radio,
	Mic2,
	Monitor,
	Command,
	HelpCircle,
	Power,
	Pin,
	PanelLeftOpen,
	PanelLeftClose
} from 'lucide-vue-next';

const currentCategory = ref('deck');
const isSidebarMini = ref(false);
</script>

<template>
	<div class="h-screen w-screen flex bg-[#030712] text-slate-200 overflow-hidden font-sans">
		<!-- Sidebar Navigation -->
		<aside :class="[
			'transition-all duration-300 ease-in-out border-r border-white/5 flex flex-col bg-black/20 backdrop-blur-xl group/sidebar relative shrink-0',
			isSidebarMini ? 'w-20' : 'w-20 md:w-64'
		]">

			<div class="p-6 flex items-center gap-3 overflow-hidden">
				<div
					class="shrink-0 w-10 h-10 bg-brand-indigo rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
					<Activity :size="20" class="text-white" />
				</div>
				<div class="transition-all duration-300"
					:class="isSidebarMini ? 'opacity-0 w-0' : 'opacity-100 w-auto'">
					<h1 class="font-bold text-sm tracking-tight text-white whitespace-nowrap">Meld Console</h1>
					<p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold whitespace-nowrap">Pro
						Control</p>
				</div>
			</div>

			<nav class="flex-1 px-3 py-4 space-y-1 overflow-hidden">
				<button v-for="cat in [
					{ id: 'deck', label: 'My Deck', icon: LayoutDashboard },
					{ id: 'scenes', label: 'Scenes', icon: Monitor },
					{ id: 'controls', label: 'Controls', icon: Command },
					{ id: 'audio', label: 'Audio', icon: Mic2 },
					{ id: 'settings', label: 'Settings', icon: Settings }
				]" :key="cat.id" @click="currentCategory = cat.id"
					class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
					:class="[
						currentCategory === cat.id ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/2',
						isSidebarMini ? 'justify-center px-0' : ''
					]">
					<component :is="cat.icon" :size="22" :stroke-width="currentCategory === cat.id ? 2.5 : 2"
						class="shrink-0" />
					<span class="transition-all duration-300 font-medium text-sm whitespace-nowrap" :class="[
						isSidebarMini ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 md:block hidden'
					]">{{ cat.label }}</span>
					<div v-if="currentCategory === cat.id && !isSidebarMini"
						class="ml-auto w-1.5 h-1.5 rounded-full bg-brand-indigo shadow-[0_0_8px_rgba(99,102,241,0.6)] hidden md:block">
					</div>
				</button>
			</nav>

			<div class="p-4 mt-auto border-t border-white/5 space-y-3 overflow-hidden">
				<div class="hidden md:block px-2 transition-all duration-300"
					:class="isSidebarMini ? 'opacity-0 h-0 pointer-events-none' : 'opacity-100'">
					<p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">System Health</p>
					<div class="space-y-2">
						<div class="flex items-center justify-between text-[11px]">
							<span class="text-slate-500">Latency</span>
							<span class="text-brand-emerald font-mono">12ms</span>
						</div>
						<div class="w-full bg-white/5 h-1 rounded-full overflow-hidden">
							<div class="bg-brand-emerald h-full w-[85%]"></div>
						</div>
					</div>
				</div>
				<button
					class="w-full h-10 flex items-center justify-center gap-2 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all overflow-hidden"
					:class="isSidebarMini ? 'px-0' : ''">
					<Power :size="18" class="shrink-0" />
					<span
						class="transition-all duration-300 text-xs font-bold uppercase tracking-wider whitespace-nowrap"
						:class="isSidebarMini ? 'opacity-0 w-0' : 'md:block hidden'">Disconnect</span>
				</button>
			</div>
		</aside>

		<!-- Main Content Area -->
		<main class="flex-1 flex flex-col relative overflow-hidden">
			<!-- Top Header Bar -->
			<header
				class="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/10 backdrop-blur-md z-10 transition-all">
				<div class="flex items-center gap-6">
					<button @click="isSidebarMini = !isSidebarMini"
						class="hidden md:flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all outline-none"
						:title="isSidebarMini ? 'Expand Sidebar' : 'Collapse Sidebar'">
						<component :is="isSidebarMini ? PanelLeftOpen : PanelLeftClose" :size="22" />
					</button>

					<div class="flex items-center gap-4">
						<h2 class="text-lg font-bold capitalize">{{ currentCategory === 'deck' ? 'My Control Deck' :
							currentCategory
							}}</h2>
						<div class="h-4 w-px bg-white/10"></div>
						<p class="text-xs text-slate-400">
							{{ currentCategory === 'deck' ? deckManager.pinnedIds.value.length : (currentCategory ===
								'scenes' ?
								meldClient.scenes.length : 'Control Panel') }}
							Active Elements
						</p>
					</div>
				</div>

				<div class="flex items-center gap-3">
					<StatusBadge label="Live" type="live" :active="meldClient.isStreaming.value" />
					<StatusBadge label="Rec" type="rec" :active="meldClient.isRecording.value" />
					<StatusBadge label="Meld Link" type="connection" :active="meldClient.isConnected.value" />
				</div>
			</header>

			<!-- Grid Content -->
			<div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
				<div v-if="!meldClient.isConnected.value && currentCategory !== 'settings'"
					class="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
					<div
						class="w-20 h-20 rounded-3xl bg-brand-rose/10 flex items-center justify-center text-brand-rose mb-6 animate-pulse border border-brand-rose/20">
						<Radio :size="40" stroke-width="1.5" />
					</div>
					<h3 class="text-xl font-bold mb-2">Awaiting Meld Studio</h3>
					<p class="text-slate-500 text-sm leading-relaxed mb-8">
						Please ensure Meld Studio is running and the WebChannel API is enabled on your local machine.
					</p>
					<button @click="meldClient.connect()"
						class="px-8 py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all shadow-xl shadow-white/5">
						Launch Connection
					</button>
				</div>

				<div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					<!-- Consolidated Deck View -->
					<template v-if="currentCategory === 'deck'">
						<div v-if="deckManager.pinnedIds.value.length === 0"
							class="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
							<Pin :size="48" class="mx-auto text-slate-700 mb-4" />
							<p class="text-slate-500 font-medium">Your deck is empty. Pin items from other pages to see
								them here.</p>
						</div>

						<template v-else>
							<!-- Pinned Scenes -->
							<DeckButton v-for="scene in meldClient.scenes.filter(s => deckManager.isPinned(s.id))"
								:key="scene.id" label="Scene" :active="scene.current" color="indigo" :icon="Monitor"
								:pinned="true" showPin @click="meldClient.showScene(scene.id)"
								@toggle-pin="deckManager.togglePin(scene.id)">
								{{ scene.name }}
							</DeckButton>

							<!-- Pinned Controls -->
							<DeckButton v-if="deckManager.isPinned('control_stream')" label="Output"
								:active="meldClient.isStreaming.value" color="red" :icon="Video" :pinned="true" showPin
								@click="meldClient.toggleStream()"
								@toggle-pin="deckManager.togglePin('control_stream')">
								{{ meldClient.isStreaming.value ? 'Stop Stream' : 'Start Stream' }}
							</DeckButton>

							<DeckButton v-if="deckManager.isPinned('control_record')" label="Capture"
								:active="meldClient.isRecording.value" color="indigo" :icon="Circle" :pinned="true"
								showPin @click="meldClient.toggleRecord()"
								@toggle-pin="deckManager.togglePin('control_record')">
								{{ meldClient.isRecording.value ? 'End Recording' : 'Start Recording' }}
							</DeckButton>
						</template>
					</template>

					<template v-if="currentCategory === 'scenes'">
						<DeckButton v-for="scene in meldClient.scenes" :key="scene.id" label="Scene"
							:active="scene.current" color="indigo" :icon="Monitor"
							:pinned="deckManager.isPinned(scene.id)" showPin @click="meldClient.showScene(scene.id)"
							@toggle-pin="deckManager.togglePin(scene.id)">
							{{ scene.name }}
						</DeckButton>

						<div v-if="meldClient.scenes.length === 0" class="col-span-full py-20 text-center">
							<p class="text-slate-600 italic">No scenes detected in current session.</p>
						</div>
					</template>

					<template v-if="currentCategory === 'controls'">
						<DeckButton label="Output" :active="meldClient.isStreaming.value" color="red" :icon="Video"
							:pinned="deckManager.isPinned('control_stream')" showPin @click="meldClient.toggleStream()"
							@toggle-pin="deckManager.togglePin('control_stream')">
							{{ meldClient.isStreaming.value ? 'Stop Stream' : 'Start Stream' }}
						</DeckButton>

						<DeckButton label="Capture" :active="meldClient.isRecording.value" color="indigo" :icon="Circle"
							:pinned="deckManager.isPinned('control_record')" showPin @click="meldClient.toggleRecord()"
							@toggle-pin="deckManager.togglePin('control_record')">
							{{ meldClient.isRecording.value ? 'End Recording' : 'Start Recording' }}
						</DeckButton>
					</template>

					<template v-if="currentCategory === 'audio'">
						<div class="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
							<Mic2 :size="48" class="mx-auto text-slate-700 mb-4" />
							<p class="text-slate-500 font-medium">Audio Mixer controls coming soon</p>
						</div>
					</template>

					<template v-if="currentCategory === 'settings'">
						<div class="col-span-full max-w-2xl">
							<div class="glass-panel rounded-3xl p-8 space-y-6">
								<!-- Settings Content Same as Before -->
								<div class="flex items-center gap-4 mb-2">
									<div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
										<Settings :size="24" class="text-slate-400" />
									</div>
									<div>
										<h4 class="font-bold text-lg">App Configuration</h4>
										<p class="text-xs text-slate-500">Manage your local Meld link parameters</p>
									</div>
								</div>

								<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div class="space-y-2">
										<label
											class="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Server
											Address</label>
										<input type="text" value="127.0.0.1" disabled
											class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-indigo outline-none transition-all cursor-not-allowed opacity-50" />
									</div>
									<div class="space-y-2">
										<label
											class="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">API
											Port</label>
										<input type="text" value="13376" disabled
											class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-indigo outline-none transition-all cursor-not-allowed opacity-50" />
									</div>
								</div>

								<div class="pt-4 flex gap-3">
									<button
										class="flex-1 px-6 py-3 bg-brand-indigo rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-indigo/80 transition-all">Save
										Profile</button>
									<button
										class="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Reset
										Default</button>
								</div>
							</div>
						</div>
					</template>
				</div>
			</div>

			<!-- Quick Help Footer Same as Before -->
			<footer
				class="h-12 border-t border-white/5 flex items-center justify-between px-8 bg-black/20 text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold">
				<div class="flex items-center gap-6">
					<div class="flex items-center gap-2">
						<div class="w-1 h-1 rounded-full bg-brand-indigo animate-pulse"></div>
						API v1.4.2
					</div>
					<div class="flex items-center gap-2">
						<HelpCircle :size="12" />
						Press F1 for Docs
					</div>
				</div>
				<div>Studio Connect Protocol</div>
			</footer>
		</main>
	</div>
</template>

<style scoped>
/* Scoped styles from original App.vue */
</style>
