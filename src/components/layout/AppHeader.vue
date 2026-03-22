<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <div class="header__brand" @click="router.push('/')">
        <svg
          width="40"
          height="32"
          viewBox="0 0 120 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Orejas -->
          <ellipse cx="22" cy="52" rx="22" ry="18" fill="#c9a84c" />
          <ellipse cx="98" cy="52" rx="22" ry="18" fill="#c9a84c" />
          <!-- Cabeza -->
          <ellipse cx="60" cy="44" rx="38" ry="38" fill="#1a1a2e" />
          <!-- Ojos externos -->
          <circle cx="44" cy="38" r="14" fill="#c9a84c" />
          <circle cx="76" cy="38" r="14" fill="#c9a84c" />
          <!-- Ojos internos -->
          <circle cx="44" cy="38" r="8" fill="#0a0a0f" />
          <circle cx="76" cy="38" r="8" fill="#0a0a0f" />
          <!-- Pupilas -->
          <circle cx="44" cy="38" r="3" fill="#c9a84c" />
          <circle cx="76" cy="38" r="3" fill="#c9a84c" />
          <!-- Trompa -->
          <rect x="50" y="54" width="20" height="28" rx="10" fill="#c9a84c" />
        </svg>
        <span class="header__name">QuillaStore</span>
      </div>

      <slot name="center" />

      <div class="header__right">
        <slot name="right">
          <span class="header__badge">Sandbox</span>
        </slot>
      </div>
    </div>
  </header>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap");

.header {
  background: #0a0a0f;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(20px);
}

.header__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;
}

.header__name {
  font-family: "Playfair Display", serif;
  font-size: 20px;
  font-weight: 700;
  color: #f0f0f0;
  letter-spacing: -0.3px;
}

.header__name {
  font-family: "DM Sans", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #f0f0f0;
  letter-spacing: -0.3px;
}

.header__right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.header__badge {
  font-family: "DM Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #c9a84c;
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid rgba(201, 168, 76, 0.2);
  padding: 4px 10px;
  border-radius: 20px;
}
</style>
