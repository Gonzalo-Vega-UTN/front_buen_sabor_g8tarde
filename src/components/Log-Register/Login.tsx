import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../Auth/Auth';
import Usuario from '../../entities/DTO/Usuario/Usuario';
import UsuarioService from '../../services/UsuarioService';

interface LoginProps {
    closeModal: () => void;
}

const Login: React.FC<LoginProps> = ({ closeModal }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState<string>('');
    const [auth0Id, setAuth0Id] = useState<string>('');
    const [mensaje, setMensaje] = useState<string>('');
    const [logMensaje, setlogMensaje] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("CLICKED")
        if (!username || !auth0Id) {
            setMensaje('Por favor, ingrese tanto el nombre de usuario como la contraseña.');
            return;
        }
        try {
            const usuario: Usuario = { username, auth0Id };
           const data = await UsuarioService.login(usuario);
           
            if (data) {
                
                console.log("exitoso");
                setlogMensaje('Login exitoso'); // Set the success message
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

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Nombre de Usuario:</Form.Label>
                <Form.Control
                    type="text"
                    value={username}
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
            {logMensaje && <Alert className='mt-2' variant="success">{logMensaje}</Alert>}
        </Form>
    );
};

export default Login;
