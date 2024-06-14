

import { Base } from "../Base";
import { Sucursal } from "../Sucursal/Sucursal";

export class Empresa extends Base {
    nombre: string = '';
    razonSocial: string = '';
    cuil: string = '' ;
    sucursal: Sucursal[] = [];
}

