<script setup>
const props = defineProps(['pressed']);
</script>

<template>
  <button class="w-8 h-32 border border-black rounded-b-lg shadow-xl"
    :class="(props.pressed) ? 'bg-blue-400' : 'bg-black'"></button>
</template>