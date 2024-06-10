import { Rol } from "../../enums/Rol";
import { Cliente } from "../Cliente/Cliente";

export default class Usuario{
    auth0Id:string='';
    username:string='';
    rol?:Rol;
    //cliente?:Cliente;
}