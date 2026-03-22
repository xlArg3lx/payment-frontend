import apiClient from "./client";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
}

export const customersApi = {
  createOrFind: async (dto: CreateCustomerDto): Promise<Customer> => {
    const response = await apiClient.post("/customers", dto);
    return response.data.data;
  },
};
