import { UnidadMedida } from "../entities/DTO/UnidadMedida/UnidadMedida";

const BASE_URL = "http://localhost:8080/api/unidades-medida";

export const UnidadMedidaServices = {
  getUnidadMedida: async (): Promise<UnidadMedida[]> => {
    const response = await fetch(`${BASE_URL}`);
    const data = response.json();

    return data;
  },

  createUnidadMedida: async (
    unidadMedida: UnidadMedida
  ): Promise<UnidadMedida> => {
    const response = await fetch(`${BASE_URL}`, {
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
    const response = await fetch(`${BASE_URL}/${id}`, {
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
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
