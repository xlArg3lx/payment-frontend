<script setup lang="ts">
defineProps<{ currentStep: number }>();

const steps = [
  { number: 1, label: "Productos" },
  { number: 2, label: "Pago" },
  { number: 3, label: "Resumen" },
  { number: 4, label: "Resultado" },
];
</script>

<template>
  <div class="steps">
    <template v-for="(step, index) in steps" :key="step.number">
      <div
        class="step"
        :class="{
          'step--active': currentStep === step.number,
          'step--done': currentStep > step.number,
        }"
      >
        <div class="step__circle">
          <svg
            v-if="currentStep > step.number"
            width="11"
            height="11"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span v-else>{{ step.number }}</span>
        </div>
        <span class="step__label">{{ step.label }}</span>
      </div>
      <div
        v-if="index < steps.length - 1"
        class="step__line"
        :class="{ 'step__line--done': currentStep > step.number }"
      />
    </template>
  </div>
</template>

<style scoped>
.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 100%;
  padding: 12px 0;
}

.step {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
}

.step__circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  font-family: "DM Sans", sans-serif;
  transition: all 0.3s ease;
  flex-shrink: 0;
  background: #f3f4f6;
  color: #9ca3af;
  border: 2px solid #e5e7eb;
}

.step--active .step__circle {
  background: #1a1a2e;
  color: #c9a84c;
  border-color: #1a1a2e;
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.2);
}

.step--done .step__circle {
  background: #c9a84c;
  color: #ffffff;
  border-color: #c9a84c;
}

.step__label {
  font-size: 12px;
  font-weight: 500;
  font-family: "DM Sans", sans-serif;
  color: #9ca3af;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.step--active .step__label {
  color: #1a1a2e;
  font-weight: 700;
}

.step--done .step__label {
  color: #6b7280;
  font-weight: 500;
}

.step__line {
  flex: 1;
  height: 2px;
  background: #e5e7eb;
  margin: 0 8px;
  min-width: 24px;
  max-width: 56px;
  border-radius: 2px;
  transition: background 0.3s ease;
}

.step__line--done {
  background: #c9a84c;
}

@media (max-width: 400px) {
  .step__label {
    display: none;
  }
  .step__line {
    min-width: 14px;
  }
}

@media (max-width: 480px) {
  .step__label {
    display: none;
  }

  .step--active .step__label {
    display: block;
  }

  .step__line {
    min-width: 12px;
    max-width: 24px;
  }

  .step__circle {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
}
</style>
