<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { productsApi, type Product } from "@/api/products";
import { useCheckoutStore } from "@/stores/checkout";
import AppHeader from "@/components/layout/AppHeader.vue";
import ProductList from "@/components/products/ProductList.vue";
import CheckoutModal from "@/components/checkout/CheckoutModal.vue";
import PaymentBackdrop from "@/components/checkout/PaymentBackdrop.vue";
import type { CardFormData } from "@/components/checkout/CardForm.vue";
import type { DeliveryFormData } from "@/components/checkout/DeliveryForm.vue";

const router = useRouter();
const store = useCheckoutStore();

const products = ref<Product[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const showModal = ref(false);
const showBackdrop = ref(false);
const selectedProduct = ref<Product | null>(null);
const cardData = ref<CardFormData | null>(null);

async function loadProducts() {
  isLoading.value = true;
  error.value = null;
  try {
    products.value = await productsApi.getAll();
  } catch {
    error.value = "Error al cargar los productos. Intenta de nuevo.";
  } finally {
    isLoading.value = false;
  }
}

function onSelectProduct(product: Product) {
  selectedProduct.value = product;
  store.selectProduct(product);
  store.SET_ERROR(null);
  showModal.value = true;
}

async function onCheckoutSubmit(card: CardFormData, delivery: DeliveryFormData) {
  const success = await store.tokenizeAndSaveCustomer(
    {
      number: card.number,
      expMonth: card.expMonth,
      expYear: card.expYear,
      cvc: card.cvc,
      cardHolder: card.cardHolder,
    },
    {
      name: delivery.name,
      email: delivery.email,
      phone: delivery.phone,
      address: delivery.address,
      city: delivery.city,
      department: delivery.department,
    },
  );

  if (success) {
    cardData.value = card;
    showModal.value = false;
    setTimeout(() => {
      showBackdrop.value = true;
    }, 300);
  }
}

async function onConfirmPayment() {
  const success = await store.processPayment();
  if (success) {
    showBackdrop.value = false;
    router.push("/result");
  }
}

function onEditCard() {
  showBackdrop.value = false;
  setTimeout(() => {
    showModal.value = true;
  }, 300);
}

onMounted(async () => {
  await loadProducts();

  const hasTransaction = await store.recoverSession();

  if (hasTransaction && store.isFinished) {
    router.push("/result");
    return;
  }

  if (store.selectedProduct && store.currentStep === 2) {
    selectedProduct.value = store.selectedProduct;
    showModal.value = true;
  } else if (store.selectedProduct && store.currentStep === 3 && !store.cardToken) {
    // Tenía resumen abierto pero el cardToken expiró — volvemos al modal
    selectedProduct.value = store.selectedProduct;
    store.SET_STEP(2);
    showModal.value = true;
  }
});
</script>

<template>
  <div class="products-page">
    <AppHeader />

    <main class="products-page__main">
      <div class="products-page__container">
        <!-- Hero -->
        <div class="products-page__hero">
          <p class="products-page__hero-eyebrow">Tienda exclusiva</p>
          <h1 class="products-page__hero-title">Productos<br />disponibles</h1>
          <p class="products-page__hero-subtitle">
            Selecciona un producto y completa tu compra de forma segura
          </p>
        </div>

        <!-- Product list -->
        <ProductList
          :products="products"
          :loading="isLoading"
          :error="error"
          @select="onSelectProduct"
          @retry="loadProducts"
        />
      </div>
    </main>

    <!-- Checkout Modal -->
    <CheckoutModal
      v-model="showModal"
      :product="selectedProduct"
      :loading="store.isLoading"
      :error="store.error"
      @submit="onCheckoutSubmit"
    />

    <!-- Payment Backdrop -->
    <PaymentBackdrop
      v-model="showBackdrop"
      :product="selectedProduct"
      :card="cardData"
      :loading="store.isLoading"
      :error="store.error"
      @confirm="onConfirmPayment"
      @edit-card="onEditCard"
    />
  </div>
</template>

<style scoped>
.products-page {
  min-height: 100vh;
  background: #f8f7f4;
  font-family: "DM Sans", sans-serif;
}

.products-page__main {
  padding: 40px 24px 80px;
}

.products-page__container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.products-page__hero {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.products-page__hero-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #c9a84c;
  margin: 0;
}

.products-page__hero-title {
  font-family: "DM Sans", sans-serif;
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.15;
  margin: 0;
}

.products-page__hero-subtitle {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
  max-width: 480px;
}

@media (max-width: 640px) {
  .products-page__main {
    padding: 24px 16px 60px;
  }
}
</style>
