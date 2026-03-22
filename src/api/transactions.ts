import apiClient from "./client";

export interface Transaction {
  id: string;
  customerId: string;
  productId: string;
  status: "PENDING" | "APPROVED" | "DECLINED" | "ERROR";
  amountCents: number;
  baseFeeCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  wompiTransactionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  productId: string;
  customerId: string;
}

export interface ProcessPaymentDto {
  transactionId: string;
  cardToken: string;
  customerEmail: string;
  installments: number;
}

export const transactionsApi = {
  create: async (dto: CreateTransactionDto): Promise<Transaction> => {
    const response = await apiClient.post("/transactions", dto);
    return response.data.data;
  },

  process: async (dto: ProcessPaymentDto): Promise<Transaction> => {
    const response = await apiClient.post("/transactions/process", dto);
    return response.data.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data.data;
  },
};
