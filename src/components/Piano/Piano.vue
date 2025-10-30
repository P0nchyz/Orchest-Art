<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import BlackKey from './BlackKey.vue';
import WhiteKey from './WhiteKey.vue';

const activeNotes = ref({});

const pianoKeys = ref([
  { white: { note: 'C3', freq: '131' }, black: { note: 'C#3', freq: '139' } },
  { white: { note: 'D3', freq: '147' }, black: { note: 'D#3', freq: '156' } },
  { white: { note: 'E3', freq: '165' }, black: null },
  { white: { note: 'F3', freq: '175' }, black: { note: 'F#3', freq: '185' } },
  { white: { note: 'G3', freq: '196' }, black: { note: 'G#3', freq: '208' } },
  { white: { note: 'A3', freq: '220' }, black: { note: 'A#3', freq: '233' } },
  { white: { note: 'B3', freq: '247' }, black: null },
  { white: { note: 'C4', freq: '262' }, black: { note: 'C#4', freq: '277' } },
  { white: { note: 'D4', freq: '294' }, black: { note: 'D#4', freq: '311' } },
  { white: { note: 'E4', freq: '330' }, black: null },
  { white: { note: 'F4', freq: '349' }, black: { note: 'F#4', freq: '370' } },
  { white: { note: 'G4', freq: '392' }, black: { note: 'G#4', freq: '415' } },
  { white: { note: 'A4', freq: '440' }, black: { note: 'A#4', freq: '466' } },
  { white: { note: 'B4', freq: '494' }, black: null },
  { white: { note: 'C5', freq: '523' }, black: { note: 'C#5', freq: '554' } },
  { white: { note: 'D5', freq: '587' }, black: { note: 'D#5', freq: '622' } },
  { white: { note: 'E5', freq: '659' }, black: null },
  { white: { note: 'F5', freq: '698' }, black: { note: 'F#5', freq: '740' } },
  { white: { note: 'G5', freq: '784' }, black: { note: 'G#5', freq: '831' } },
  { white: { note: 'A5', freq: '880' }, black: { note: 'A#5', freq: '932' } },
  { white: { note: 'B5', freq: '988' }, black: null },
]);

const noteMap = {};
pianoKeys.value.forEach(group => {
  noteMap[group.white.note] = group.white;
  if (group.black) {
    noteMap[group.black.note] = group.black;
  }
});

const keyToNoteMap = {
  'KeyQ': 'C3',
  'KeyW': 'D3',
  'KeyE': 'E3',
  'KeyR': 'F3',
  'KeyT': 'G3',
  'KeyY': 'A3',
  'KeyU': 'B3',
  'KeyI': 'C4',
  'KeyO': 'D4',
  'KeyP': 'E4',
  'BracketLeft': 'F4',
  'IntlBackslash': 'F4',
  'KeyZ': 'G4',
  'KeyX': 'A4',
  'KeyC': 'B4',
  'KeyV': 'C5',
  'KeyB': 'D5',
  'KeyN': 'E5',
  'KeyM': 'F5',
  'Comma': 'G5',
  'Period': 'A5',
  'Slash': 'B5',

  'Digit2': 'C#3',
  'Digit3': 'D#3',
  'Digit5': 'F#3',
  'Digit6': 'G#3',
  'Digit7': 'A#3',
  'Digit9': 'C#4',
  'Digit0': 'D#4',
  'KeyA': 'F#4',
  'KeyS': 'G#4',
  'KeyD': 'A#4',
  'KeyG': 'C#5',
  'KeyH': 'D#5',
  'KeyK': 'F#5',
  'KeyL': 'G#5',
  'Semicolon': 'A#5',
};

const handleKeyDown = (event) => {
  if (event.repeat) return;

  const noteName = keyToNoteMap[event.code];

  const keyObject = noteMap[noteName];

  pressKey(keyObject);
};

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

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(key.freq, audioContext.currentTime);

  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0.8, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

  oscillator.start(now);
  oscillator.stop(now + 0.5);

  setTimeout(() => {
    delete activeNotes.value[key.note];
  }, 500)
}
</script>

<template>
  <div class="flex flex-col w-fit">
    <span class="bg-black h-1"></span>
    <span class="flex">
      <div v-for="keyGroup in pianoKeys" :key="keyGroup.white.note" class="relative">
        <WhiteKey :pressed="activeNotes[keyGroup.white.note]" @click="pressKey(keyGroup.white)"/>
        <div v-if="keyGroup.black">
          <BlackKey class="absolute top-0 -right-4 z-2" :pressed="activeNotes[keyGroup.black.note]" @click="pressKey[keyGroup.black]"/>
        </div>
      </div>
    </span>
  </div>
</template>