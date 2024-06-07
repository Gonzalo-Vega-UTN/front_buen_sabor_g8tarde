import { Base } from "../Base";
import { DomicilioFull } from "../Domicilio/DomicilioFull";
import Usuario from "../Usuario/Usuario";
export class ClienteFull extends Base {
    nombre: string = '';
    apellido: string = '';
    telefono: string = '';
    email: string = '';
    fechaNacimiento: string | null = ''; // Considera cómo deseas representar LocalDate en TypeScript
    imagen: string = '';
    domicilios: DomicilioFull[] | null = null;
    usuario:Usuario=new Usuario();
}
