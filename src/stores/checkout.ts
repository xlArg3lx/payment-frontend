import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Product } from "@/api/products";
import type { Customer } from "@/api/customers";
import type { Transaction } from "@/api/transactions";
import type { CardToken } from "@/api/wompi";
import { productsApi } from "@/api/products";
import { customersApi } from "@/api/customers";
import { transactionsApi } from "@/api/transactions";
import { wompiApi } from "@/api/wompi";

export type CheckoutStep = 1 | 2 | 3 | 4;

export interface DeliveryInfo {
  address: string;
  city: string;
  department: string;
}

export interface CardInfo {
  number: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  cardHolder: string;
}

const STORAGE_KEY = "checkout_session";

export const useCheckoutStore = defineStore("checkout", () => {
  // ─── STATE ───────────────────────────────────────────────
  const currentStep = ref<CheckoutStep>(1);
  const selectedProduct = ref<Product | null>(null);
  const customer = ref<Customer | null>(null);
  const cardInfo = ref<CardInfo | null>(null);
  const cardToken = ref<CardToken | null>(null);
  const deliveryInfo = ref<DeliveryInfo | null>(null);
  const transaction = ref<Transaction | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ─── GETTERS ─────────────────────────────────────────────
  const totalCents = computed(() => transaction.value?.totalCents ?? 0);
  const baseFee = computed(() => transaction.value?.baseFeeCents ?? 300000);
  const deliveryFee = computed(() => transaction.value?.deliveryFeeCents ?? 150000);
  const isApproved = computed(() => transaction.value?.status === "APPROVED");
  const isDeclined = computed(() => transaction.value?.status === "DECLINED");
  const isFinished = computed(() => isApproved.value || isDeclined.value);

  // ─── MUTATIONS (síncronas) ────────────────────────────────
  function SET_STEP(step: CheckoutStep) {
    currentStep.value = step;
    _persistSession();
  }

  function SET_PRODUCT(product: Product | null) {
    selectedProduct.value = product;
    _persistSession();
  }

  function SET_CUSTOMER(c: Customer | null) {
    customer.value = c;
    _persistSession();
  }

  function SET_CARD_INFO(info: CardInfo | null) {
    cardInfo.value = info;
  }

  function SET_CARD_TOKEN(token: CardToken | null) {
    cardToken.value = token;
  }

  function SET_DELIVERY_INFO(info: DeliveryInfo | null) {
    deliveryInfo.value = info;
    _persistSession();
  }

  function SET_TRANSACTION(tx: Transaction | null) {
    transaction.value = tx;
    _persistSession();
  }

  function SET_LOADING(value: boolean) {
    isLoading.value = value;
  }

  function SET_ERROR(message: string | null) {
    error.value = message;
  }

  function CLEAR_SESSION() {
    currentStep.value = 1;
    selectedProduct.value = null;
    customer.value = null;
    cardInfo.value = null;
    cardToken.value = null;
    deliveryInfo.value = null;
    transaction.value = null;
    error.value = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  // ─── ACTIONS (asíncronas) ─────────────────────────────────
  async function selectProduct(product: Product) {
    CLEAR_SESSION();
    SET_PRODUCT(product);
    SET_STEP(2);
  }

  async function tokenizeAndSaveCustomer(
    card: CardInfo,
    delivery: DeliveryInfo & { name: string; email: string; phone: string },
  ) {
    SET_LOADING(true);
    SET_ERROR(null);
    try {
      const token = await wompiApi.tokenizeCard({
        number: card.number.replace(/\s/g, ""),
        expMonth: card.expMonth,
        expYear: card.expYear,
        cvc: card.cvc,
        cardHolder: card.cardHolder,
      });
      SET_CARD_TOKEN(token);
      SET_CARD_INFO(card);

      const c = await customersApi.createOrFind({
        name: delivery.name,
        email: delivery.email,
        phone: delivery.phone,
      });
      SET_CUSTOMER(c);
      SET_DELIVERY_INFO({
        address: delivery.address,
        city: delivery.city,
        department: delivery.department,
      });
      SET_STEP(3);
      return true;
    } catch {
      SET_ERROR("Error al procesar los datos. Verifica la información.");
      return false;
    } finally {
      SET_LOADING(false);
    }
  }

  async function processPayment() {
    if (!selectedProduct.value || !customer.value || !cardToken.value) {
      SET_ERROR("Faltan datos para procesar el pago.");
      return false;
    }

    SET_LOADING(true);
    SET_ERROR(null);

    try {
      const tx = await transactionsApi.create({
        productId: selectedProduct.value.id,
        customerId: customer.value.id,
      });
      SET_TRANSACTION(tx);

      const result = await transactionsApi.process({
        transactionId: tx.id,
        cardToken: cardToken.value.id,
        customerEmail: customer.value.email,
        installments: 1,
      });
      SET_TRANSACTION(result);
      SET_STEP(4);
      return true;
    } catch {
      SET_ERROR("Error al procesar el pago. Intenta de nuevo.");
      return false;
    } finally {
      SET_LOADING(false);
    }
  }

  async function recoverSession(): Promise<boolean> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    try {
      const session = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        CLEAR_SESSION();
        return false;
      }

      currentStep.value = session.currentStep ?? 1;
      selectedProduct.value = session.selectedProduct ?? null;
      customer.value = session.customer ?? null;
      deliveryInfo.value = session.deliveryInfo ?? null;

      if (session.transactionId) {
        const tx = await transactionsApi.getById(session.transactionId);
        SET_TRANSACTION(tx);
        return true;
      }

      return false;
    } catch {
      CLEAR_SESSION();
      return false;
    }
  }

  function getStoredTransactionId(): string | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw).transactionId ?? null;
    } catch {
      return null;
    }
  }

  // ─── PRIVATE ─────────────────────────────────────────────
  function _persistSession() {
    const session = {
      currentStep: currentStep.value,
      selectedProduct: selectedProduct.value,
      customer: customer.value,
      deliveryInfo: deliveryInfo.value,
      transactionId: transaction.value?.id ?? null,
      expiresAt: Date.now() + 30 * 60 * 1000,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  return {
    // State
    currentStep,
    selectedProduct,
    customer,
    cardInfo,
    cardToken,
    deliveryInfo,
    transaction,
    isLoading,
    error,
    // Getters
    totalCents,
    baseFee,
    deliveryFee,
    isApproved,
    isDeclined,
    isFinished,
    // Mutations
    SET_STEP,
    SET_PRODUCT,
    SET_CUSTOMER,
    SET_CARD_INFO,
    SET_CARD_TOKEN,
    SET_DELIVERY_INFO,
    SET_TRANSACTION,
    SET_LOADING,
    SET_ERROR,
    CLEAR_SESSION,
    // Actions
    selectProduct,
    tokenizeAndSaveCustomer,
    processPayment,
    recoverSession,
    getStoredTransactionId,
  };
});
