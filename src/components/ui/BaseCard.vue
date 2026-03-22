<script setup lang="ts">
withDefaults(
  defineProps<{
    hoverable?: boolean;
    dark?: boolean;
  }>(),
  { hoverable: false, dark: false },
);
</script>

<template>
  <div class="card" :class="{ 'card--hoverable': hoverable, 'card--dark': dark }">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.25s ease;
}
.card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
  border-color: rgba(201, 168, 76, 0.3);
}
.card--dark {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
}
</style>
