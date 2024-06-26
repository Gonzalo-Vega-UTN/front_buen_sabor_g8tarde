import React, { FormEvent } from 'react';
import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';
import { EmpleadoService } from '../services/EmpleadoService';
import { useNavigate } from 'react-router-dom';

const AcercaDe: React.FC = () => {

    const navigate = useNavigate();
    const handleSubmit = async (e : FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
       const response =  await EmpleadoService.formTrabajo("email@gmail.com")
       if(response){
        navigate(response.urlRedirect);
       }
    }



    return (
        <Container className="my-5">
            <Row className="text-center mb-4">
                <Col>
                    <h1>Acerca de Nosotros</h1>
                    <p>Conoce más sobre nuestra empresa de delivery de comida y nuestra misión.</p>
                </Col>
            </Row>
            <Row className="align-items-center mb-5">
                <Col md={6}>
                    <Image src="https://uschamber-co.imgix.net/https%3A%2F%2Fs3.us-east-1.amazonaws.com%2Fco-assets%2Fassets%2Fimages%2Femployee-owned-company.jpg?auto=compress%2Cformat&crop=focalpoint&fit=crop&fp-x=0.9183&fp-y=0.4406&h=415&q=88&w=622&s=a2c4208569c9b23a18e84955163f4478" rounded fluid />
                </Col>
                <Col md={6}>
                    <h2>Nuestra Misión</h2>
                    <p>
                        En Buen Sabor, estamos comprometidos a proporcionar servicios de delivery de comida
                        de la más alta calidad. Nuestro objetivo es hacer que tus comidas favoritas lleguen a tu puerta
                        de manera rápida y segura, mejorando tu experiencia culinaria en cada pedido.
                    </p>
                    <p>
                        Nos esforzamos por trabajar con los mejores restaurantes de la ciudad, asegurándonos de que
                        nuestros clientes tengan acceso a una variedad de opciones gastronómicas, desde comida rápida
                        hasta alta cocina. ¡Tu satisfacción es nuestra prioridad!
                    </p>
                </Col>
            </Row>
            <Row className="text-center mt-5">
                <Col>
                    <h2>Únete a Nuestro Equipo</h2>
                    <p>¿Interesado en trabajar con nosotros? Ingresa tus motivos a continuación y te contactaremos.</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Estas interesado? Escribi tu razon</Form.Label>
                            <Form.Control type="text" placeholder="Quiero trabajar en el buen sabor porque...." />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Enviar
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AcercaDe;
