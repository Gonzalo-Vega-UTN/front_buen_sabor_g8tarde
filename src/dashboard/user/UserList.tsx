import React, { useState, useEffect } from "react";
import UsuarioService from "../../services/UsuarioService";
import { Rol } from "../../entities/enums/Rol";
import Usuario from "../../entities/DTO/Usuario/Usuario";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import Table from "react-bootstrap/esm/Table";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0Extended();

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

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="col-md-10">
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
    </div>
  );
};

export default UserList;