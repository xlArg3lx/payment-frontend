<script setup lang="ts">
import { ref, watch } from "vue";
import type { Product } from "@/api/products";
import BaseButton from "@/components/ui/BaseButton.vue";
import CardForm, { type CardFormData } from "./CardForm.vue";
import DeliveryForm, { type DeliveryFormData } from "./DeliveryForm.vue";
import StepIndicator from "@/components/layout/StepIndicator.vue";
import { luhnCheck } from "@/utils/card";

const props = defineProps<{
  modelValue: boolean;
  product: Product | null;
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [card: CardFormData, delivery: DeliveryFormData];
}>();

const activeTab = ref<"card" | "delivery">("card");

const cardData = ref<CardFormData>({
  number: "",
  expMonth: "",
  expYear: "",
  cvc: "",
  cardHolder: "",
});

const deliveryData = ref<DeliveryFormData>({
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  department: "",
});

const cardErrors = ref<Record<string, string>>({});
const deliveryErrors = ref<Record<string, string>>({});

import { useCheckoutStore } from "@/stores/checkout";
const store = useCheckoutStore();

// Pre-llenar datos de entrega si ya los tenía
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      activeTab.value = "card";
      cardErrors.value = {};
      deliveryErrors.value = {};

      // Recuperar datos de entrega del store
      if (store.deliveryInfo && store.customer) {
        deliveryData.value = {
          name: store.customer.name,
          email: store.customer.email,
          phone: store.customer.phone,
          address: store.deliveryInfo.address,
          city: store.deliveryInfo.city,
          department: store.deliveryInfo.department,
        };
      }
    }
  },
);

function validateCard(): boolean {
  cardErrors.value = {};
  const clean = cardData.value.number.replace(/\s/g, "");
  if (clean.length < 13 || !luhnCheck(clean))
    cardErrors.value.number = "Número de tarjeta inválido";
  if (!cardData.value.expMonth || !cardData.value.expYear)
    cardErrors.value.expiry = "Ingresa la fecha de vencimiento";
  if (cardData.value.cvc.length < 3) cardErrors.value.cvc = "CVC inválido";
  if (cardData.value.cardHolder.trim().length < 3)
    cardErrors.value.cardHolder = "Ingresa el nombre del titular";
  return Object.keys(cardErrors.value).length === 0;
}

function validateDelivery(): boolean {
  deliveryErrors.value = {};
  if (!deliveryData.value.name.trim()) deliveryErrors.value.name = "Ingresa tu nombre";
  if (!deliveryData.value.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    deliveryErrors.value.email = "Correo inválido";
  if (deliveryData.value.phone.length < 7) deliveryErrors.value.phone = "Teléfono inválido";
  if (!deliveryData.value.address.trim()) deliveryErrors.value.address = "Ingresa tu dirección";
  if (!deliveryData.value.city.trim()) deliveryErrors.value.city = "Ingresa la ciudad";
  if (!deliveryData.value.department.trim())
    deliveryErrors.value.department = "Ingresa el departamento";
  return Object.keys(deliveryErrors.value).length === 0;
}

function handleNext() {
  if (validateCard()) activeTab.value = "delivery";
}

function handleSubmit() {
  if (!validateDelivery()) return;
  emit("submit", cardData.value, deliveryData.value);
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="modal">
          <!-- Handle (mobile) -->
          <div class="modal__handle" />

          <!-- Header -->
          <div class="modal__header">
            <div>
              <h2 class="modal__title">Datos de pago</h2>
              <p class="modal__subtitle">{{ product?.name }}</p>
            </div>
            <button class="modal__close" @click="$emit('update:modelValue', false)">
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

          <!-- Step indicator -->
          <div class="modal__steps">
            <StepIndicator :current-step="2" />
          </div>

          <!-- Content -->
          <div class="modal__content">
            <Transition name="tab" mode="out-in">
              <CardForm v-if="activeTab === 'card'" v-model="cardData" :errors="cardErrors" />
              <DeliveryForm v-else v-model="deliveryData" :errors="deliveryErrors" />
            </Transition>
          </div>

          <!-- Error -->
          <div v-if="error" class="modal__error">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke-width="2" />
              <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" />
              <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" />
            </svg>
            {{ error }}
          </div>

          <!-- Footer -->
          <div class="modal__footer">
            <div v-if="activeTab === 'card'" class="modal__footer-actions">
              <BaseButton size="lg" :loading="loading" @click="handleNext">
                Continuar con entrega →
              </BaseButton>
            </div>
            <div v-else class="modal__footer-actions">
              <BaseButton variant="secondary" size="lg" @click="activeTab = 'card'">
                ← Volver
              </BaseButton>
              <BaseButton size="lg" :loading="loading" @click="handleSubmit">
                Ver resumen
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  padding: 0;
}

@media (min-width: 768px) {
  .modal-overlay {
    align-items: center;
    padding: 24px;
  }
}

.modal {
  width: 100%;
  max-width: 560px;
  background: #ffffff;
  border-radius: 28px 28px 0 0;
  max-height: 92vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .modal {
    border-radius: 24px;
    max-height: 90vh;
  }
}

.modal__handle {
  width: 40px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin: 12px auto 0;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .modal__handle {
    display: none;
  }
}

.modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 0;
  flex-shrink: 0;
}

.modal__title {
  font-family: "DM Sans", sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.modal__subtitle {
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0 0;
}

.modal__close {
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
  flex-shrink: 0;
  transition: all 0.2s;
}

.modal__close:hover {
  background: #e5e7eb;
  color: #1a1a2e;
}

.modal__tabs {
  display: flex;
  gap: 4px;
  padding: 16px 24px 0;
  flex-shrink: 0;
}

.modal__tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f3f4f6;
  color: #6b7280;
}

.modal__tab--active {
  background: #1a1a2e;
  color: #f0f0f0;
}

.modal__content {
  padding: 20px 24px;
  flex: 1;
  overflow-y: auto;
}

.modal__error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 24px;
  padding: 12px 14px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: #dc2626;
  flex-shrink: 0;
}

.modal__footer {
  padding: 16px 24px 24px;
  flex-shrink: 0;
  border-top: 1px solid #f3f4f6;
}

.modal__footer-actions {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
}

.modal__footer-actions:has(> :nth-child(2)) {
  grid-template-columns: 1fr 1fr;
}

/* Transitions */
.modal-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-leave-active {
  transition: all 0.25s ease;
}
.modal-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.modal-leave-to {
  opacity: 0;
  transform: translateY(40px);
}

@media (min-width: 768px) {
  .modal-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  .modal-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.97);
  }
}

.tab-enter-active,
.tab-leave-active {
  transition: all 0.2s ease;
}
.tab-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.tab-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

.modal__steps {
  padding: 4px 24px;
  background: #f8f7f4;
  border-bottom: 1px solid #e5e7eb;
}
</style>
