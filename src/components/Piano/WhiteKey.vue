<script setup>
const props = defineProps(['pressed']);
</script>

<template>
  <button class="w-16 h-64 border border-black rounded-b-lg shadow-2xl"
    :class="(props.pressed) ? 'bg-red-400' : 'bg-white'" @mousedown="$emit('keyPress')" @mouseup="$emit('keyRelease')"
    @mouseleave="$emit('keyRelease')" @touchstart.prevent="$emit('keyPress')" @touchend.prevent="$emit('keyRelease')"
    @touchcancel.prevent="$emit('keyRelease')"></button>
</template>