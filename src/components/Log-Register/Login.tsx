import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../Auth/Auth';
import Usuario from '../../entities/DTO/Usuario/Usuario';
import { UsuarioService } from '../../services/UsuarioService';

interface LoginProps {
    closeModal: () => void;
}

const Login: React.FC<LoginProps> = ({ closeModal }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState<string>('');
    const [auth0Id, setAuth0Id] = useState<string>('');
    const [mensaje, setMensaje] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("ingregs'swda")
        e.preventDefault();
        if (!username || !auth0Id) {
            setMensaje('Por favor, ingrese tanto el nombre de usuario como la contraseña.');
            return;
        }
        try {
            const usuario: Usuario = { username, auth0Id };
            console.log(usuario)
           // const data = await UsuarioService.login(usuario);
            const data = await UsuarioService.LoginFalso(true);
            console.log(data+"sadawda")
            if (data) {
                console.log(data)
                login(data.username,data.auth0Id); 
                setMensaje('Login exitoso');
                closeModal();
            }
        } catch (err) {
            setMensaje('Credenciales incorrectas, por favor vuelva a intentarlo.');
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
            </Form.Group>
            <Button variant="primary" type="submit">
                Login
            </Button>
            {mensaje && <Alert variant="danger">{mensaje}</Alert>}
        </Form>
    );
};

export default Login;
