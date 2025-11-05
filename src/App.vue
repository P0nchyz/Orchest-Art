<script setup>
import Guitar from '@/components/Guitar/Guitar.vue';
import Piano from '@/components/Piano/Piano.vue';
import Header from '@/components/Header.vue';

import { onMounted } from 'vue';
import { useAudioEngine } from '@/composables/useAudioEngine';

import { useSettings } from '@/stores/settings';
import { storeToRefs } from 'pinia';

const store = useSettings();

const { userInstrument } = storeToRefs(store);

onMounted(() => {
  useAudioEngine().initAudio();
})

</script>

<template>
  <Header />
  <main class="flex flex-col items-center mt-4 gap-8">
    <Piano v-if="userInstrument === 'piano'" />
    <Guitar v-if="userInstrument === 'guitar'" />
  </main>
</template>
