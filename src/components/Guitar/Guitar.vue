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
  [{ note: 'E4' }, { note: 'B3' }, { note: 'G3' }, { note: 'D3' }, { note: 'A2' }, { note: 'E2' }],
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
  'Digit1': { fret: 3, str: 0 },
  'KeyQ': { fret: 2, str: 0 },
  'KeyA': { fret: 1, str: 0 },
  'IntlBackslash': { fret: 0, str: 0 },

  'Digit2': { fret: 3, str: 1 },
  'KeyW': { fret: 2, str: 1 },
  'KeyS': { fret: 1, str: 1 },
  'KeyZ': { fret: 0, str: 1 },

  'Digit3': { fret: 3, str: 2 },
  'KeyE': { fret: 2, str: 2 },
  'KeyD': { fret: 1, str: 2 },
  'KeyX': { fret: 0, str: 2 },

  'Digit4': { fret: 3, str: 3 },
  'KeyR': { fret: 2, str: 3 },
  'KeyF': { fret: 1, str: 3 },
  'KeyC': { fret: 0, str: 3 },

  'Digit5': { fret: 3, str: 4 },
  'KeyT': { fret: 2, str: 4 },
  'KeyG': { fret: 1, str: 4 },
  'KeyV': { fret: 0, str: 4 },

  'Digit6': { fret: 3, str: 5 },
  'KeyY': { fret: 2, str: 5 },
  'KeyH': { fret: 1, str: 5 },
  'KeyB': { fret: 0, str: 5 },

  'Digit7': { fret: 7, str: 0 },
  'KeyU': { fret: 6, str: 0 },
  'KeyJ': { fret: 5, str: 0 },
  'KeyN': { fret: 4, str: 0 },

  'Digit8': { fret: 7, str: 1 },
  'KeyI': { fret: 6, str: 1 },
  'KeyK': { fret: 5, str: 1 },
  'KeyM': { fret: 4, str: 1 },

  'Digit9': { fret: 7, str: 2 },
  'KeyO': { fret: 6, str: 2 },
  'KeyL': { fret: 5, str: 2 },
  'Comma': { fret: 4, str: 2 },

  'Digit0': { fret: 7, str: 3 },
  'KeyP': { fret: 6, str: 3 },
  'Semicolon': { fret: 5, str: 3 },
  'Period': { fret: 4, str: 3 },

  'Minus': { fret: 7, str: 4 },
  'BracketLeft': { fret: 6, str: 4 },
  'Quote': { fret: 5, str: 4 },
  'Slash': { fret: 4, str: 4 },

  'Equal': { fret: 7, str: 5 },
  'BracketRight': { fret: 6, str: 5 },
  'Backslash': { fret: 5, str: 5 },
  'ShiftRight': { fret: 4, str: 5 },
};

const guitarSamples = {};

frets.value.forEach(fret => {
  fret.forEach(strFret => {
    guitarSamples[strFret.note] = `${BASE_URL}/samples/Guitar.${strFret.note}.mp3`;
  })
})

/** @type {import('vue').Ref<GuitarPos[]>} */
const activeNotes = ref([]);
/** @type {import('vue').Ref<Boolean>} */
const isShifting = ref(false);
/** @type {import('vue').Ref<Boolean>} */
const toggleShifting = ref(false);

const handleKeyDown = (event) => {
  if (event.repeat) return;

  if (event.code === 'ArrowUp' || event.code === 'Numpad8' || event.code === 'Space') {
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

  if (event.code === 'CapsLock') {
    toggleShifting.value = !toggleShifting.value;
    isShifting.value = toggleShifting.value;
    return;
  }

  if (event.code === 'ArrowRight') {
    if (capoPos.value < 12) capoPos.value += 1;
    return;
  }

  if (event.code === 'ArrowLeft') {
    if (capoPos.value > 0) capoPos.value -= 1;
    return;
  }

  if (event.code in keyToStrfret) {
    const strFret = keyToStrfret[event.code];
    activeNotes.value.push(strFret);
    if (isShifting.value) {
      const strFretObject = frets.value[strFret.fret][strFret.str];
      pressKey(strFretObject);
    }

  }

}

/** @type {import('vue').Ref<Number>} */
const capoPos = ref(0);

/**
 * 
 * @param {'up'|'down'} strumDir
 */
const playPressedKeys = (strumDir) => {
  const highestPerString = Array.from({ length: 6 }, (_, i) => i).map(str =>
    activeNotes.value.filter(n => n.str === str)
      .reduce((max, n) => (max === null || n.fret > max.fret ? n : max), null)
  );

  console.log('-----');
  if (strumDir === 'up') {
    for (let i = 0; i < 6; i++) {
      const strFret = highestPerString[5 - i];
      const strFretObject = (strFret) ? frets.value[strFret.fret][strFret.str] : frets.value[capoPos.value][5 - i];
      console.log(`played ${strFretObject.note}`);

      setTimeout(() => playNote(strFretObject.note), i * 10);
    }
  } else if (strumDir === 'down') {
    for (let i = 0; i < 6; i++) {
      const strFret = highestPerString[i];
      const strFretObject = (strFret) ? frets.value[strFret.fret][strFret.str] : frets.value[capoPos.value][i];
      console.log(`played ${strFretObject.note}`);
      setTimeout(() => playNote(strFretObject.note), i * 10);
    }
  }
  console.log('-----\n');
}

const handleKeyUp = (event) => {
  if (event.code === 'ShiftLeft' && !toggleShifting.value) {
    isShifting.value = false;
    return;
  }

  if (event.code in keyToStrfret) {
    const strFret = keyToStrfret[event.code];
    const strFretIndex = activeNotes.value.indexOf(strFret);
    activeNotes.value.splice(strFretIndex);
  }
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
/** @param {GuitarPos} strFret  */
function buttonClass(strFret) {
  if (strFret.fret === capoPos.value) {
    return 'bg-blue-800';
  }
  if (activeNotes.value.some(e => e.fret === strFret.fret && e.str === strFret.str)) {
    return 'bg-blue-400';
  }
  return 'bg-transparent';
}

</script>

<template>

  <div class="relative">
    <div class="flex py-4 justify-center items-center">
      <span class="w-[355px] h-[188px]" id="guitar_head"></span>
      <span class="w-[576px] h-[144px]" id="guitar_fretboard"></span>
      <div class="flex h-[320px] px-[64px] items-center gap-[64px] bg-[#E29D62] rounded-3xl">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="176" height="176" viewBox="0 0 176 176" fill="none">
            <circle cx="88" cy="88" r="88" fill="#331800" />
          </svg>
        </span>
        <span class="w-[10px] h-[144px] bg-white"></span>
      </div>
    </div>
    <div class="absolute top-1/2 -translate-y-1/2 left-[355px]">
      <div class="flex">
        <span v-for="(fret, i) in frets" class="flex flex-col">
          <span v-for="(strFret, j) in fret" class="h-[24px]">
            <button class="text-white w-[48px] h-[24px]" :class="buttonClass({ fret: i, str: j })"
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
  </div>
</template>

<style lang="css" scoped>
#guitar_head {
  background-image: url('@/assets/Guitar/guitar_head.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

#guitar_fretboard {
  background: url('@/assets/Guitar/guitar_fret.png') repeat;
}
</style>