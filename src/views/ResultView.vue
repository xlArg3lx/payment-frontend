<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCheckoutStore } from "@/stores/checkout";
import { formatCurrency } from "@/utils/currency";
import AppHeader from "@/components/layout/AppHeader.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import StepIndicator from "@/components/layout/StepIndicator.vue";
import { translateStatus } from "@/utils/transaction";

const router = useRouter();
const store = useCheckoutStore();

const isApproved = computed(() => store.isApproved);

function goHome() {
  store.CLEAR_SESSION();
  router.push("/");
}

function retryPayment() {
  store.RETRY_PAYMENT();
  router.push("/");
}

onMounted(async () => {
  if (!store.transaction) {
    const transactionId = store.getStoredTransactionId();
    if (transactionId) {
      try {
        await store.recoverSession();
      } catch {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }
});
</script>

<template>
  <div class="result-page">
    <AppHeader />

    <div class="result-page__steps">
      <StepIndicator :current-step="4" />
    </div>

    <main class="result-page__main">
      <div class="result-page__container">
        <!-- Status card -->
        <div
          class="result-page__status-card"
          :class="{
            'result-page__status-card--success': isApproved,
            'result-page__status-card--error': !isApproved,
          }"
        >
          <div class="result-page__icon-wrapper">
            <div
              class="result-page__icon"
              :class="{
                'result-page__icon--success': isApproved,
                'result-page__icon--error': !isApproved,
              }"
            >
              <svg
                v-if="isApproved"
                width="32"
                height="32"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <svg
                v-else
                width="32"
                height="32"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <h1 class="result-page__title">
            {{ isApproved ? "¡Pago exitoso!" : "Pago rechazado" }}
          </h1>
          <p class="result-page__message">
            {{
              isApproved
                ? "Tu pedido ha sido confirmado. Recibirás tu producto pronto."
                : "No pudimos procesar tu pago. Verifica los datos e intenta de nuevo."
            }}
          </p>
        </div>

        <div class="result-page__grid">
          <!-- Transaction details -->
          <div class="result-page__section">
            <h2 class="result-page__section-title">Detalles de la transacción</h2>
            <div class="result-page__detail-card">
              <div class="result-page__detail-row">
                <span class="result-page__detail-label">ID transacción</span>
                <span class="result-page__detail-value result-page__detail-value--mono">
                  {{ store.transaction?.id?.slice(0, 8) }}...
                </span>
              </div>
              <div class="result-page__detail-row">
                <span class="result-page__detail-label">Estado</span>
                <span
                  class="result-page__status-badge"
                  :class="{
                    'result-page__status-badge--approved': isApproved,
                    'result-page__status-badge--declined': !isApproved,
                  }"
                >
                  {{ translateStatus(store.transaction?.status) }}
                </span>
              </div>
              <div v-if="store.transaction?.wompiTransactionId" class="result-page__detail-row">
                <span class="result-page__detail-label">Ref. Wompi</span>
                <span class="result-page__detail-value result-page__detail-value--mono">
                  {{ store.transaction.wompiTransactionId }}
                </span>
              </div>
              <div class="result-page__detail-row result-page__detail-row--total">
                <span class="result-page__detail-label">Total pagado</span>
                <span class="result-page__detail-total">
                  {{ formatCurrency(store.transaction?.totalCents ?? 0) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Product + Delivery -->
          <div class="result-page__section">
            <h2 class="result-page__section-title">
              {{ isApproved ? "Producto en camino" : "Producto" }}
            </h2>
            <div class="result-page__detail-card">
              <div v-if="store.selectedProduct" class="result-page__product-row">
                <img
                  :src="store.selectedProduct.imageUrl"
                  :alt="store.selectedProduct.name"
                  class="result-page__product-img"
                />
                <div>
                  <p class="result-page__product-name">{{ store.selectedProduct.name }}</p>
                  <span
                    class="result-page__delivery-status"
                    :class="{ 'result-page__delivery-status--active': isApproved }"
                  >
                    {{ isApproved ? "📦 Entrega en proceso" : "❌ No procesado" }}
                  </span>
                </div>
              </div>

              <div
                v-if="isApproved && store.deliveryInfo && store.customer"
                class="result-page__delivery-info"
              >
                <div class="result-page__delivery-divider" />
                <p class="result-page__delivery-name">{{ store.customer.name }}</p>
                <p class="result-page__delivery-address">{{ store.deliveryInfo.address }}</p>
                <p class="result-page__delivery-address">
                  {{ store.deliveryInfo.city }}, {{ store.deliveryInfo.department }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="result-page__actions">
          <BaseButton size="lg" @click="goHome">
            {{ isApproved ? "Seguir comprando" : "Volver al inicio" }}
          </BaseButton>
          <BaseButton v-if="!isApproved" variant="secondary" size="lg" @click="retryPayment">
            Intentar de nuevo
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  background: #f8f7f4;
  font-family: "DM Sans", sans-serif;
}

.result-page__main {
  padding: 40px 24px 80px;
}

.result-page__container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Status card */
.result-page__status-card {
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.result-page__status-card--success {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border: 1.5px solid #bbf7d0;
}

.result-page__status-card--error {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1.5px solid #fecaca;
}

.result-page__icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-page__icon--success {
  background: #22c55e;
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.35);
}
.result-page__icon--error {
  background: #ef4444;
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.35);
}

.result-page__title {
  font-family: "DM Sans", sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.result-page__message {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
  max-width: 400px;
}

/* Grid */
.result-page__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 640px) {
  .result-page__grid {
    grid-template-columns: 1fr;
  }
}

.result-page__section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-page__section-title {
  font-family: "DM Sans", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.result-page__detail-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1.5px solid #f0f0f0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.result-page__detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.result-page__detail-row--total {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.result-page__detail-label {
  font-size: 13px;
  color: #6b7280;
  flex-shrink: 0;
}

.result-page__detail-value {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
  text-align: right;
}

.result-page__detail-value--mono {
  font-family: monospace;
  font-size: 12px;
}

.result-page__detail-total {
  font-family: "DM Sans", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
}

.result-page__status-badge {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.result-page__status-badge--approved {
  background: #dcfce7;
  color: #16a34a;
}
.result-page__status-badge--declined {
  background: #fee2e2;
  color: #dc2626;
}

/* Product row */
.result-page__product-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.result-page__product-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
}

.result-page__product-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 6px;
}

.result-page__delivery-status {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.result-page__delivery-status--active {
  color: #16a34a;
}

.result-page__delivery-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 4px 0;
}

.result-page__delivery-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 4px;
}

.result-page__delivery-address {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.result-page__steps {
  background: #f8f7f4;
  padding: 4px 24px;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #e5e7eb;
}

/* Actions */
.result-page__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.result-page__actions > * {
  flex: 1;
  min-width: 200px;
}

@media (max-width: 480px) {
  .result-page__main {
    padding: 24px 16px 60px;
  }
  .result-page__status-card {
    padding: 32px 20px;
  }
  .result-page__title {
    font-size: 26px;
  }
}
</style>
