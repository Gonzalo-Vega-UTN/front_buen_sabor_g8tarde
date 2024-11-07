import React, { useState, useEffect } from "react";
import UsuarioService from "../../services/UsuarioService";

import { Rol } from "../../entities/enums/Rol";
import Usuario from "../../entities/DTO/Usuario/Usuario";
import { Empleado } from "../../entities/DTO/Empleado/Empleado";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { EmpleadoService } from "../../services/EmpleadoService";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0Extended();
  const [showModal, setShowModal] = useState(false);
  const [newEmpleado, setNewEmpleado] = useState<Empleado>(new Empleado());
  const [selectedRole, setSelectedRole] = useState<Rol>(Rol.Cliente);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await getAccessTokenSilently();
      const fetchedUsers = await UsuarioService.getAllUsuarios(token);
      setUsers(fetchedUsers);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error al cargar usuarios");
    }
  };

  const handleRoleChange = async (userId: number, newRole: Rol) => {
    try {
      const token = await getAccessTokenSilently();
      await UsuarioService.updateUsuarioRol(userId, newRole, token);
      await fetchUsers();
      setError(null);
    } catch (error) {
      console.error("Error updating user role:", error);
      setError("Error al actualizar el rol del usuario");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEmpleado(new Empleado());
    setSelectedRole(Rol.Cliente);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmpleado(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = await getAccessTokenSilently();

      // Crear el usuario base
      const usuario = new Usuario();
      usuario.auth0Id = newEmpleado.email;
      usuario.email = newEmpleado.email;
      usuario.username = `${newEmpleado.nombre}.${newEmpleado.apellido}`.toLowerCase();

      usuario.rol = selectedRole;

      // Registrar el usuario primero
      const registeredUser = await UsuarioService.register(usuario, token);

      // Asignar el usuario registrado al empleado
      newEmpleado.usuario = registeredUser;

      // Crear el empleado
      await EmpleadoService.create(newEmpleado);
      
      // Actualizar la lista de usuarios
      await fetchUsers();
      
      handleCloseModal();
      setError(null);
    } catch (error: any) {
      console.error("Error creating employee:", error);
      setError(error.message || "Error al crear el empleado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Usuarios</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          Agregar Empleado
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="table-responsive">
        <Table hover variant="dark">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td>
                  <select
                    value={user.rol}
                    onChange={(e) => handleRoleChange(user.id!, e.target.value as Rol)}
                    className="form-select form-select-sm"
                  >
                    {Object.values(Rol).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal para agregar empleado */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={newEmpleado.nombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={newEmpleado.apellido}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newEmpleado.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="telefono"
                value={newEmpleado.telefono}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={newEmpleado.fechaNacimiento || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Rol)}
                required
              >
                {Object.values(Rol).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal} disabled={isLoading}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserList;