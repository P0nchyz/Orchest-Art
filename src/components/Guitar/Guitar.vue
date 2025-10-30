<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const activeNotes = ref({});

const frets = ref([
  [{ note: 'E4', freq: '330' }, { note: 'B3', freq: '247' }, { note: 'G3', freq: '196' }, { note: 'D3', freq: '147' }, { note: 'A2', freq: '110' }, { note: 'E2', freq: '82' }],
  [{ note: 'F4', freq: '349' }, { note: 'C4', freq: '362' }, { note: 'G#3', freq: '208' }, { note: 'D#3', freq: '156' }, { note: 'A#2', freq: '117' }, { note: 'F2', freq: '87' }],
  [{ note: 'F#4', freq: '370' }, { note: 'C#4', freq: '377' }, { note: 'A3', freq: '220' }, { note: 'E3', freq: '165' }, { note: 'B2', freq: '123' }, { note: 'F#2', freq: '92' }],
  [{ note: 'G4', freq: '392' }, { note: 'D4', freq: '394' }, { note: 'A#3', freq: '233' }, { note: 'F3', freq: '175' }, { note: 'C3', freq: '131' }, { note: 'G2', freq: '98' }],
  [{ note: 'G#4', freq: '415' }, { note: 'D#4', freq: '311' }, { note: 'B3', freq: '247' }, { note: 'F#3', freq: '185' }, { note: 'C#3', freq: '139' }, { note: 'G#2', freq: '104' }],
  [{ note: 'A4', freq: '440' }, { note: 'E4', freq: '330' }, { note: 'C4', freq: '262' }, { note: 'G3', freq: '196' }, { note: 'D3', freq: '147' }, { note: 'A2', freq: '110' }],
  [{ note: 'A#4', freq: '466' }, { note: 'F4', freq: '349' }, { note: 'C#4', freq: '277' }, { note: 'G#3', freq: '208' }, { note: 'D#3', freq: '156' }, { note: 'A#2', freq: '117' }],
  [{ note: 'B4', freq: '494' }, { note: 'F#4', freq: '370' }, { note: 'D4', freq: '294' }, { note: 'A3', freq: '220' }, { note: 'E3', freq: '165' }, { note: 'B2', freq: '123' }],
  [{ note: 'C5', freq: '523' }, { note: 'G4', freq: '392' }, { note: 'D#4', freq: '311' }, { note: 'A#3', freq: '233' }, { note: 'F3', freq: '175' }, { note: 'C3', freq: '131' }],
  [{ note: 'C#5', freq: '554' }, { note: 'G#4', freq: '415' }, { note: 'E4', freq: '330' }, { note: 'B3', freq: '247' }, { note: 'F#3', freq: '185' }, { note: 'C#3', freq: '139' }],
  [{ note: 'D5', freq: '587' }, { note: 'A4', freq: '440' }, { note: 'F4', freq: '349' }, { note: 'C4', freq: '262' }, { note: 'G3', freq: '196' }, { note: 'D3', freq: '147' }],
  [{ note: 'D#5', freq: '662' }, { note: 'A#4', freq: '466' }, { note: 'F#4', freq: '370' }, { note: 'C#4', freq: '277' }, { note: 'G#3', freq: '208' }, { note: 'D#3', freq: '156' }],
  [{ note: 'E5', freq: '659' }, { note: 'B4', freq: '494' }, { note: 'G4', freq: '392' }, { note: 'D4', freq: '294' }, { note: 'A3', freq: '220' }, { note: 'E3', freq: '165' }],
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
  'KeyJ': [8, 4],
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
}

const handleKeyDown = (event) => {
  if (event.repeat) return;

  const strFret = keyToStrfret[event.code];

  const strFretObject = frets.value[strFret[0]][strFret[1]];

  pressKey(strFretObject);
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
})

// CHATGPTEADO
let audioContext = null;

function initializeAudio() {
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }
}

function pressKey(key) {
  if (!key) return;
  initializeAudio();

  activeNotes.value[key.note] = true;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(key.freq, audioContext.currentTime);

  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0.8, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1);

  oscillator.start(now);
  oscillator.stop(now + 1);

  setTimeout(() => {
    delete activeNotes.value[key.note];
  }, 500)
}

</script>

<template>
  <div>
    <div class="flex bg-[#703400]">
      <span v-for="fret in frets" class="flex flex-col border-x-2 border-x-white">
        <span v-for="strFret in fret" class="my-1 mx-4">
          <button @click="pressKey(strFret)" class="text-white">
            {{ strFret.note }}
          </button>
        </span>
      </span>
    </div>
  </div>
</template>