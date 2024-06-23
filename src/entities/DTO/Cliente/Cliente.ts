import { Base } from "../Base";
import { DomicilioFull } from "../Domicilio/DomicilioFull";
import { Imagen } from "../Imagen";
import Usuario from "../Usuario/Usuario";
export class Cliente extends Base {
    nombre: string = '';
    apellido: string = '';
    telefono: string = '';
    email: string = '';
    fechaNacimiento: string | null = ''; 
    imagenes: Imagen[] = [];
    domicilios: DomicilioFull[] | null = null;
    usuario:Usuario=new Usuario();
}
