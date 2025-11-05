import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettings = defineStore('settings', () => {
  /** @type {import('vue').Ref<'piano' | 'guitar'>} */
  const userInstrument = ref('piano');

  return {
    userInstrument,
  };
});
