<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "@/api/products";
import type { CardFormData } from "./CardForm.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import CardBrandLogo from "@/components/CardBrandLogo.vue";
import StepIndicator from "@/components/layout/StepIndicator.vue";
import { formatCurrency } from "@/utils/currency";
import { detectCardBrand } from "@/utils/card";

const props = defineProps<{
  modelValue: boolean;
  product: Product | null;
  card: CardFormData | null;
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
  "edit-card": [];
}>();

const total = computed(() => (props.product?.priceCents ?? 0) + 300000 + 150000);
const cardBrand = computed(() => detectCardBrand(props.card?.number ?? ""));
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="modelValue" class="backdrop">
        <!-- Back layer -->
        <div class="backdrop__overlay" @click="$emit('update:modelValue', false)" />

        <!-- Sheet -->
        <div class="backdrop__sheet">
          <div class="backdrop__handle" />

          <!-- Step indicator -->
          <div class="backdrop__steps">
            <StepIndicator :current-step="3" />
          </div>

          <div class="backdrop__content">
            <!-- Header -->
            <div class="backdrop__header">
              <div>
                <h2 class="backdrop__title">Resumen de pago</h2>
                <p class="backdrop__subtitle">Confirma antes de pagar</p>
              </div>
              <button class="backdrop__close" @click="$emit('update:modelValue', false)">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Product row -->
            <div v-if="product" class="backdrop__product">
              <img :src="product.imageUrl" :alt="product.name" class="backdrop__product-img" />
              <div class="backdrop__product-info">
                <p class="backdrop__product-name">{{ product.name }}</p>
                <p class="backdrop__product-price">{{ formatCurrency(product.priceCents) }}</p>
              </div>
            </div>

            <!-- Fee breakdown -->
            <div class="backdrop__breakdown">
              <div class="backdrop__breakdown-row">
                <span class="backdrop__breakdown-label">Producto</span>
                <span class="backdrop__breakdown-value">{{
                  formatCurrency(product?.priceCents ?? 0)
                }}</span>
              </div>
              <div class="backdrop__breakdown-row">
                <span class="backdrop__breakdown-label">
                  Tarifa base
                  <span class="backdrop__breakdown-tag">siempre incluida</span>
                </span>
                <span class="backdrop__breakdown-value">{{ formatCurrency(300000) }}</span>
              </div>
              <div class="backdrop__breakdown-row">
                <span class="backdrop__breakdown-label">Envío</span>
                <span class="backdrop__breakdown-value">{{ formatCurrency(150000) }}</span>
              </div>
              <div class="backdrop__breakdown-total">
                <span class="backdrop__total-label">Total a pagar</span>
                <span class="backdrop__total-value">{{ formatCurrency(total) }}</span>
              </div>
            </div>

            <!-- Card summary -->
            <div v-if="card" class="backdrop__card-summary">
              <div class="backdrop__card-summary-left">
                <CardBrandLogo :brand="cardBrand" />
                <div>
                  <p class="backdrop__card-number">
                    •••• •••• •••• {{ card.number.replace(/\s/g, "").slice(-4) }}
                  </p>
                  <p class="backdrop__card-holder">{{ card.cardHolder }}</p>
                </div>
              </div>
              <button class="backdrop__card-edit" @click="$emit('edit-card')">Editar</button>
            </div>

            <!-- Error -->
            <div v-if="error" class="backdrop__error">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke-width="2" />
                <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" />
                <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" />
              </svg>
              {{ error }}
            </div>

            <!-- Pay button -->
            <BaseButton size="lg" :loading="loading" @click="$emit('confirm')">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="1" y="4" width="22" height="16" rx="2" stroke-width="2" />
                <line x1="1" y1="10" x2="23" y2="10" stroke-width="2" />
              </svg>
              {{ loading ? "Procesando pago..." : `Pagar ${formatCurrency(total)}` }}
            </BaseButton>

            <p class="backdrop__security-note">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke-width="2" />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 11V7a5 5 0 0110 0v4"
                />
              </svg>
              Pago 100% seguro · Encriptado SSL
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.backdrop__overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 15, 0.75);
  backdrop-filter: blur(6px);
}

.backdrop__sheet {
  position: relative;
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 28px 28px 0 0;
  border: 1px solid #e5e7eb;
  border-bottom: none;
  max-height: 85vh;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .backdrop {
    align-items: center;
    padding: 24px;
  }
  .backdrop__sheet {
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    max-height: 90vh;
  }
}

.backdrop__handle {
  width: 40px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin: 12px auto 0;
}

@media (min-width: 768px) {
  .backdrop__handle {
    display: none;
  }
}

.backdrop__content {
  padding: 20px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.backdrop__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.backdrop__title {
  font-family: "DM Sans", sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.backdrop__subtitle {
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0 0;
}

.backdrop__close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  flex-shrink: 0;
}

.backdrop__close:hover {
  background: #e5e7eb;
  color: #1a1a2e;
}

.backdrop__product {
  display: flex;
  gap: 12px;
  background: #f8f7f4;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px;
}

.backdrop__product-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
}

.backdrop__product-name {
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 4px;
}

.backdrop__product-price {
  font-family: "DM Sans", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #c9a84c;
  margin: 0;
}

.backdrop__breakdown {
  background: #f8f7f4;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.backdrop__breakdown-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.backdrop__breakdown-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: #6b7280;
}

.backdrop__breakdown-tag {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  background: rgba(201, 168, 76, 0.12);
  color: #92680a;
  border-radius: 20px;
  border: 1px solid rgba(201, 168, 76, 0.25);
}

.backdrop__breakdown-value {
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
}

.backdrop__breakdown-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.backdrop__total-label {
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
}

.backdrop__total-value {
  font-family: "DM Sans", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
}

.backdrop__card-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f7f4;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px 16px;
}

.backdrop__card-summary-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.backdrop__card-number {
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 2px;
}

.backdrop__card-holder {
  font-family: "DM Sans", sans-serif;
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.backdrop__card-edit {
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #c9a84c;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.backdrop__card-edit:hover {
  background: rgba(201, 168, 76, 0.1);
}

.backdrop__error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: #dc2626;
}

.backdrop__security-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: "DM Sans", sans-serif;
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

/* Transitions */
.backdrop-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.backdrop-leave-active {
  transition: all 0.25s ease;
}
.backdrop-enter-from {
  opacity: 0;
}
.backdrop-enter-from .backdrop__sheet {
  transform: translateY(100%);
}
.backdrop-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {
  .backdrop-enter-from .backdrop__sheet {
    transform: translateY(20px) scale(0.97);
  }
  .backdrop-leave-to .backdrop__sheet {
    transform: translateY(10px) scale(0.97);
  }
}

.backdrop__steps {
  padding: 4px 24px;
  background: #f8f7f4;
  border-bottom: 1px solid #e5e7eb;
}
</style>
