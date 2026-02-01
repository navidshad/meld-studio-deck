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
watch(() => meldClient.scenes, (scenes) => {
  if (scenes.length > 0) {
    deckManager.setDefaults(scenes.map(s => s.id));

    // Update Tray Title with current scene
    const currentScene = scenes.find(s => s.current);
    if (currentScene && window.electronAPI) {
      window.electronAPI.setTrayTitle(currentScene.name);
    }
  }
}, { immediate: true });
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
