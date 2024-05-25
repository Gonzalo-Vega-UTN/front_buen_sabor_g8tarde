import { ArticuloManufacturado } from "../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";

const BASE_URL = "http://localhost:8080/api/articulos/manufacturados";

export const ProductServices = {
  getProducts: async (): Promise<ArticuloManufacturado[]> => {
    const response = await fetch(`${BASE_URL}`);
    const data = await response.json();

    return data;
  },

  getProductsFiltered: async (idCategoria?: number, idUnidadMedida?: number, denominacion?: string): Promise<ArticuloManufacturado[]> => {
    const params = new URLSearchParams();
    if (idCategoria !== undefined) params.append("categoria_id", idCategoria.toString());
    if (idUnidadMedida !== undefined) params.append("unidad_id", idUnidadMedida.toString());
    if (denominacion !== undefined) params.append("denominacion", denominacion);

    const response = await fetch(`${BASE_URL}/search?${params}`);
    const data = await response.json();
    return data;
  },

  getProduct: async (id: number): Promise<ArticuloManufacturado> => {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error("No se puede encontrar el Articulo " + id);
  }
    const data = await response.json();

    return data;
  },

  createProduct: async (product: ArticuloManufacturado): Promise<ArticuloManufacturado> => {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    const data = await response.json();

    return data;
  },

  updateProduct: async (id: number, product: ArticuloManufacturado): Promise<ArticuloManufacturado> => {
    console.log("update",product);
    
    const response = await fetch(`${BASE_URL}/${id}`, {
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
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
