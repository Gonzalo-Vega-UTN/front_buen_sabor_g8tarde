import React, { useState, useEffect } from 'react';

import UsuarioService from '../services/UsuarioService';
import { Rol } from '../entities/enums/Rol';
import Usuario from '../entities/DTO/Usuario/Usuario';
import { useAuth0Extended } from '../Auth/Auth0ProviderWithNavigate';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const { getAccessTokenSilently } = useAuth0Extended();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await getAccessTokenSilently();
      const fetchedUsers = await UsuarioService.getAllUsuarios(token);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRoleChange = async (userId: number, newRole: Rol) => {
    try {
      const token = await getAccessTokenSilently();
      await UsuarioService.updateUsuarioRol(userId, newRole, token);
      fetchUsers(); // Refetch users to update the list
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <table>
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
      </table>
    </div>
  );
};

export default UserList;