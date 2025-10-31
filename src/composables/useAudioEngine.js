import { readonly, ref } from 'vue';
import { AudioService } from '@/services/AudioService';

const audioService = AudioService.getInstance();

const isInitialized = ref(false);
const isLoading = ref(false);
const activeInstrument = ref(null);

export function useAudioEngine() {
  const initAudio = async () => {
    if (isInitialized.value) return;
    try {
      await audioService.init();
      isInitialized.value = true;
    } catch (e) {
      console.error('Failed to init audio', e);
    }
  };

  /**
   * Loads instrument samples. Shows loading state.
   * @param {string} instrumentName
   * @param {Object<string, string>} sampleMap
   */
  const loadInstrument = async (instrumentName, sampleMap) => {
    isLoading.value = true;
    activeInstrument.value = instrumentName;
    try {
      await audioService.loadSamples(instrumentName, sampleMap);
    } catch (e) {
      console.error(`Failed to load ${instrumentName}:`, e);
    } finally {
      isLoading.value = false;
    }
  };

  const playNote = (note) => {
    const instrument = activeInstrument.value;
    if (!isInitialized.value || !instrument) return;

    audioService.play(instrument, note);

    // TODO: online jam
  };

  const stopNote = (note) => {
    const instrument = activeInstrument.value;
    if (!isInitialized.value || !instrument) return;

    audioService.stop(instrument, note);
  };

  return {
    isInitialized: readonly(isInitialized),
    isLoading: readonly(isLoading),
    activeInstrument: readonly(activeInstrument),

    initAudio,
    loadInstrument,
    playNote,
    stopNote,
  };
}
