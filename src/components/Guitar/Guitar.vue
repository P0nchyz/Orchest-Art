<script setup>
import { useAudioEngine } from '@/composables/useAudioEngine';
import { onMounted, onUnmounted, ref } from 'vue';

const BASE_URL = import.meta.env.BASE_URL;

const { loadInstrument, playNote, stopNote } = useAudioEngine();

const activeNotes = ref({});

/**
 * @typedef {Object} Note
 * @property {String} note
 */

/**
 * @typedef {Note[]} Str
 */

/**
 * @type {import('vue').Ref<Str[]>}
 */
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

/**
 * @typedef {Object} GuitarPos
 * @property {Number} fret
 * @property {Number} str
 */

/**
 * @type {{ [key: String]: GuitarPos }}
 */
const keyToStrfret = {
  'Digit1': { fret: 1, str: 2 },
  'Digit2': { fret: 2, str: 2 },
  'Digit3': { fret: 3, str: 2 },
  'Digit4': { fret: 4, str: 2 },
  'Digit5': { fret: 5, str: 2 },
  'Digit6': { fret: 6, str: 2 },
  'Digit7': { fret: 7, str: 2 },
  'Digit8': { fret: 8, str: 2 },
  'Digit9': { fret: 9, str: 2 },
  'Digit0': { fret: 10, str: 2 },
  'Minus': { fret: 11, str: 2 },
  'Equal': { fret: 12, str: 2 },

  'KeyQ': { fret: 1, str: 3 },
  'KeyW': { fret: 2, str: 3 },
  'KeyE': { fret: 3, str: 3 },
  'KeyR': { fret: 4, str: 3 },
  'KeyT': { fret: 5, str: 3 },
  'KeyY': { fret: 6, str: 3 },
  'KeyU': { fret: 7, str: 3 },
  'KeyI': { fret: 8, str: 3 },
  'KeyO': { fret: 9, str: 3 },
  'KeyP': { fret: 10, str: 3 },
  'BracketLeft': { fret: 11, str: 3 },
  'BracketRight': { fret: 12, str: 3 },

  'KeyA': { fret: 1, str: 4 },
  'KeyS': { fret: 2, str: 4 },
  'KeyD': { fret: 3, str: 4 },
  'KeyF': { fret: 4, str: 4 },
  'KeyG': { fret: 5, str: 4 },
  'KeyH': { fret: 6, str: 4 },
  'KeyJ': { fret: 7, str: 4 },
  'KeyK': { fret: 8, str: 4 },
  'KeyL': { fret: 9, str: 4 },
  'Semicolon': { fret: 10, str: 4 },
  'Quote': { fret: 11, str: 4 },
  'Backslash': { fret: 12, str: 4 },

  'IntlBackslash': { fret: 1, str: 5 },
  'KeyZ': { fret: 2, str: 5 },
  'KeyX': { fret: 3, str: 5 },
  'KeyC': { fret: 4, str: 5 },
  'KeyV': { fret: 5, str: 5 },
  'KeyB': { fret: 6, str: 5 },
  'KeyN': { fret: 7, str: 5 },
  'KeyM': { fret: 8, str: 5 },
  'Comma': { fret: 9, str: 5 },
  'Period': { fret: 10, str: 5 },
  'Slash': { fret: 11, str: 5 },
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
  activeNotes.value[`${strFret.fret}${strFret.str}`] = true;

  const strFretObject = frets.value[strFret.fret][strFret.str];

  pressKey(strFretObject);
}

const handleKeyUp = (event) => {
  const strFret = keyToStrfret[event.code];
  activeNotes.value[`${strFret.fret}${strFret.str}`] = false;

  const strFretObject = frets.value[strFret.fret][strFret.str];

  if (strFretObject && strFretObject.note) {
    // stopNote(strFretObject.note);
  }
}

/**
 * 
 * @param {GuitarPos} strFret 
 */
const handleKeyPress = (strFret) => {
  activeNotes.value[`${strFret.fret}${strFret.str}`] = true;

  const strFretObject = frets.value[strFret.fret][strFret.str];
  pressKey(strFretObject);
}

/**
 * 
 * @param {GuitarPos} strFret
 */
const handleKeyRelease = (strFret) => {
  activeNotes.value[`${strFret.fret}${strFret.str}`] = false;
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

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
    <div class="flex bg-[#141414]">
      <span v-for="(fret, i) in frets" class="flex flex-col border-x-2 border-x-white">
        <span v-for="(strFret, j) in fret" class="my-1 mx-4">
          <button class="text-white" :class="(activeNotes[`${i}${j}`]) ? 'bg-amber-400' : ''"
            @mousedown="handleKeyPress({ fret: i, str: j })" @mouseup="handleKeyRelease({ fret: i, str: j })"
            @mouseleave="handleKeyRelease({ fret: i, str: j })" @touchstart.prevent="handleKeyPress({ fret: i, str: j })"
            @touchend.prevent="handleKeyRelease({ fret: i, str: j })" @touchcancel.prevent="handleKeyRelease({ fret: i, str: j })">
            {{ strFret.note }}
          </button>
        </span>
      </span>
    </div>
  </div>
</template>