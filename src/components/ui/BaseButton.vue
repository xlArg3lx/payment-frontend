<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    disabled?: boolean;
  }>(),
  { variant: "primary", size: "md", loading: false, disabled: false },
);
</script>

<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--loading': loading }]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn__spinner">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
        <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" opacity="0.75" />
      </svg>
    </span>
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: "DM Sans", sans-serif;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 14px;
  white-space: nowrap;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Sizes */
.btn--sm {
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 10px;
}
.btn--md {
  padding: 12px 22px;
  font-size: 14px;
}
.btn--lg {
  padding: 15px 24px;
  font-size: 15px;
  width: 100%;
}

/* Variants */
.btn--primary {
  background: linear-gradient(135deg, #c9a84c, #e8c56a);
  color: #0a0a0f;
  box-shadow: 0 4px 14px rgba(201, 168, 76, 0.3);
}
.btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(201, 168, 76, 0.4);
}
.btn--secondary {
  background: #ffffff;
  color: #1a1a2e;
  border: 1.5px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.btn--secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #c9a84c;
}
.btn--ghost {
  background: transparent;
  color: #6b7280;
}
.btn--ghost:hover:not(:disabled) {
  background: #f3f4f6;
  color: #1a1a2e;
}
.btn--danger {
  background: #ef4444;
  color: #fff;
}

/* Spinner */
.btn__spinner svg {
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
