import { UnidadMedida } from "../types/UnidadMedida";

const BASE_URL = "http://localhost:8080/api/v1";

export const UnidadMedidaServices = {
  getUnidadMedida: async (): Promise<UnidadMedida[]> => {
    const response = await fetch(`${BASE_URL}/unidadmedidas`);
    const data = response.json();

    return data;
  },

  createUnidadMedida: async (
    unidadMedida: UnidadMedida
  ): Promise<UnidadMedida> => {
    const response = await fetch(`${BASE_URL}/unidadmedidas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(unidadMedida),
    });
    const data = await response.json();

    return data;
  },

  updateUnidadMedida: async (
    id: number,
    unidadMedida: UnidadMedida
  ): Promise<UnidadMedida> => {
    const response = await fetch(`${BASE_URL}/unidadmedidas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(unidadMedida),
    });
    const data = await response.json();

    return data;
  },

  deleteUnidadMedida: async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/unidadmedidas/${id}`, {
      method: "DELETE",
    });
  },
};
