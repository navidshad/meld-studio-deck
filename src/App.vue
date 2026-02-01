<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { meldClient } from './MeldClient';
import { deckManager } from './DeckManager';
import MainWindow from './components/MainWindow.vue';
import TrayWindow from './components/TrayWindow.vue';

const currentHash = ref(window.location.hash);

const isTray = computed(() => {
  return currentHash.value === '#tray' || currentHash.value === '#/tray';
});

onMounted(() => {
  meldClient.connect();
  window.addEventListener('hashchange', () => {
    currentHash.value = window.location.hash;
  });
});

// Set default pins once scenes are loaded
// Update Tray Title
const updateTitle = () => {
  if (!window.electronAPI) return;

  // Check for switching state
  if (meldClient.pendingSceneId.value) {
    window.electronAPI.setTrayTitle('Switching...');
    return;
  }

  const currentScene = meldClient.scenes.find(s => s.current);
  const sceneName = currentScene ? currentScene.name : 'Ready';

  const parts = [];

  // Recording
  if (meldClient.isRecording.value) {
    parts.push('🔴');
  } else if (meldClient.pendingRecord.value) {
    parts.push('⚪️'); // Grayscale/Waiting
  }

  // Streaming
  if (meldClient.isStreaming.value) {
    parts.push('📡');
  } else if (meldClient.pendingStream.value) {
    parts.push('📡'); // Maybe just show icon? Or Gray?
    // User asked: "record and stream -> greyscal -> color icon"
    // There isn't a great grayscale satellite emoji. Maybe 🕸️? Or just the same icon but user knows its waiting?
    // Let's try to find a "waiting" icon.
    // Or just string "..." 
    // Let's stick to the colored one for now but maybe order changes? Use ⚪️ for generic wait?
  }

  parts.push(sceneName);

  window.electronAPI.setTrayTitle(parts.join(' '));
};

watch(
  [
    () => meldClient.scenes,
    () => meldClient.isRecording.value,
    () => meldClient.isStreaming.value,
    () => meldClient.pendingSceneId.value,
    () => meldClient.pendingRecord.value,
    () => meldClient.pendingStream.value
  ],
  () => {
    if (meldClient.scenes.length > 0) {
      deckManager.setDefaults(meldClient.scenes.map(s => s.id));
    }
    updateTitle();
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <TrayWindow v-if="isTray" />
  <MainWindow v-else />
</template>

<style>
/* Global Styles (Scrollbar etc) */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid>* {
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.grid>*:nth-child(2) {
  animation-delay: 0.05s;
}

.grid>*:nth-child(3) {
  animation-delay: 0.1s;
}

.grid>*:nth-child(4) {
  animation-delay: 0.15s;
}

.grid>*:nth-child(5) {
  animation-delay: 0.2s;
}
</style>
