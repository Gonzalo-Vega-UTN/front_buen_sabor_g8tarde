import { Base } from "../Base";
import { DomicilioFull } from "../Domicilio/DomicilioFull";
import { Empresa } from "../Empresa/Empresa";
import { Imagen } from "../Imagen";

export class Sucursal extends Base {
    nombre: string = '';
    horarioApertura: string = '';
    horarioCierre: string = '';
    empresa : Empresa= new Empresa();
    imagenes: Imagen[] = [];
    domicilio : DomicilioFull = new DomicilioFull();
}
