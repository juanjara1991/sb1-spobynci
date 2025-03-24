import React, { useState } from 'react';
import { format, validate } from 'rut.js';
import { UserPlus, Save, X, Trash2, Edit2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ModuleUser } from '../types';

function UserManagement() {
  const navigate = useNavigate();
  const { moduleUsers, setModuleUsers, modules, addLog } = useApp();
  const [newUser, setNewUser] = useState<Partial<ModuleUser>>({
    role: 'module'
  });
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ModuleUser | null>(null);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedRut = format(e.target.value);
    setNewUser(prev => ({ ...prev, rut: formattedRut }));
  };

  const resetForm = () => {
    setNewUser({ role: 'module' });
    setEditingUser(null);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newUser.rut || !validate(newUser.rut)) {
      setError('RUT inválido');
      return;
    }

    if (!newUser.password || newUser.password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    if (!newUser.name || newUser.name.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    const userToAdd = {
      rut: newUser.rut,
      password: newUser.password,
      name: newUser.name,
      moduleId: newUser.role === 'admin' ? -1 : (newUser.moduleId || 0),
      role: newUser.role as 'admin' | 'module'
    };

    if (editingUser) {
      if (editingUser !== userToAdd.rut && 
          moduleUsers.some(user => user.rut === userToAdd.rut)) {
        setError('Ya existe un usuario con este RUT');
        return;
      }
      
      setModuleUsers(prev => prev.map(user => 
        user.rut === editingUser ? userToAdd : user
      ));
      addLog(`Usuario ${userToAdd.name} actualizado${editingUser !== userToAdd.rut ? ` (RUT cambiado de ${editingUser} a ${userToAdd.rut})` : ''}`);
    } else {
      if (moduleUsers.some(user => user.rut === userToAdd.rut)) {
        setError('Ya existe un usuario con este RUT');
        return;
      }
      setModuleUsers(prev => [...prev, userToAdd]);
      addLog(`Nuevo usuario ${userToAdd.name} (${userToAdd.role}) creado`);
    }
    
    resetForm();
  };

  const handleEdit = (user: ModuleUser) => {
    setNewUser(user);
    setEditingUser(user.rut);
    setError('');
  };

  const confirmDelete = (user: ModuleUser) => {
    setUserToDelete(user);
    setShowConfirm(true);
  };

  const handleDelete = () => {
    if (!userToDelete) return;

    setModuleUsers(prev => prev.filter(u => u.rut !== userToDelete.rut));
    addLog(`Usuario ${userToDelete.name} eliminado`);
    
    if (editingUser === userToDelete.rut) {
      resetForm();
    }
    
    setShowConfirm(false);
    setUserToDelete(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver al Panel</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">
            {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RUT
                </label>
                <input
                  type="text"
                  value={newUser.rut || ''}
                  onChange={handleRutChange}
                  placeholder="12.345.678-9"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={newUser.password || ''}
                  onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={newUser.name || ''}
                  onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Usuario
                </label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value as 'admin' | 'module' }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="module">Módulo</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {newUser.role === 'module' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Módulo Asignado
                  </label>
                  <select
                    value={newUser.moduleId || 0}
                    onChange={e => setNewUser(prev => ({ ...prev, moduleId: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {modules.slice(0, 6).map(module => (
                      <option key={module.id} value={module.id}>
                        Módulo {module.id + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
              >
                <X className="h-5 w-5" />
                <span>{editingUser ? 'Cancelar' : 'Limpiar'}</span>
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                {editingUser ? (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Guardar Cambios</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Crear Usuario</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Usuarios Existentes</h2>
            <div className="grid grid-cols-1 gap-4">
              {moduleUsers.map(user => (
                <div
                  key={user.rut}
                  className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.rut}</p>
                    <p className="text-sm text-gray-600">
                      {user.role === 'admin' ? 'Administrador' : `Módulo ${user.moduleId + 1}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Editar usuario"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(user)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 animate-fade-in">
            <h3 className="text-lg font-semibold mb-2">Confirmar Eliminación</h3>
            <p className="text-gray-600 mb-4">
              ¿Está seguro que desea eliminar al usuario {userToDelete.name}?
              {userToDelete.role === 'module' && (
                <span className="block mt-2 text-sm">
                  Este usuario ya no podrá acceder al Módulo {userToDelete.moduleId + 1}.
                </span>
              )}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;