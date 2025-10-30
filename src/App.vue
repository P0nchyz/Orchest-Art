<script setup>
import { ref } from 'vue';
import Guitar from './components/Guitar/Guitar.vue';
import Piano from './components/Piano/Piano.vue';

const piano = ref();

</script>

<template>
  <main class="flex flex-col items-center mt-4 gap-8">
    <input type="checkbox" name="piano" id="" v-model="piano">
    <Piano v-if="piano" />
    <Guitar v-else/>
  </main>
</template>
