import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { Rol } from '../../entities/enums/Rol';
import Usuario from '../../entities/DTO/Usuario/Usuario';
import UsuarioService from '../../services/UsuarioService';

interface RegisterProps {
    closeModal: () => void;
}

const RegisterPage: React.FC<RegisterProps> = ({ closeModal }) => {
    const [username, setUsername] = useState<string>('');
    const [auth0Id, setAuth0Id] = useState<string>('');
    const [rol, setRol] = useState<Rol>(Rol.Cliente);
    const [mensaje, setMensaje] = useState<string>('');
    
    const [Registromensaje, setRegistromensaje] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submit button clicked"); // Verificar que se detecta el clic en el botón de submit

        // Validar la longitud de la contraseña
        if (auth0Id.length < 4) {
            setMensaje('La contraseña debe tener al menos 4 caracteres');
            return;
        }

        try {
            const usuario: Usuario = { username, auth0Id, rol };
            
            await UsuarioService.register(usuario);
            setRegistromensaje('Usuario registrado con éxito');
            setTimeout(() =>{
                navigate("/"); 
            },1500)
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
            </Form.Group>
            <Form.Group controlId="formBasicRole">
                <Form.Label>Rol:</Form.Label>
                <Form.Select value={rol} onChange={(e) => setRol(e.target.value as Rol)}>
                    <option value={Rol.Admin}>Admin</option>
                    <option value={Rol.Cliente}>Cliente</option>
                    <option value={Rol.Empleado}>Empleado</option>
                </Form.Select>
                <br></br>
            </Form.Group>
            <Button variant="primary" type="submit">
                Registrar
            </Button>
            {mensaje && <Alert variant="danger">{mensaje}</Alert>}
            {Registromensaje && <Alert variant="success">{Registromensaje}</Alert>}
        </Form>
    );
};

export default RegisterPage;