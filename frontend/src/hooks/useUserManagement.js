import { useState, useEffect, useMemo } from 'react';
import { useNetProStore } from '../store/useNetProStore';

export function useUserManagement() {
  const userName = useNetProStore(s => s.userName);
  const users = useNetProStore(s => s.users);
  const roles = useNetProStore(s => s.roles);
  const isLoading = useNetProStore(s => s.isLoading);
  const error = useNetProStore(s => s.error);
  const fetchUsers = useNetProStore(s => s.loadUsers);
  const createUser = useNetProStore(s => s.createUser);
  const updateRole = useNetProStore(s => s.updateUserRole);
  const deleteUser = useNetProStore(s => s.deleteUser);
  const navigateTo = useNetProStore(s => s.navigateTo);
  const logout = useNetProStore(s => s.logout);

  const [userNameInput, setUserNameInput] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isCreationSuccessful, setCreationSuccessful] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilterValue, setRoleFilterValue] = useState('Todos');

  const [editingId, setEditingId] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (roles.length > 0 && !userRole) {
      setUserRole(String(roles[0].id_rol));
    }
  }, [roles, userRole]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchName = u.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilterValue === 'Todos' || u.nombre_rol === roleFilterValue;
      return matchName && matchRole;
    });
  }, [users, searchQuery, roleFilterValue]);

  async function handleCreateUser() {
    setValidationError('');
    setCreationSuccessful(false);
    if (!userNameInput.trim()) { setValidationError('El nombre de usuario es requerido.'); return; }
    if (!userPassword.trim())   { setValidationError('La contraseña es requerida.'); return; }
    if (!userRole)              { setValidationError('Selecciona un rol.'); return; }
    try {
      await createUser({ nombre: userNameInput.trim(), contrasena: userPassword, id_rol: Number(userRole) });
      setUserNameInput('');
      setUserPassword('');
      setCreationSuccessful(true);
      setTimeout(() => setCreationSuccessful(false), 3000);
    } catch (err) {
      setValidationError(err.message || 'Error al crear usuario.');
    }
  }

  function handleEditUser(u) {
    setEditingId(u.id_usuario);
    setEditingRole(u.id_rol);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditingRole(null);
  }

  async function handleUpdateUserRole(userId) {
    try {
      await updateRole(userId, editingRole);
      handleCancelEdit();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteUser() {
    if (!userToDelete) return;
    try { 
      await deleteUser(userToDelete.id_usuario);
    } finally { 
      setUserToDelete(null);
    }
  }

  return {
    state: {
      userName,
      users,
      roles,
      isLoading,
      error,
      userNameInput,
      userPassword,
      userRole,
      validationError,
      isCreationSuccessful,
      searchQuery,
      roleFilterValue,
      editingId,
      editingRole,
      userToDelete,
      filteredUsers
    },
    actions: {
      setUserNameInput,
      setUserPassword,
      setUserRole,
      setValidationError,
      setSearchQuery,
      setRoleFilterValue,
      setEditingRole,
      setUserToDelete,
      handleCreateUser,
      handleEditUser,
      handleCancelEdit,
      handleUpdateUserRole,
      handleDeleteUser,
      navigateTo,
      logout
    }
  };
}
