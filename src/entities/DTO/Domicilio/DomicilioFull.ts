import { Base } from "../Base";

export class DomicilioFull extends Base {
    calle: string = '';
    numero: number = 0;
    cp: number  = 0;
    localidad: string = '';
    provincia: string = '';
    pais: string = '';
}