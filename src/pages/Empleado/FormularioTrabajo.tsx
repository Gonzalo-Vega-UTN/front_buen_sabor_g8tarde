import React, { useState } from 'react'
import Usuario from '../../entities/DTO/Usuario/Usuario';
import { Empleado } from '../../entities/DTO/Empleado/Empleado';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import FormularioDomicilio from '../Domicilio/FormDomicilio';
import ImagenCarousel from '../../components/carousel/ImagenCarousel';
import { Domicilio } from '../../entities/DTO/Domicilio/Domicilio';
import { Imagen } from '../../entities/DTO/Imagen';
import { useAuth } from '../../Auth/Auth';
import { Rol } from '../../entities/enums/Rol';
import { EmpleadoService } from '../../services/EmpleadoService';

const FormularioTrabajo = () => {

    const [step, setStep] = useState(1);
    const [usuarioData, setUsuarioData] = useState<Usuario>(new Usuario());
    const [empleadoData, setEmpleadoData] = useState<Empleado>(new Empleado());
    const [domicilioData, setDomicilioData] = useState<Domicilio>(new Domicilio());
    const [selectedRole, setSelectedRole] = React.useState<Rol>(Rol.Empleado); // Initial selected role
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const handleChangeUsuario = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUsuarioData({ ...usuarioData, [name]: value });
    };

    const handleChangeRol = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(event.target.value as Rol);
    };

    const handleSubmitUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (usuarioData.auth0Id.length < 4) {
            setError("La contraseña debe tener al menos 4 caracteres.");
            return;
        }
        setStep(2)
    };

    const handleSubmitDomicilio = async (domicilio: Domicilio) => {
        setDomicilioData(domicilio);
        const empleadoCompleto = {
            ...empleadoData,
            alta: false,
            usuario: usuarioData,
            domicilios: [domicilio],
        }
         const response = await EmpleadoService.create(empleadoCompleto)
         if(response){
            console.log("EXITO", response)
         }
    
    };

    const handleSubmitEmpleado = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 1500);
    };


    const handleChangeEmpleado = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const year = new Date(value).getFullYear();
        const currentYear = new Date().getFullYear();

        if (name === "fechaNacimiento" && (year < 1930 || year > currentYear)) {
            setError(`El año debe estar entre 1930 y ${currentYear}`);
        } else {
            setError("");
            setEmpleadoData({ ...empleadoData, [name]: value });
        }
    };


    const handleBack = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handleImagenesChange = (newImages: Imagen[]) => {
        setEmpleadoData((prev) => ({
            ...prev,
            imagenes: newImages,
        }));
    };

    const handleFileChange = (newFiles: File[]) => {
        setFiles(newFiles);
    };

    return (
        <>
            <h1>Formulario Trabajo</h1>
            {step === 1 && (
                <Form onSubmit={handleSubmitUsuario}>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            value={usuarioData.email}
                            onChange={handleChangeUsuario}
                            placeholder="Ingrese su email"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formUsername">
                        <Form.Label>Nombre de usuario</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={usuarioData.username}
                            onChange={handleChangeUsuario}
                            placeholder="Ingrese su nombre de usuario"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type={passwordVisible ? "text" : "password"}
                            name="auth0Id"
                            value={usuarioData.auth0Id}
                            onChange={handleChangeUsuario}
                            placeholder="Ingrese su contraseña"
                            required
                        />
                        <Form.Text className="text-muted">
                            La contraseña debe tener al menos 4 caracteres.
                        </Form.Text>
                        <Button
                            variant="outline-secondary"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? "Ocultar" : "Mostrar"}
                        </Button>
                    </Form.Group>
                    
                    <div className="d-flex justify-content-between mt-3">
                       
                        {loading ? (
                            <Button variant="primary" type="submit">
                                Siguiente <Spinner size="sm" />
                            </Button>
                        ) : (
                            <Button variant="primary" type="submit">
                                Siguiente
                            </Button>
                        )}
                    </div>
                    {error && (
                        <Alert variant="danger" className="mt-3">
                            {error}
                        </Alert>
                    )}
                </Form>
            )}

            {step == 2 && (
                <Form onSubmit={handleSubmitEmpleado}>
                    <Form.Group controlId="formNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={empleadoData.nombre}
                            onChange={handleChangeEmpleado}
                            placeholder="Ingrese su nombre"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formApellido">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control
                            type="text"
                            name="apellido"
                            value={empleadoData.apellido}
                            onChange={handleChangeEmpleado}
                            placeholder="Ingrese su apellido"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formTelefono">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            name="telefono"
                            value={empleadoData.telefono}
                            onChange={handleChangeEmpleado}
                            placeholder="Ingrese su teléfono"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formFechaNacimiento">
                        <Form.Label>Fecha de Nacimiento</Form.Label>
                        <Form.Control
                            type="date"
                            name="fechaNacimiento"
                            value={empleadoData.fechaNacimiento}
                            onChange={handleChangeEmpleado}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="roleSelect">
                        <Form.Label>Seleccionar Rol:</Form.Label>
                        <Form.Select value={selectedRole} onChange={handleChangeRol}>
                            {Object.keys(Rol).map((key) => (
                                <option key={key} value={Rol[key]}>
                                    {Rol[key]}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <ImagenCarousel
                        imagenesExistentes={empleadoData.imagenes}
                        onFilesChange={handleFileChange}
                        onImagenesChange={handleImagenesChange}
                    />
                    <div className="d-flex justify-content-between mt-3">
                        <Button variant="secondary" onClick={() => setStep(1)}>
                            Volver
                        </Button>
                        {loading ? (
                            <Button variant="primary" type="submit">
                                Siguiente <Spinner size="sm" />
                            </Button>
                        ) : (
                            <Button variant="primary" type="submit">
                                Siguiente
                            </Button>
                        )}
                    </div>
                    {success && (
                        <Alert variant="success" className="mt-3">
                            {success}
                        </Alert>
                    )}
                    {error && (
                        <Alert variant="danger" className="mt-3">
                            {error}
                        </Alert>
                    )}
                </Form>
            )}

            {step === 3 && (
                <FormularioDomicilio
                    onBack={handleBack}
                    onSubmit={handleSubmitDomicilio}
                />
            )}
        </>
    )
}


export default FormularioTrabajo