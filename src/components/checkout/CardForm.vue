<script setup lang="ts">
import { computed, ref } from "vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import CardBrandLogo from "@/components/CardBrandLogo.vue";
import { detectCardBrand, formatCardNumber, formatExpiry } from "@/utils/card";

export interface CardFormData {
  number: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  cardHolder: string;
}

const props = defineProps<{
  modelValue: CardFormData;
  errors: Record<string, string>;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: CardFormData];
  "update:installments": [value: number];
}>();

const selectedInstallments = ref(1);

const cardBrand = computed(() => detectCardBrand(props.modelValue.number));

const displayNumber = computed(() => {
  const clean = props.modelValue.number.replace(/\s/g, "");
  if (!clean) return "•••• •••• •••• ••••";
  return clean
    .padEnd(16, "•")
    .replace(/(.{4})/g, "$1 ")
    .trim();
});

function update(field: keyof CardFormData, value: string) {
  emit("update:modelValue", { ...props.modelValue, [field]: value });
}

function onCardInput(e: Event) {
  const formatted = formatCardNumber((e.target as HTMLInputElement).value);
  update("number", formatted);
}

function onExpiryInput(e: Event) {
  const formatted = formatExpiry((e.target as HTMLInputElement).value);
  const [month, year] = formatted.split("/");
  emit("update:modelValue", {
    ...props.modelValue,
    expMonth: month || "",
    expYear: year || "",
  });
}

function onExpiryChange(_value: string) {}
</script>

<template>
  <div class="card-form">
    <!-- Card preview -->
    <div class="card-preview">
      <div class="card-preview__inner">
        <div class="card-preview__top">
          <div class="card-preview__chip">
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
              <rect width="28" height="22" rx="4" fill="rgba(255,255,255,0.3)" />
              <line x1="0" y1="7" x2="28" y2="7" stroke="rgba(255,255,255,0.4)" stroke-width="1" />
              <line
                x1="0"
                y1="15"
                x2="28"
                y2="15"
                stroke="rgba(255,255,255,0.4)"
                stroke-width="1"
              />
              <line x1="9" y1="0" x2="9" y2="22" stroke="rgba(255,255,255,0.4)" stroke-width="1" />
              <line
                x1="19"
                y1="0"
                x2="19"
                y2="22"
                stroke="rgba(255,255,255,0.4)"
                stroke-width="1"
              />
            </svg>
          </div>
          <CardBrandLogo :brand="cardBrand" :dark="false" />
        </div>
        <p class="card-preview__number">{{ displayNumber }}</p>
        <div class="card-preview__bottom">
          <div>
            <p class="card-preview__meta-label">Titular</p>
            <p class="card-preview__meta-value">{{ modelValue.cardHolder || "NOMBRE APELLIDO" }}</p>
          </div>
          <div>
            <p class="card-preview__meta-label">Vence</p>
            <p class="card-preview__meta-value">
              {{ modelValue.expMonth || "MM" }}/{{ modelValue.expYear || "AA" }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form fields -->
    <div class="card-form__fields">
      <div class="card-form__field-group">
        <BaseInput
          :model-value="modelValue.number"
          label="Número de tarjeta"
          placeholder="1234 5678 9012 3456"
          :maxlength="19"
          :error="errors.number"
          @update:model-value="update('number', $event)"
          @input="onCardInput"
        >
          <template #suffix>
            <CardBrandLogo :brand="cardBrand" :size="'sm'" />
          </template>
        </BaseInput>
      </div>

      <div class="card-form__row">
        <BaseInput
          :model-value="modelValue.expMonth + (modelValue.expYear ? '/' + modelValue.expYear : '')"
          label="Vencimiento"
          placeholder="MM/AA"
          :maxlength="5"
          :error="errors.expiry"
          @update:model-value="onExpiryChange"
          @input="onExpiryInput"
        />
        <BaseInput
          :model-value="modelValue.cvc"
          label="CVC"
          placeholder="•••"
          type="password"
          :maxlength="4"
          :error="errors.cvc"
          @update:model-value="update('cvc', $event)"
        />
      </div>

      <BaseInput
        :model-value="modelValue.cardHolder"
        label="Titular de la tarjeta"
        placeholder="Como aparece en la tarjeta"
        :error="errors.cardHolder"
        @update:model-value="update('cardHolder', $event)"
      />

      <div class="card-form__installments">
        <label class="card-form__label">Cuotas</label>
        <div class="card-form__installment-grid">
          <button
            v-for="n in [1, 3, 6, 12]"
            :key="n"
            :class="[
              'card-form__installment-btn',
              { 'card-form__installment-btn--active': selectedInstallments === n },
            ]"
            @click="selectedInstallments = n"
            type="button"
          >
            {{ n }}x
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Card preview */
.card-preview {
  perspective: 1000px;
}

.card-preview__inner {
  background: linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 50%, #1a1a2e 100%);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-preview__inner::before {
  content: "";
  position: absolute;
  top: -40px;
  right: -40px;
  width: 160px;
  height: 160px;
  background: rgba(201, 168, 76, 0.12);
  border-radius: 50%;
}

.card-preview__inner::after {
  content: "";
  position: absolute;
  bottom: -60px;
  left: -20px;
  width: 180px;
  height: 180px;
  background: rgba(201, 168, 76, 0.06);
  border-radius: 50%;
}

.card-preview__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 1;
}

.card-preview__chip {
  opacity: 0.8;
}

.card-preview__number {
  font-size: 20px;
  letter-spacing: 3px;
  color: #f0f0f0;
  font-weight: 500;
  font-family: "DM Sans", sans-serif;
  position: relative;
  z-index: 1;
  margin: 0;
}

.card-preview__bottom {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.card-preview__meta-label {
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 3px;
  font-family: "DM Sans", sans-serif;
}

.card-preview__meta-value {
  font-size: 13px;
  font-weight: 600;
  color: #f0f0f0;
  margin: 0;
  font-family: "DM Sans", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Fields */
.card-form__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
}
.card-form__label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  font-family: "DM Sans", sans-serif;
  display: block;
  margin-bottom: 8px;
}

.card-form__installment-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.card-form__installment-btn {
  padding: 10px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.card-form__installment-btn:hover {
  border-color: #c9a84c;
  color: #c9a84c;
}

.card-form__installment-btn--active {
  background: linear-gradient(135deg, #c9a84c, #e8c56a);
  border-color: transparent;
  color: #0a0a0f;
  box-shadow: 0 4px 12px rgba(201, 168, 76, 0.3);
}

@media (max-width: 390px) {
  .card-form__row {
    grid-template-columns: 1fr;
  }
}
</style>
