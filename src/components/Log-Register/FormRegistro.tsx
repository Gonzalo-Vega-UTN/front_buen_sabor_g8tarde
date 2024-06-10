import React, { useState } from 'react';
import { Rol } from '../../entities/enums/Rol';
import Usuario from '../../entities/DTO/Usuario/Usuario';
import { Cliente } from '../../entities/DTO/Cliente/Cliente';
import ClienteService from '../../services/ClienteService';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/Auth';
import UsuarioService from '../../services/UsuarioService';

const RegistroUsuarioCliente = () => {
  const [step, setStep] = useState(1);
  const [usuarioData, setUsuarioData] = useState<Usuario>(new Usuario());
  const [clienteData, setClienteData] = useState<Cliente>(new Cliente());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {login} = useAuth();
  const navigate = useNavigate();


  const handleChangeUsuario = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuarioData({ ...usuarioData, [name]: value });
  };

  const handleChangeCliente = (e:  React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClienteData({ ...clienteData, [name]: value });
  };

  const handleSubmitUsuario = async (e ) => {
    e.preventDefault();
    try{
        console.log("Guardo Usuario")
        const data =  await UsuarioService.validarExistenciaUsuario(usuarioData.username)
        console.log("Guardo Usuario+data",data)
         if (!data) {
            setError("")
         setTimeout(() =>{
            usuarioData.rol = Rol.Cliente
            setStep(2);
            },1500);
        }else{
            setError("Usuario ya ocupado")
        }
         
      }catch(error){
         if(error instanceof Error){
             setError(error.message)
         }
      }
  };

  const handleSubmitCliente = async (e) => {
    e.preventDefault();
    // Incluimos los datos del usuario en los datos del cliente
    const clienteCompleto = {
      ...clienteData,
      usuario: usuarioData,
    };
    // Aquí enviarías los datos del cliente al servidor para su registro
    // Finalizado el proceso de registro
    console.log(clienteCompleto);
     try{
       const cliente =  await ClienteService.agregarcliente(clienteCompleto)
        if (cliente) {
        setSuccess("Registro Exitoso");
        setTimeout(() =>{
            login(cliente.usuario.username, cliente.usuario.rol);  
        navigate("/");

        },1500);
        }
     }catch(error){
        if(error instanceof Error){
            setError(error.message)
        }
     }
  };

  return (
    <div>
      {step === 1 && (
        <form onSubmit={handleSubmitUsuario}>
          <h2>Registro de Usuario</h2>
          <div>
            <label>Auth0 ID:</label>
            <input type="text" name="auth0Id" value={usuarioData.auth0Id} onChange={handleChangeUsuario} />
          </div>
          <div>
            <label>Nombre de usuario:</label>
            <input type="text" name="username" value={usuarioData.username} onChange={handleChangeUsuario} />
          </div>
          <button type="submit">Siguiente</button>
          {error && <Alert variant="danger">{error}</Alert>}
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmitCliente}>
          <h2>Registro de Cliente</h2>
          <div>
            <label>Nombre:</label>
            <input type="text" name="nombre" value={clienteData.nombre} onChange={handleChangeCliente} />
          </div>
          <div>
            <label>Apellido:</label>
            <input type="text" name="apellido" value={clienteData.apellido} onChange={handleChangeCliente} />
          </div>
          <div>
            <label>Teléfono:</label>
            <input type="text" name="telefono" value={clienteData.telefono} onChange={handleChangeCliente} />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={clienteData.email} onChange={handleChangeCliente} />
          </div>
          <div>
            <label>Fecha de Nacimiento:</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={clienteData.fechaNacimiento}
              onChange={handleChangeCliente}
            />
          </div>
          <div>
            <label>Imagen:</label>
            <input type="file" name="imagen" accept="image/*" onChange={handleChangeCliente} />
          </div>
          <button type="submit">Registrar</button>
          
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
        </form>
      )}
    </div>
  );
};

export default RegistroUsuarioCliente;
