<script setup lang="ts">
import { onMounted } from 'vue';
import { meldClient } from './MeldClient';
import DeckButton from './components/DeckButton.vue';

onMounted(() => {
  meldClient.connect();
});
</script>

<template>
  <div class="min-h-screen p-6 flex flex-col gap-6">
    <!-- Header / Status -->
    <header class="flex items-center justify-between glass rounded-2xl px-6 py-4">
      <div class="flex items-center gap-3">
        <div 
          class="w-3 h-3 rounded-full animate-pulse"
          :class="meldClient.isConnected.value ? 'bg-green-500' : 'bg-red-500'"
        ></div>
        <h1 class="text-xl font-bold tracking-tight">Meld Stream Deck</h1>
      </div>
      
      <div class="flex gap-4">
        <div v-if="meldClient.isStreaming.value" class="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold border border-red-500/30 uppercase tracking-widest">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Live
        </div>
        <div v-if="meldClient.isRecording.value" class="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold border border-indigo-500/30 uppercase tracking-widest">
          Rec
        </div>
      </div>
    </header>

    <!-- Main Deck Grid -->
    <main class="flex-1 overflow-y-auto pr-2">
      <div 
        v-if="meldClient.isConnected.value"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        <!-- Scenes -->
        <DeckButton
          v-for="scene in meldClient.scenes"
          :key="scene.id"
          label="Scene"
          :active="scene.current"
          color="indigo"
          @click="meldClient.showScene(scene.id)"
        >
          <span class="text-sm font-medium text-center truncate w-full">{{ scene.name }}</span>
        </DeckButton>

        <div v-if="meldClient.scenes.length === 0" class="col-span-full py-12 text-center text-slate-500 glass rounded-2xl border-dashed">
          No scenes found. Check Meld Studio session.
        </div>

        <!-- Controls -->
        <DeckButton
          label="Stream"
          :active="meldClient.isStreaming.value"
          color="red"
          @click="meldClient.toggleStream()"
        >
          <span class="text-sm font-medium">{{ meldClient.isStreaming.value ? 'Stop' : 'Go Live' }}</span>
        </DeckButton>

        <DeckButton
          label="Record"
          :active="meldClient.isRecording.value"
          color="indigo"
          @click="meldClient.toggleRecord()"
        >
          <span class="text-sm font-medium">{{ meldClient.isRecording.value ? 'Stop' : 'Record' }}</span>
        </DeckButton>

        <!-- Placeholder / Setup -->
        <DeckButton
          label="Setup"
          color="slate"
          @click="() => {}"
        >
          <span class="text-sm font-medium text-slate-500 italic">Configure</span>
        </DeckButton>
      </div>

      <!-- Disconnected State -->
      <div 
        v-else 
        class="h-full flex flex-col items-center justify-center gap-4 text-center p-12 glass rounded-3xl"
      >
        <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-2xl animate-pulse">
          ⚠️
        </div>
        <div>
          <h2 class="text-xl font-bold mb-2">Disconnected from Meld Studio</h2>
          <p class="text-slate-400 max-w-xs">
            Make sure Meld Studio is running and the WebChannel API is enabled on 127.0.0.1:13376.
          </p>
        </div>
        <button 
          @click="meldClient.connect()"
          class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-full font-bold text-sm uppercase tracking-widest"
        >
          Retry Connection
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center text-slate-600 text-[10px] uppercase tracking-[0.2em]">
      Powered by Meld Studio WebChannel API
    </footer>
  </div>
</template>

<style>
/* Custom scrollbar for a cleaner look */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
