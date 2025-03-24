import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, validate, clean } from 'rut.js';
import { Building2, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';

function ModuleLogin() {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { moduleUsers, setCurrentUser, addLog } = useApp();

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedRut = format(e.target.value);
    setRut(formattedRut);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate(rut)) {
      setError('RUT inválido');
      return;
    }

    const cleanedRut = clean(rut);
    const user = moduleUsers.find(u => clean(u.rut) === cleanedRut && u.password === password);

    if (user) {
      setCurrentUser(user);
      addLog(`${user.name} ha iniciado sesión en el ${user.role === 'admin' ? 'panel de administración' : `Módulo ${user.moduleId + 1}`}`);
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(`/modulo/${user.moduleId + 1}`);
      }
    } else {
      setError('RUT o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-8">
          <Building2 className="h-12 w-12 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          CESFAM Dr. Aníbal Ariztía
        </h1>
        <p className="text-center text-gray-600 mb-8">Acceso a Módulos</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1">
              RUT
            </label>
            <input
              type="text"
              id="rut"
              value={rut}
              onChange={handleRutChange}
              placeholder="12.345.678-9"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            <span>Ingresar</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModuleLogin;