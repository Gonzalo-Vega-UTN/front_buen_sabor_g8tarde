import { Categoria } from "../entities/DTO/Categoria/Categoria";

const BASE_URL = "http://localhost:8080/api/categorias";

export const CategoriaService = {
  getCategorias: async (): Promise<Categoria[]> => {
    const response = await fetch(`${BASE_URL}`);
    const data = response.json();

    return data;
  },

  getCategoriaById: async (id : number): Promise<Categoria> => {
    const response = await fetch(`${BASE_URL}/${id}`);
    const data = response.json();

    return data;
  },

  createCategoria: async (
    categoria: Categoria
  ): Promise<Categoria> => {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });
    const data = await response.json();

    return data;
  },

  updateCategoria: async (
    id: number,
    categoria: Categoria
  ): Promise<Categoria> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });
    const data = await response.json();

    return data;
  },

  deleteCategoria: async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
