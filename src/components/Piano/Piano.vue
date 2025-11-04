<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useAudioEngine } from '@/composables/useAudioEngine';
import BlackKey from './BlackKey.vue';
import WhiteKey from './WhiteKey.vue';

const BASE_URL = import.meta.env.BASE_URL;

const pianoSamples = {};

const { isLoading, initAudio, loadInstrument, playNote, stopNote } = useAudioEngine();


const activeNotes = ref({});

const pianoKeys = ref([
  { white: { note: 'C3' }, black: { note: 'Cs3' } },
  { white: { note: 'D3' }, black: { note: 'Ds3' } },
  { white: { note: 'E3' }, black: null },
  { white: { note: 'F3' }, black: { note: 'Fs3' } },
  { white: { note: 'G3' }, black: { note: 'Gs3' } },
  { white: { note: 'A3' }, black: { note: 'As3' } },
  { white: { note: 'B3' }, black: null },
  { white: { note: 'C4' }, black: { note: 'Cs4' } },
  { white: { note: 'D4' }, black: { note: 'Ds4' } },
  { white: { note: 'E4' }, black: null },
  { white: { note: 'F4' }, black: { note: 'Fs4' } },
  { white: { note: 'G4' }, black: { note: 'Gs4' } },
  { white: { note: 'A4' }, black: { note: 'As4' } },
  { white: { note: 'B4' }, black: null },
  { white: { note: 'C5' }, black: { note: 'Cs5' } },
  { white: { note: 'D5' }, black: { note: 'Ds5' } },
  { white: { note: 'E5' }, black: null },
  { white: { note: 'F5' }, black: { note: 'Fs5' } },
  { white: { note: 'G5' }, black: { note: 'Gs5' } },
  { white: { note: 'A5' }, black: { note: 'As5' } },
  { white: { note: 'B5' }, black: null },
]);

const noteMap = {};
pianoKeys.value.forEach(group => {
  noteMap[group.white.note] = group.white;
  pianoSamples[group.white.note] = `${BASE_URL}/samples/Piano.${group.white.note}.mp3`;

  if (group.black) {
    noteMap[group.black.note] = group.black;
    pianoSamples[group.black.note] = `${BASE_URL}/samples/Piano.${group.black.note}.mp3`;
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

  'Digit2': 'Cs3',
  'Digit3': 'Ds3',
  'Digit5': 'Fs3',
  'Digit6': 'Gs3',
  'Digit7': 'As3',
  'Digit9': 'Cs4',
  'Digit0': 'Ds4',
  'KeyA': 'Fs4',
  'KeyS': 'Gs4',
  'KeyD': 'As4',
  'KeyG': 'Cs5',
  'KeyH': 'Ds5',
  'KeyK': 'Fs5',
  'KeyL': 'Gs5',
  'Semicolon': 'As5',
};

const handleKeyDown = (event) => {
  if (event.repeat) return;

  const noteName = keyToNoteMap[event.code];
  activeNotes.value[noteName] = true;

  const keyObject = noteMap[noteName];

  pressKey(keyObject);
};

const handleKeyUp = (event) => {
  const noteName = keyToNoteMap[event.code];

  activeNotes.value[noteName] = false;

  const keyObject = noteMap[noteName];

  if (keyObject && keyObject.note) {
    stopNote(keyObject.note);
  }
}

const handleKeyPress = (noteName) => {
  activeNotes.value[noteName] = true;
  const keyObject = noteMap[noteName];
  pressKey(keyObject);
}

const handleKeyRelease = (noteName) => {
  activeNotes.value[noteName] = false;
  const keyObject = noteMap[noteName];

  if (keyObject && keyObject.note) {
    stopNote(keyObject.note);
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  await initAudio();

  loadInstrument('piano', pianoSamples);
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
  <div class="flex flex-col w-fit">
    <span class="bg-black h-1"></span>
    <span class="flex">
      <div v-for="keyGroup in pianoKeys" :key="keyGroup.white.note" class="relative">
        <WhiteKey :pressed="activeNotes[keyGroup.white.note]" @keyPress="handleKeyPress(keyGroup.white.note)"
          @keyRelease="handleKeyRelease(keyGroup.white.note)" />
        <div v-if="keyGroup.black">
          <BlackKey class="absolute top-0 -right-4 z-2" :pressed="activeNotes[keyGroup.black.note]"
            @keyPress="handleKeyPress(keyGroup.black.note)" @keyRelease="handleKeyRelease(keyGroup.black.note)" />
        </div>
      </div>
    </span>
  </div>
</template>