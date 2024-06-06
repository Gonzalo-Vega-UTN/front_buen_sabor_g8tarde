
import Categoria from "../entidades/categoria";
import Instrumentos from "../entidades/instrumentos"
import Pedido from "../entidades/Pedido";
import PreferenceMP from "../entidades/PreferenceMP";
import { Usuario } from "../entidades/Usuario";

//------------------Instrumento------------------\\
export async function cargarMenu() {
    const urlServer = 'http://localhost:8080/api/instrumentos/carrusel';
    const response = await fetch(urlServer, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
    });
    console.log(response);
    return await response.json();
}

export async function getInstrumentosFetch() {
    const urlServer = 'http://localhost:8080/api/instrumentos';
    const response = await fetch(urlServer, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
    });
    console.log(response);
    return await response.json();
}

export async function getInstrumentoXIdFecth(id: number) {
    const urlServer = `http://localhost:8080/api/instrumentos/${id}`;
    console.log(urlServer);
    const response = await fetch(urlServer, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
    });
    console.log(response);
    return await response.json();
}

export async function editarInstrumento(instrumento: Instrumentos): Promise<boolean> {
    console.log(instrumento)
    const urlServer = `http://localhost:8080/api/instrumentos/${instrumento.id}`;
    const response = await fetch(urlServer, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(instrumento),
        mode: 'cors'
    });
    console.log(response);
    return response.ok;
}

export async function eliminarInstrumento(id: number): Promise<boolean> {
    const urlServer = `http://localhost:8080/api/instrumentos/${id}`;
    const response = await fetch(urlServer, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
    });
    console.log(response);
    return response.ok;
}

export async function agregarInstrumento(instrumento: Instrumentos): Promise<boolean> {
    const urlServer = `http://localhost:8080/api/instrumentos`;
    console.log(JSON.stringify(instrumento));
    const response = await fetch(urlServer, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(instrumento),
        mode: 'cors'
    });
    console.log(response);
    return response.ok;
}

// Nuevo endpoint para listar todos los instrumentos, incluyendo los dados de baja
export async function getAllInstrumentosFetch() {
    const urlServer = 'http://localhost:8080/api/instrumentos/todos';
    const response = await fetch(urlServer, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
    });
    console.log(response);
    return await response.json();
}

//------------------Categoria------------------\\
export async function getCategoriaFetch(): Promise<Categoria[]> {
    const url = 'http://localhost:8080/categoria';
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener las categorías');
      }
      const categorias: Categoria[] = await response.json();
      return categorias;
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      throw error; // Propaga el error para que lo maneje el código que llama a esta función
    }
  }
  

export async function getCategoriaXIdFecth(id: number) {
    const urlServer = `http://localhost:8080/api/categoria/${id}`;
    console.log(urlServer);
    const response = await fetch(urlServer, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
    });
    console.log(response);
    return await response.json();
}

//---------------Pedido------------------\\
export async function agregarPedido(pedido: Pedido): Promise<number> {
    const urlServer = `http://localhost:8080/api/pedidos/guardar`;
    console.log(JSON.stringify(pedido));
    const response = await fetch(urlServer, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(pedido),
        mode: 'cors'
    });
    const responseData = await response.json();
    console.log(responseData);
    if (response.ok) {
        return responseData; // Devuelve el ID del pedido si la respuesta es exitosa
    } else {
        throw new Error('Error al agregar el pedido');
    }
}


export async function traerPedido(id: number) {
    const urlServer = `http://localhost:8080/api/pedidos/traer/${id}`;
    const response = await fetch(urlServer, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        mode: "cors",
    });
    return (await response.json()) as Pedido;
}

//---------------MP------------------\\
export async function createPreferenceMP(pedido?: Pedido) {
    let urlServer = "http://localhost:8080/MercadoPago/crear_preference_mp";
    let method: string = "POST";
    const response = await fetch(urlServer, {
        method: method,
        body: JSON.stringify(pedido),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return (await response.json()) as PreferenceMP;
}

//---------------Auth------------------\\
export async function loginUser(usuario: Usuario) {
    const urlServer = "http://localhost:8080/api/auth/login";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    };
    try {
        const response = await fetch(urlServer, options);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Error al iniciar sesión');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error al comunicarse con el servidor');
    }
}

export async function registerUser(usuario: Usuario) {
    const urlServer = "http://localhost:8080/api/auth/register";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(usuario),
        mode: "cors" as RequestMode
    };
    try {
        const response = await fetch(urlServer, options);
        if (!response.ok) {
            throw new Error('Error al registrar el usuario');
        }
        return await response.text();
    } catch (error) {
        handleFetchError(error);
    }
}

export async function checkExistingUser(name: string) {
    const urlServer = `http://localhost:8080/api/auth/validar?nombreUsuario=${name}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        mode: "cors" as RequestMode
    };
    try {
        const response = await fetch(urlServer, options);
        if (response.ok) {
            const existeUsuario = await response.json();
            return existeUsuario;
        } else {
            throw new Error('Error al verificar la existencia del usuario');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error al comunicarse con el servidor');
    }
}

//---------------Error------------------\\

function handleFetchError(error: unknown) {
    if (error instanceof Error) {
        throw new Error('Error al comunicarse con el servidor: ' + error.message);
    } else {
        throw new Error('Error al comunicarse con el servidor');
    }
}

//---------------Estadisticas------------------\\

export async function getDatosChartLineFetch(){
	const urlServer = 'http://localhost:8080/api/pedidos/GraficoBarra';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	console.log(response);
	return await response.json();
}

export async function getDatosChartPieFetch(){
    const urlServer = 'http://localhost:8080/api/pedidos/GraficoTorta';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	console.log(response);
	return await response.json();
}
export async function generateExcelReport(fechaDesde: string, fechaHasta: string) {
    const urlServer = 'http://localhost:8080/api/report/excel';
    const response = await fetch(urlServer, {
      method: 'POST',
      body: JSON.stringify({ fechaDesde, fechaHasta }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Error al generar el reporte Excel');
    }
  
    // Si la respuesta es exitosa, devuelve los datos del archivo Excel
    return response.blob();
  }
  
  export async function generatePdfReport(instrumentoId: string) {
    const urlServer = `http://localhost:8080/api/report/pdf/${instrumentoId}`;
    const response = await fetch(urlServer, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  
    if (!response.ok) {
      throw new Error('Error al generar el reporte PDF');
    }
  
    // Si la respuesta es exitosa, devuelve los datos del archivo PDF
    return response.blob();
}

