import { Base } from "../Base";
import { DomicilioFull } from "../Domicilio/DomicilioFull";

export class SucursalFull extends Base {
    nombre: string = '';
    horarioApertura: string = '';
    horarioCierre: string = '';
    domicilioFull: DomicilioFull = new DomicilioFull();
}