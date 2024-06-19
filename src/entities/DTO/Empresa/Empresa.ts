import { Base } from "../Base";
import { Sucursal } from "../Sucursal/Sucursal";
import { EmpresaImagen } from "./EmpresaImagen";

export class Empresa extends Base {
    nombre: string = '';
    razonSocial: string = '';
    cuil: string = '' ;
    imagenUrl: string = '';
    alta: boolean = true; // Nueva propiedad para indicar si la empresa está activa o de baja
    sucursal: Sucursal[] = [];
}
