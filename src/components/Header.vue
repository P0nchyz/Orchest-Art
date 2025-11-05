<script setup>
import { useSettings } from '@/stores/settings';
import { storeToRefs } from 'pinia';

const store = useSettings();

const { userInstrument } = storeToRefs(store);

</script>

<template>
  <header class="flex justify-between items-center">
    <div class="flex items-center gap-4">
      <span class="p-4">
        <img src="/src/assets/logo.svg" alt="logo">
      </span>
      <span>
        <select v-model="userInstrument">
          <option value="piano">Piano</option>
          <option value="guitar">Guitar</option>
        </select>
      </span>
    </div>
    <span>BPM | KEY</span>
    <span>User</span>
  </header>
</template>