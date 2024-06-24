// src/services/DomicilioService.ts
import { DomicilioFull } from "../entities/DTO/Domicilio/DomicilioFull";

const API_URL = "/api/domicilios"; // Asegúrate de que la URL sea correcta

class DomicilioService {
    async saveDomicilio(domicilio: DomicilioFull) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(domicilio),
        });

        if (!response.ok) {
            throw new Error(`Error saving domicilio: ${response.statusText}`);
        }

        return await response.json();
    }

    async getAllDomicilios() {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching domicilios: ${response.statusText}`);
        }

        return await response.json();
    }

    async getDomicilioById(id: number) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching domicilio: ${response.statusText}`);
        }

        return await response.json();
    }

    async updateDomicilio(id: number, domicilio: DomicilioFull) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(domicilio),
        });

        if (!response.ok) {
            throw new Error(`Error updating domicilio: ${response.statusText}`);
        }

        return await response.json();
    }

    async deleteDomicilio(id: number) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error deleting domicilio: ${response.statusText}`);
        }

        return await response.json();
    }
}

export default new DomicilioService();
