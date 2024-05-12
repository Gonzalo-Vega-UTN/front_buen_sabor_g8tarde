import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { ICliente } from '../../types/ICliente'
import { ClienteService } from '../../services/ClienteService'
import { useNavigate } from 'react-router-dom'

export const Grilla = () => {
    const baseURL = "http://localhost:8080/api"
    const clienteService = new ClienteService(baseURL + "/clientes")

    const [clientes, setClientes] = useState<ICliente[]>([])
    const getClientes = async () => {
        const clientes = await clienteService.getAll();
        setClientes(clientes);
    }

    useEffect(() => {
        getClientes();
    }, []);


    const navigate = useNavigate();

    const handleClickModificar = (id: number) => {
        navigate(`/form-cliente/${id}`)
    }
    const handleClickEliminar = /*async*/ (id: number) => {
       // await clienteService.delete(id)
        setClientes(clientes.filter(cliente => cliente.id !== id))
    }
    return (
        <>
            <h1 className="display-2">Gestion Instrumentos</h1>
            <table className="table table-striped table-dark">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellido</th>
                        <th scope="col">Telefono</th>
                        <th scope="col">Modificar</th>
                        <th scope="col">Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map( (cliente, index) => (
                        <tr key={index}>
                            <th scope="row">{cliente.id}</th>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.apellido}</td>
                            <td>{cliente.telefono}</td>
                            <td><Button onClick={() => handleClickModificar(cliente.id)}>Modificar</Button></td>
                            <td>
                                <Button
                                    className="btn-danger"
                                    onClick={() => handleClickEliminar(cliente.id)}
                                >
                                    Eliminar
                                </Button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>

    )
}
