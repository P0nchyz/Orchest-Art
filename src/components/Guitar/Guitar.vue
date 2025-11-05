<script setup>
import { useAudioEngine } from '@/composables/useAudioEngine';
import { onMounted, onUnmounted, ref } from 'vue';

const BASE_URL = import.meta.env.BASE_URL;

const { initAudio, loadInstrument, playNote, stopNote } = useAudioEngine();

const activeNotes = ref({});

const frets = ref([
  [{ note: 'E4' }, { note: 'B3' }, { note: 'G3' }, { note: 'D3' }, { note: 'A2' }, { note: 'E2' }],
  [{ note: 'F4' }, { note: 'C4' }, { note: 'Gs3' }, { note: 'Ds3' }, { note: 'As2' }, { note: 'F2' }],
  [{ note: 'Fs4' }, { note: 'Cs4' }, { note: 'A3' }, { note: 'E3' }, { note: 'B2' }, { note: 'Fs2' }],
  [{ note: 'G4' }, { note: 'D4' }, { note: 'As3' }, { note: 'F3' }, { note: 'C3' }, { note: 'G2' }],
  [{ note: 'Gs4' }, { note: 'Ds4' }, { note: 'B3' }, { note: 'Fs3' }, { note: 'Cs3' }, { note: 'Gs2' }],
  [{ note: 'A4' }, { note: 'E4' }, { note: 'C4' }, { note: 'G3' }, { note: 'D3' }, { note: 'A2' }],
  [{ note: 'As4' }, { note: 'F4' }, { note: 'Cs4' }, { note: 'Gs3' }, { note: 'Ds3' }, { note: 'As2' }],
  [{ note: 'B4' }, { note: 'Fs4' }, { note: 'D4' }, { note: 'A3' }, { note: 'E3' }, { note: 'B2' }],
  [{ note: 'C5' }, { note: 'G4' }, { note: 'Ds4' }, { note: 'As3' }, { note: 'F3' }, { note: 'C3' }],
  [{ note: 'Cs5' }, { note: 'Gs4' }, { note: 'E4' }, { note: 'B3' }, { note: 'Fs3' }, { note: 'Cs3' }],
  [{ note: 'D5' }, { note: 'A4' }, { note: 'F4' }, { note: 'C4' }, { note: 'G3' }, { note: 'D3' }],
  [{ note: 'Ds5' }, { note: 'As4' }, { note: 'Fs4' }, { note: 'Cs4' }, { note: 'Gs3' }, { note: 'Ds3' }],
  [{ note: 'E5' }, { note: 'B4' }, { note: 'G4' }, { note: 'D4' }, { note: 'A3' }, { note: 'E3' }],
]);

const keyToStrfret = {
  'Digit1': [1, 2],
  'Digit2': [2, 2],
  'Digit3': [3, 2],
  'Digit4': [4, 2],
  'Digit5': [5, 2],
  'Digit6': [6, 2],
  'Digit7': [7, 2],
  'Digit8': [8, 2],
  'Digit9': [9, 2],
  'Digit0': [10, 2],
  'Minus': [11, 2],
  'Equal': [12, 2],

  'KeyQ': [1, 3],
  'KeyW': [2, 3],
  'KeyE': [3, 3],
  'KeyR': [4, 3],
  'KeyT': [5, 3],
  'KeyY': [6, 3],
  'KeyU': [7, 3],
  'KeyI': [8, 3],
  'KeyO': [9, 3],
  'KeyP': [10, 3],
  'BracketLeft': [11, 3],
  'BracketRight': [12, 3],

  'KeyA': [1, 4],
  'KeyS': [2, 4],
  'KeyD': [3, 4],
  'KeyF': [4, 4],
  'KeyG': [5, 4],
  'KeyH': [6, 4],
  'KeyJ': [7, 4],
  'KeyK': [8, 4],
  'KeyL': [9, 4],
  'Semicolon': [10, 4],
  "Quote": [11, 4],
  'Backslash': [12, 4],

  'IntlBackslash': [1, 5],
  'KeyZ': [2, 5],
  'KeyX': [3, 5],
  'KeyC': [4, 5],
  'KeyV': [5, 5],
  'KeyB': [6, 5],
  'KeyN': [7, 5],
  'KeyM': [8, 5],
  'Comma': [9, 5],
  'Period': [10, 5],
  "Slash": [11, 5],
};

const guitarSamples = {};

frets.value.forEach(fret => {
  fret.forEach(strFret => {
    guitarSamples[strFret.note] = `${BASE_URL}/samples/Guitar.${strFret.note}.mp3`;
  })
})

const handleKeyDown = (event) => {
  if (event.repeat) return;

  const strFret = keyToStrfret[event.code];
  activeNotes.value[`${strFret[0]}${strFret[1]}`] = true;

  const strFretObject = frets.value[strFret[0]][strFret[1]];

  pressKey(strFretObject);
}

const handleKeyUp = (event) => {
  const strFret = keyToStrfret[event.code];
  activeNotes.value[`${strFret[0]}${strFret[1]}`] = false;

  const strFretObject = frets.value[strFret[0]][strFret[1]];

  if (strFretObject && strFretObject.note) {
    // stopNote(strFretObject.note);
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  await initAudio();

  loadInstrument('guitar', guitarSamples);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
})

function pressKey(key) {
  if (!key) return;
  playNote(key.note);
}

</script>

<template>
  <div>
    <div class="flex bg-red-600">
      <span v-for="(fret, i) in frets" class="flex flex-col border-x-2 border-x-white">
        <span v-for="(strFret, j) in fret" class="my-1 mx-4">
          <button @click="pressKey(strFret)" class="text-white" :class="(activeNotes[`${i}${j}`]) ? 'bg-amber-400' : ''">
            {{ strFret.note }}
          </button>
        </span>
      </span>
    </div>
  </div>
</template>