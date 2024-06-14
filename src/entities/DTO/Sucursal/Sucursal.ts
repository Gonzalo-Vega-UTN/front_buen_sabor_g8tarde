import { Base } from "../Base";
import { Empresa } from "../Empresa/Empresa";

export class Sucursal extends Base {
    nombre: string = '';
    horarioApertura: string = '';
    horarioCierre: string = '';
    empresa : Empresa= new Empresa();
    
}
