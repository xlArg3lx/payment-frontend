import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCheckoutStore } from "./checkout";
import type { Product } from "@/api/products";
import type { Customer } from "@/api/customers";
import type { Transaction } from "@/api/transactions";

// Mocks
vi.mock("@/api/products", () => ({
  productsApi: { getAll: vi.fn() },
}));

vi.mock("@/api/customers", () => ({
  customersApi: {
    createOrFind: vi.fn(),
  },
}));

vi.mock("@/api/transactions", () => ({
  transactionsApi: {
    create: vi.fn(),
    process: vi.fn(),
    getById: vi.fn(),
  },
}));

vi.mock("@/api/wompi", () => ({
  wompiApi: {
    tokenizeCard: vi.fn(),
  },
}));

const mockProduct: Product = {
  id: "product-uuid",
  name: "Laptop Pro",
  description: "Descripción",
  priceCents: 350000000,
  stock: 10,
  imageUrl: "https://image.url",
  isAvailable: true,
};

const mockCustomer: Customer = {
  id: "customer-uuid",
  name: "Juan Pérez",
  email: "juan@test.com",
  phone: "3001234567",
};

const mockTransaction: Transaction = {
  id: "transaction-uuid",
  customerId: "customer-uuid",
  productId: "product-uuid",
  status: "APPROVED",
  amountCents: 350000000,
  baseFeeCents: 300000,
  deliveryFeeCents: 150000,
  totalCents: 350450000,
  wompiTransactionId: "wompi-tx-id",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("useCheckoutStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  // ─── Mutations ───────────────────────────────────────────
  describe("Mutations", () => {
    it("SET_STEP should update currentStep", () => {
      const store = useCheckoutStore();
      store.SET_STEP(2);
      expect(store.currentStep).toBe(2);
    });

    it("SET_PRODUCT should update selectedProduct", () => {
      const store = useCheckoutStore();
      store.SET_PRODUCT(mockProduct);
      expect(store.selectedProduct).toEqual(mockProduct);
    });

    it("SET_CUSTOMER should update customer", () => {
      const store = useCheckoutStore();
      store.SET_CUSTOMER(mockCustomer);
      expect(store.customer).toEqual(mockCustomer);
    });

    it("SET_TRANSACTION should update transaction", () => {
      const store = useCheckoutStore();
      store.SET_TRANSACTION(mockTransaction);
      expect(store.transaction).toEqual(mockTransaction);
    });

    it("SET_LOADING should update isLoading", () => {
      const store = useCheckoutStore();
      store.SET_LOADING(true);
      expect(store.isLoading).toBe(true);
    });

    it("SET_ERROR should update error", () => {
      const store = useCheckoutStore();
      store.SET_ERROR("Test error");
      expect(store.error).toBe("Test error");
    });

    it("SET_CARD_INFO should NOT persist to localStorage", () => {
      const store = useCheckoutStore();
      store.SET_CARD_INFO({
        number: "4111111111111111",
        expMonth: "12",
        expYear: "29",
        cvc: "123",
        cardHolder: "Juan Pérez",
      });
      const session = JSON.parse(localStorage.getItem("checkout_session") || "{}");
      expect(session.cardInfo).toBeUndefined();
    });

    it("SET_CARD_TOKEN should NOT persist to localStorage", () => {
      const store = useCheckoutStore();
      store.SET_CARD_TOKEN({
        id: "tok_test",
        brand: "VISA",
        lastFour: "1111",
        expiryMonth: "12",
        expiryYear: "29",
      });
      const session = JSON.parse(localStorage.getItem("checkout_session") || "{}");
      expect(session.cardToken).toBeUndefined();
    });

    it("CLEAR_SESSION should reset all state", () => {
      const store = useCheckoutStore();
      store.SET_PRODUCT(mockProduct);
      store.SET_CUSTOMER(mockCustomer);
      store.SET_TRANSACTION(mockTransaction);
      store.CLEAR_SESSION();

      expect(store.selectedProduct).toBeNull();
      expect(store.customer).toBeNull();
      expect(store.transaction).toBeNull();
      expect(store.currentStep).toBe(1);
      expect(localStorage.getItem("checkout_session")).toBeNull();
    });
  });

  // ─── Getters ─────────────────────────────────────────────
  describe("Getters", () => {
    it("isApproved should return true when status is APPROVED", () => {
      const store = useCheckoutStore();
      store.SET_TRANSACTION(mockTransaction);
      expect(store.isApproved).toBe(true);
    });

    it("isDeclined should return true when status is DECLINED", () => {
      const store = useCheckoutStore();
      store.SET_TRANSACTION({ ...mockTransaction, status: "DECLINED" });
      expect(store.isDeclined).toBe(true);
    });

    it("isFinished should return true when APPROVED", () => {
      const store = useCheckoutStore();
      store.SET_TRANSACTION(mockTransaction);
      expect(store.isFinished).toBe(true);
    });

    it("isFinished should return false when PENDING", () => {
      const store = useCheckoutStore();
      store.SET_TRANSACTION({ ...mockTransaction, status: "PENDING" });
      expect(store.isFinished).toBe(false);
    });

    it("totalCents should return transaction totalCents", () => {
      const store = useCheckoutStore();
      store.SET_TRANSACTION(mockTransaction);
      expect(store.totalCents).toBe(350450000);
    });

    it("totalCents should return 0 when no transaction", () => {
      const store = useCheckoutStore();
      expect(store.totalCents).toBe(0);
    });
  });

  // ─── Actions ─────────────────────────────────────────────
  describe("Actions", () => {
    it("selectProduct should set product and step 2", async () => {
      const store = useCheckoutStore();
      await store.selectProduct(mockProduct);
      expect(store.selectedProduct).toEqual(mockProduct);
      expect(store.currentStep).toBe(2);
    });

    it("tokenizeAndSaveCustomer should return true on success", async () => {
      const { wompiApi } = await import("@/api/wompi");
      const { customersApi } = await import("@/api/customers");

      vi.mocked(wompiApi.tokenizeCard).mockResolvedValue({
        id: "tok_test",
        brand: "VISA",
        lastFour: "1111",
        expiryMonth: "12",
        expiryYear: "29",
      });
      vi.mocked(customersApi.createOrFind).mockResolvedValue(mockCustomer);

      const store = useCheckoutStore();
      const result = await store.tokenizeAndSaveCustomer(
        {
          number: "4111111111111111",
          expMonth: "12",
          expYear: "29",
          cvc: "123",
          cardHolder: "Juan",
        },
        {
          name: "Juan",
          email: "juan@test.com",
          phone: "3001234567",
          address: "Calle 1",
          city: "Bogotá",
          department: "Cundinamarca",
        },
      );

      expect(result).toBe(true);
      expect(store.customer).toEqual(mockCustomer);
      expect(store.currentStep).toBe(3);
    });

    it("tokenizeAndSaveCustomer should return false on error", async () => {
      const { wompiApi } = await import("@/api/wompi");
      vi.mocked(wompiApi.tokenizeCard).mockRejectedValue(new Error("Error"));

      const store = useCheckoutStore();
      const result = await store.tokenizeAndSaveCustomer(
        {
          number: "4111111111111111",
          expMonth: "12",
          expYear: "29",
          cvc: "123",
          cardHolder: "Juan",
        },
        {
          name: "Juan",
          email: "juan@test.com",
          phone: "3001234567",
          address: "Calle 1",
          city: "Bogotá",
          department: "Cundinamarca",
        },
      );

      expect(result).toBe(false);
      expect(store.error).toBeTruthy();
    });

    it("processPayment should return true on success", async () => {
      const { transactionsApi } = await import("@/api/transactions");

      vi.mocked(transactionsApi.create).mockResolvedValue({
        ...mockTransaction,
        status: "PENDING",
      });
      vi.mocked(transactionsApi.process).mockResolvedValue(mockTransaction);

      const store = useCheckoutStore();
      store.SET_PRODUCT(mockProduct);
      store.SET_CUSTOMER(mockCustomer);
      store.SET_CARD_TOKEN({
        id: "tok_test",
        brand: "VISA",
        lastFour: "1111",
        expiryMonth: "12",
        expiryYear: "29",
      });

      const result = await store.processPayment();

      expect(result).toBe(true);
      expect(store.transaction?.status).toBe("APPROVED");
      expect(store.currentStep).toBe(4);
    });

    it("processPayment should return false when missing data", async () => {
      const store = useCheckoutStore();
      const result = await store.processPayment();
      expect(result).toBe(false);
      expect(store.error).toBeTruthy();
    });

    it("processPayment should return false on API error", async () => {
      const { transactionsApi } = await import("@/api/transactions");
      vi.mocked(transactionsApi.create).mockRejectedValue(new Error("API Error"));

      const store = useCheckoutStore();
      store.SET_PRODUCT(mockProduct);
      store.SET_CUSTOMER(mockCustomer);
      store.SET_CARD_TOKEN({
        id: "tok_test",
        brand: "VISA",
        lastFour: "1111",
        expiryMonth: "12",
        expiryYear: "29",
      });

      const result = await store.processPayment();
      expect(result).toBe(false);
      expect(store.error).toBeTruthy();
    });
  });

  // ─── Persistence ─────────────────────────────────────────
  describe("Persistence", () => {
    it("should persist session to localStorage on SET_PRODUCT", () => {
      const store = useCheckoutStore();
      store.SET_PRODUCT(mockProduct);
      const session = JSON.parse(localStorage.getItem("checkout_session")!);
      expect(session.selectedProduct).toEqual(mockProduct);
    });

    it("should persist transactionId to localStorage", () => {
      const store = useCheckoutStore();
      store.SET_TRANSACTION(mockTransaction);
      const session = JSON.parse(localStorage.getItem("checkout_session")!);
      expect(session.transactionId).toBe("transaction-uuid");
    });

    it("getStoredTransactionId should return transactionId from localStorage", () => {
      const store = useCheckoutStore();
      store.SET_TRANSACTION(mockTransaction);
      expect(store.getStoredTransactionId()).toBe("transaction-uuid");
    });

    it("getStoredTransactionId should return null when no session", () => {
      const store = useCheckoutStore();
      expect(store.getStoredTransactionId()).toBeNull();
    });

    it("recoverSession should return false when no session", async () => {
      const store = useCheckoutStore();
      const result = await store.recoverSession();
      expect(result).toBe(false);
    });

    it("recoverSession should return false when session expired", async () => {
      localStorage.setItem(
        "checkout_session",
        JSON.stringify({
          currentStep: 2,
          selectedProduct: mockProduct,
          expiresAt: Date.now() - 1000,
        }),
      );
      const store = useCheckoutStore();
      const result = await store.recoverSession();
      expect(result).toBe(false);
      expect(store.selectedProduct).toBeNull();
    });
  });
});
