import { StateType } from "./StateType";
import { RubroType } from "./RubroType";

export interface Rubro {
  id: number;
  denominacion: string;
  estadoRubro: StateType;
  tipoRubro: RubroType;
}
