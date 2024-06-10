import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../Auth/Auth';
import Usuario from '../../entities/DTO/Usuario/Usuario';
import UsuarioService from '../../services/UsuarioService';
import { Cliente } from '../../entities/DTO/Cliente/Cliente';


const LoginPage: React.FC<LoginProps> = () => {
    const { login } = useAuth();
    const [cliente, setCliente] = useState<Cliente>(new Cliente());
    const [mensaje, setMensaje] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cliente.usuario.username || !cliente.usuario.auth0Id) {
            setMensaje('Por favor, ingrese tanto el nombre de usuario como la contraseña.');
            return;
        }
        try {
            const usuario: Usuario = { username, auth0Id };
           const data = await UsuarioService.login(usuario);
           
            if (data) {
                
                console.log("exitoso");
                setMensaje('Login exitoso'); // Set the success message
                setTimeout(() =>{
                    closeModal();
                    login(data.username, data.rol);  
                },1500)
            }
        } catch (err) {
            if(err instanceof Error){
                setMensaje(err.message);
            }
            console.error(err);
        }
    };

    const handleCahnge = (e: React.ChangeEvent) =>{
        const value = e.target.value
        setCliente(prev =>(
            ...prev
        ))
    }

    function setUsername(value: string): void {
        throw new Error('Function not implemented.');
    }

    function setAuth0Id(value: string): void {
        throw new Error('Function not implemented.');
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Nombre de Usuario:</Form.Label>
                <Form.Control
                    type="text"
                    value={cliente.usuario.username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingrese su nombre de usuario"
                    required
                />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Clave:</Form.Label>
                <Form.Control
                    type="password"
                    value={auth0Id}
                    onChange={(e) => setAuth0Id(e.target.value)}
                    placeholder="Ingrese su clave"
                    required
                />
            <br></br>
            </Form.Group>
            <Button variant="primary" type="submit" >
                Login
            </Button>
            {mensaje && <Alert className='mt-2' variant="danger">{mensaje}</Alert>}
            {mensaje && <Alert  variant="success">{mensaje}</Alert>}
        </Form>
    );
};

export default LoginPage;
function closeModal() {
    throw new Error('Function not implemented.');
}

