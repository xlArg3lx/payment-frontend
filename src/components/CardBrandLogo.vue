<script setup lang="ts">
import type { CardBrand } from "@/utils/card";

withDefaults(
  defineProps<{
    brand: CardBrand;
    size?: "sm" | "md";
    dark?: boolean;
  }>(),
  { size: "md", dark: false },
);
</script>

<template>
  <div class="brand-logo" :class="`brand-logo--${size}`">
    <img
      v-if="brand === 'VISA'"
      src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Visa_Inc._logo_%281992%E2%80%931999%29.svg"
      alt="VISA"
      class="brand-logo__img brand-logo__img--visa"
    />
    <img
      v-else-if="brand === 'MASTERCARD'"
      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
      alt="Mastercard"
      class="brand-logo__img brand-logo__img--mc"
    />
    <div v-else class="brand-logo__unknown">
      <svg
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        opacity="0.3"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" stroke-width="2" />
        <line x1="1" y1="10" x2="23" y2="10" stroke-width="2" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-logo--md {
  width: 48px;
  height: 32px;
}
.brand-logo--sm {
  width: 36px;
  height: 24px;
}

.brand-logo__img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
.brand-logo__unknown {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
