import { Rol } from "../../enums/Rol";

export default class Usuario{
    auth0Id:string='';
    username:string='';
    rol?:Rol;
}