import { Product } from "../types/Product";

const BASE_URL = "http://localhost:8080/api/v1/articulos";

export const ProductServices = {
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/manufacturados`);
    const data = await response.json();

    return data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/manufacturados/${id}`);
    const data = await response.json();

    return data;
  },

  createProduct: async (product: Product): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/manufacturados`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    const data = await response.json();

    return data;
  },

  updateProduct: async (id: number, product: Product): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/manufacturados/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    const data = await response.json();

    return data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/manufacturados/${id}`, {
      method: "DELETE",
    });
  },
};
