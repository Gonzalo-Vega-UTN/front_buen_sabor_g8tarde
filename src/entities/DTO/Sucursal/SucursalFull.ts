import { Base } from "../Base";

export class SucursalFull extends Base {
    nombre: string = '';
    horarioApertura: string = '';
    horarioCierre: string = '';
    idEmpresa: number = 0;

    constructor(idEmpresa?: number) {
        super();
        if (idEmpresa !== undefined) {
            this.idEmpresa = idEmpresa;
        }
    }
}
