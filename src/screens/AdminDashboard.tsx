import React, { useState } from 'react';
import { AlertTriangle, Clock, Edit2, Check, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function AdminDashboard() {
  const navigate = useNavigate();
  const {
    modules,
    setModules,
    preferentialQueue,
    generalQueue,
    servedClients,
    systemLogs,
    inactiveModules,
    addLog,
    setCurrentUser
  } = useApp();

  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');

  const averageWaitTime = servedClients.length > 0
    ? (servedClients.reduce((acc, ticket) => acc + (ticket.waitTime || 0), 0) / servedClients.length).toFixed(1)
    : '0';

  const handleNameEdit = (moduleId: number) => {
    if (editingModuleId === moduleId) {
      setModules(prev => prev.map(mod => 
        mod.id === moduleId 
          ? { ...mod, pharmacist: newName }
          : mod
      ));
      addLog(`Nombre del TENS del Módulo ${moduleId + 1} actualizado a: ${newName}`);
      setEditingModuleId(null);
    } else {
      setNewName(modules[moduleId].pharmacist);
      setEditingModuleId(moduleId);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    addLog('Administrador cerró sesión');
    navigate('/login');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna Izquierda */}
          <div className="space-y-8">
            {/* Estado General */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Estado General</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-600 mb-2">Cola Preferente</h3>
                  <p className="text-3xl font-bold">{preferentialQueue.length}</p>
                  <p className="text-sm text-gray-600">en espera</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-600 mb-2">Cola General</h3>
                  <p className="text-3xl font-bold">{generalQueue.length}</p>
                  <p className="text-sm text-gray-600">en espera</p>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Estadísticas</h2>
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Total Atendidos</p>
                  <p className="text-3xl font-bold">{servedClients.length}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-600">Tiempo Promedio de Espera</p>
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 mr-2 text-indigo-600" />
                    <p className="text-3xl font-bold">{averageWaitTime} min</p>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Módulos Inactivos</p>
                  <p className="text-3xl font-bold text-red-600">
                    {(preferentialQueue.length > 0 || generalQueue.length > 0) ? inactiveModules.length : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-8">
            {/* Estado de Módulos */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Estado de Módulos</h2>
              <div className="grid grid-cols-2 gap-4">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className={`border rounded-lg p-4 ${
                      inactiveModules.includes(module.id) ? 'border-red-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Módulo {module.id + 1}</h3>
                      {inactiveModules.includes(module.id) && (
                        <AlertTriangle className="text-red-500 h-5 w-5" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {editingModuleId === module.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="text-sm text-gray-600 border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1"
                          />
                          <button
                            onClick={() => handleNameEdit(module.id)}
                            className="text-green-500 hover:text-green-600"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingModuleId(null)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600">{module.pharmacist}</p>
                          <button
                            onClick={() => handleNameEdit(module.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    {inactiveModules.includes(module.id) &&
                      (preferentialQueue.length > 0 || generalQueue.length > 0) && (
                        <p className="text-sm text-red-500 mb-2">
                          Inactivo por más de 15 minutos y hay personas en espera
                        </p>
                      )}
                    {module.currentTicket && (
                      <p className="text-sm">
                        Atendiendo {module.currentTicket.prefix}{module.currentTicket.number}
                        <span className="ml-2 text-xs">
                          ({module.currentTicket.isPreferential
                            ? 'Preferente'
                            : 'General'})
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Registros del Sistema */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Registros del Sistema</h2>
              <div className="h-[400px] overflow-y-auto">
                {systemLogs.map((log, index) => (
                  <p key={index} className="text-sm text-gray-600 mb-2">
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;