import { ArticuloInsumo } from "../entities/DTO/Articulo/Insumo/ArticuloInsumo";

const BASE_URL = "http://localhost:8080/api/articulos/insumos";

export const ArticuloInsumosServices = {
  getArticuloInsumo: async (): Promise<ArticuloInsumo[]> => {
    const response = await fetch(`${BASE_URL}`);
    const data = response.json();

    return data;
  },

  createArticuloInsumo: async (
    articuloInsumo: ArticuloInsumo
  ): Promise<ArticuloInsumo> => {
    
    
    
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articuloInsumo),
    });
    const data = await response.json();

    return data;
  },

  updateArticuloInsumo: async (
    id: number,
    articuloInsumo: ArticuloInsumo
  ): Promise<ArticuloInsumo> => {
    console.log("BBBBBBBB");

    console.log(articuloInsumo);
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articuloInsumo),
    });
    const data = await response.json();

    return data;
  },

  deleteArticuloInsumo: async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
