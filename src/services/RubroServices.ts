import { json } from "react-router-dom";
import { Rubro } from "../types/Rubro";

const BASE_URL = "http://localhost:8080/api/v1";

export const RubroServices = {
  getRubros: async (): Promise<Rubro[]> => {
    const response = await fetch(`${BASE_URL}/rubros`);
    const data = await response.json();

    return data;
  },

  createRubro: async (rubro: Rubro): Promise<Rubro> => {
    const response = await fetch(`${BASE_URL}/rubros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rubro),
    });
    const data = await response.json();

    return data;
  },

  updateRubro: async (id: number, rubro: Rubro): Promise<Rubro> => {
    const response = await fetch(`${BASE_URL}/rubros/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rubro),
    });
    const data = await response.json();

    return data;
  },

  deleteRubro: async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/rubros/${id}`, {
      method: "DELETE",
    });
  },
};
