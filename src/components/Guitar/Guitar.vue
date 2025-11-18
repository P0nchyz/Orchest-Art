<script setup>
import { useAudioEngine } from '@/composables/useAudioEngine';
import { onMounted, onUnmounted, ref } from 'vue';

const BASE_URL = import.meta.env.BASE_URL;

const { loadInstrument, playNote, stopNote } = useAudioEngine();


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
  'Digit1': { fret: 1, str: 0 },
  'KeyQ': { fret: 2, str: 0 },
  'KeyA': { fret: 3, str: 0 },
  'IntlBackslash': { fret: 4, str: 0 },

  'Digit2': { fret: 1, str: 1 },
  'KeyW': { fret: 2, str: 1 },
  'KeyS': { fret: 3, str: 1 },
  'KeyZ': { fret: 4, str: 1 },

  'Digit3': { fret: 1, str: 2 },
  'KeyE': { fret: 2, str: 2 },
  'KeyD': { fret: 3, str: 2 },
  'KeyX': { fret: 4, str: 2 },

  'Digit4': { fret: 1, str: 3 },
  'KeyR': { fret: 2, str: 3 },
  'KeyF': { fret: 3, str: 3 },
  'KeyC': { fret: 4, str: 3 },

  'Digit5': { fret: 1, str: 4 },
  'KeyT': { fret: 2, str: 4 },
  'KeyG': { fret: 3, str: 4 },
  'KeyV': { fret: 4, str: 4 },

  'Digit6': { fret: 1, str: 5 },
  'KeyY': { fret: 2, str: 5 },
  'KeyH': { fret: 3, str: 5 },
  'KeyB': { fret: 4, str: 5 },

  'Digit7': { fret: 5, str: 0 },
  'KeyU': { fret: 6, str: 0 },
  'KeyJ': { fret: 7, str: 0 },
  'KeyN': { fret: 8, str: 0 },

  'Digit8': { fret: 5, str: 1 },
  'KeyI': { fret: 6, str: 1 },
  'KeyK': { fret: 7, str: 1 },
  'KeyM': { fret: 8, str: 1 },

  'Digit9': { fret: 5, str: 2 },
  'KeyO': { fret: 6, str: 2 },
  'KeyL': { fret: 7, str: 2 },
  'Comma': { fret: 8, str: 2 },

  'Digit0': { fret: 5, str: 3 },
  'KeyP': { fret: 6, str: 3 },
  'Semicolon': { fret: 7, str: 3 },
  'Period': { fret: 8, str: 3 },

  'Minus': { fret: 5, str: 4 },
  'BracketLeft': { fret: 6, str: 4 },
  'Quote': { fret: 7, str: 4 },
  'Slash': { fret: 8, str: 4 },

  'Equal': { fret: 5, str: 5 },
  'BracketRight': { fret: 6, str: 5 },
  'Backslash': { fret: 7, str: 5 },
  'ShiftRight': { fret: 8, str: 5 },
};

const guitarSamples = {};

frets.value.forEach(fret => {
  fret.forEach(strFret => {
    guitarSamples[strFret.note] = `${BASE_URL}/samples/Guitar.${strFret.note}.mp3`;
  })
})

/** @type {import('vue').Ref<GuitarPos[]>} */
const activeNotes = ref([]);
const isShifting = ref(false);

const handleKeyDown = (event) => {
  if (event.repeat) return;

  if (event.code === 'ArrowUp' || event.code === 'Numpad8') {
    playPressedKeys('up');
    return;
  }
  if (event.code === 'ArrowDown' || event.code === 'Numpad2') {
    playPressedKeys('down');
    return;
  }

  if (event.code === 'ShiftLeft') {
    isShifting.value = true;
    return;
  }
  const strFret = keyToStrfret[event.code];
  activeNotes.value.push(strFret);
  if (isShifting.value) {
    const strFretObject = frets.value[strFret.fret][strFret.str];
    pressKey(strFretObject);
  }
}

const playPressedKeys = (strumDir) => {

  const highestPerString = Array.from({ length: 6 }, (_, i) => i).map(str =>
    activeNotes.value.filter(n => n.str === str)
      .reduce((max, n) => (max === null || n.fret > max.fret ? n : max), null)
  );

  console.log('-----');
  if (strumDir === 'up') {
    for (let i = 0; i < 6; i++) {
      const strFret = highestPerString[5 - i];
      const strFretObject = (strFret) ? frets.value[strFret.fret][strFret.str] : frets.value[0][5 - i];
      console.log(`played ${strFretObject.note}`);

      setTimeout(() => playNote(strFretObject.note), i * 10);
    }
  } else if (strumDir === 'down') {
    for (let i = 0; i < 6; i++) {
      const strFret = highestPerString[i];
      const strFretObject = (strFret) ? frets.value[strFret.fret][strFret.str] : frets.value[0][i];
      console.log(`played ${strFretObject.note}`);
      setTimeout(() => playNote(strFretObject.note), i * 10);
    }
  }
  console.log('-----\n');

}

const handleKeyUp = (event) => {
  if (event.code === 'ArrowUp' || event.code === 'ArrowDown' || event.code === 'Numpad8' || event.code === 'Numpad2') {
    return;
  }
  if (event.code === 'ShiftLeft') {
    isShifting.value = false;
    return;
  }
  const strFret = keyToStrfret[event.code];

  const strFretIndex = activeNotes.value.indexOf(strFret);
  activeNotes.value.splice(strFretIndex);

  const strFretObject = frets.value[strFret.fret][strFret.str];

}

/**
 * 
 * @param {GuitarPos} strFret 
 */
const handleKeyPress = (strFret) => {
  activeNotes.value.push(strFret)

  const strFretObject = frets.value[strFret.fret][strFret.str];
  pressKey(strFretObject);
}

/**
 * 
 * @param {GuitarPos} strFret
 */
const handleKeyRelease = (strFret) => {
  const strFretIndex = activeNotes.value.indexOf(strFret);
  activeNotes.value.splice(strFretIndex);
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

/**@param {Note} key  */
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
          <button class="text-white" :class="(activeNotes.some(e => e.fret === i && e.str === j)) ? 'bg-amber-400' : ''"
            @mousedown="handleKeyPress({ fret: i, str: j })" @mouseup="handleKeyRelease({ fret: i, str: j })"
            @mouseleave="handleKeyRelease({ fret: i, str: j })"
            @touchstart.prevent="handleKeyPress({ fret: i, str: j })"
            @touchend.prevent="handleKeyRelease({ fret: i, str: j })"
            @touchcancel.prevent="handleKeyRelease({ fret: i, str: j })">
            {{ strFret.note }}
          </button>
        </span>
      </span>
    </div>
  </div>
</template>