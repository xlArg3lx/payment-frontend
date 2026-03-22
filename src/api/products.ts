import apiClient from "./client";

export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  imageUrl: string;
  isAvailable: boolean;
}

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get("/products");
    return response.data.data;
  },
};
