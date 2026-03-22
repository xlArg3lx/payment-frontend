<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    id?: string;
    type?: string;
    placeholder?: string;
    maxlength?: number;
    error?: string;
    dark?: boolean;
  }>(),
  { type: "text", dark: false },
);

defineEmits<{ "update:modelValue": [value: string] }>();

const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2)}`);
</script>

<template>
  <div class="field">
    <label v-if="label" :for="inputId" class="field__label">{{ label }}</label>
    <div
      class="field__wrapper"
      :class="{ 'field__wrapper--error': error, 'field__wrapper--dark': dark }"
    >
      <div v-if="$slots.prefix" class="field__prefix">
        <slot name="prefix" />
      </div>
      <input
        :id="inputId"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :maxlength="maxlength"
        class="field__input"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        v-bind="$attrs"
      />
      <div v-if="$slots.suffix" class="field__suffix">
        <slot name="suffix" />
      </div>
    </div>
    <span v-if="error" class="field__error">{{ error }}</span>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  width: 100%;
}

.field__label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  font-family: "DM Sans", sans-serif;
}

.field__wrapper {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
  overflow: hidden;
  min-width: 0;
  width: 100%;
}

.field__wrapper:focus-within {
  border-color: #c9a84c;
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.12);
}
.field__wrapper--error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
.field__wrapper--dark {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.12);
}
.field__wrapper--dark:focus-within {
  border-color: #c9a84c;
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15);
}

.field__input {
  flex: 1;
  padding: 12px 14px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  font-family: "DM Sans", sans-serif;
  color: #1a1a2e;
  min-width: 0;
}

.field__wrapper--dark .field__input {
  color: #f0f0f0;
}
.field__wrapper--dark .field__input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.field__input::placeholder {
  color: #9ca3af;
}

.field__prefix,
.field__suffix {
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: #9ca3af;
}

.field__error {
  font-size: 12px;
  color: #ef4444;
  font-family: "DM Sans", sans-serif;
}
</style>
