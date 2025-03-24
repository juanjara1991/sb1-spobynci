import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Volume2, Key, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

function ModuleView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const moduleId = parseInt(id || '1') - 1;
  
  const {
    modules,
    setModules,
    preferentialQueue,
    setPreferentialQueue,
    generalQueue,
    setGeneralQueue,
    servedClients,
    setServedClients,
    addLog,
    setCurrentUser,
    currentUser,
    moduleUsers,
    setModuleUsers
  } = useApp();

  const [selectedModule, setSelectedModule] = useState(moduleId);
  const module = modules[selectedModule];
  const lastServedTickets = servedClients
    .filter(ticket => ticket.module === selectedModule)
    .slice(-5)
    .reverse();

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Calculate waiting times for display
  const getWaitingTime = (ticket: { arrivalTime: Date }) => {
    const now = new Date();
    return Math.floor((now.getTime() - ticket.arrivalTime.getTime()) / 60000);
  };

  const handlePasswordChange = () => {
    setPasswordError('');

    if (!currentUser) {
      setPasswordError('Usuario no encontrado');
      return;
    }

    if (currentPassword !== currentUser.password) {
      setPasswordError('Contraseña actual incorrecta');
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError('La nueva contraseña debe tener al menos 4 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    setModuleUsers(prev => prev.map(user => 
      user.rut === currentUser.rut 
        ? { ...user, password: newPassword }
        : user
    ));

    setCurrentUser(prev => prev ? { ...prev, password: newPassword } : null);
    addLog(`Usuario ${currentUser.name} cambió su contraseña`);
    setShowPasswordChange(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const speakNumber = (ticket: { prefix: string; number: number; isPreferential: boolean }) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    
    const voices = synth.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    const ticketType = ticket.isPreferential ? 'preferente' : 'general';
    const message = `Número ${ticketType} ${ticket.prefix} ${ticket.number}, por favor acercarse al módulo ${selectedModule + 1}`;
    utterance.text = message;
    
    synth.speak(utterance);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    addLog(`Usuario del Módulo ${selectedModule + 1} cerró sesión`);
    navigate('/login');
  };

  const handleModuleChange = (newModuleId: number) => {
    setSelectedModule(newModuleId);
    navigate(`/modulo/${newModuleId + 1}`);
  };

  const shouldCallPreferential = () => {
    // Always call preferential if there are any in queue
    if (preferentialQueue.length > 0) return true;

    // If no preferential tickets, proceed with general queue
    return false;
  };

  const callNextClient = () => {
    if (module.currentTicket) {
      addLog(`El Módulo ${selectedModule + 1} está ocupado`);
      return;
    }

    // Determine which queue to serve based on priority rules
    const callPreferential = shouldCallPreferential();
    const nextTicket = callPreferential ? preferentialQueue[0] : generalQueue[0];

    if (!nextTicket) {
      addLog('No hay clientes en espera');
      return;
    }

    const queue = callPreferential ? preferentialQueue : generalQueue;
    const setQueue = callPreferential ? setPreferentialQueue : setGeneralQueue;
    const waitTime = getWaitingTime(nextTicket);

    const updatedTicket = {
      ...nextTicket,
      attendanceTime: new Date(),
      module: selectedModule,
      waitTime,
      attendanceEstimate: Math.floor(Math.random() * 8) + 2,
      pharmacist: module.pharmacist
    };

    setQueue(prev => prev.slice(1));
    setModules(prev => prev.map(mod => 
      mod.id === selectedModule 
        ? { ...mod, currentTicket: updatedTicket, lastActivityTime: new Date() }
        : mod
    ));

    const queueType = callPreferential ? 'PREFERENTE' : 'GENERAL';
    addLog(`Llamando ticket ${queueType} ${updatedTicket.prefix}${updatedTicket.number} al módulo ${selectedModule + 1} (Tiempo de espera: ${waitTime} minutos)`);
    speakNumber(updatedTicket);
  };

  const finishService = () => {
    if (!module.currentTicket) {
      addLog(`El Módulo ${selectedModule + 1} ya está libre`);
      return;
    }

    const finishedTicket = {
      ...module.currentTicket,
      endTime: new Date(),
      totalTime: (new Date().getTime() - module.currentTicket.arrivalTime.getTime()) / 60000
    };

    setServedClients(prev => [...prev, finishedTicket]);
    setModules(prev => prev.map(mod => 
      mod.id === selectedModule 
        ? { ...mod, currentTicket: null, lastActivityTime: new Date() }
        : mod
    ));

    addLog(`Finalizada la atención del ticket ${finishedTicket.prefix}${finishedTicket.number} en el módulo ${selectedModule + 1} (Tiempo total: ${Math.floor(finishedTicket.totalTime)} minutos)`);
  };

  const hasWaitingPatients = preferentialQueue.length > 0 || generalQueue.length > 0;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="moduleSelect" className="block text-sm font-medium text-gray-700 mb-1">
              Módulo
            </label>
            <select
              id="moduleSelect"
              value={selectedModule}
              onChange={(e) => handleModuleChange(parseInt(e.target.value))}
              className="block w-full px-3 py-1.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {modules.slice(0, 6).map((mod, index) => (
                <option key={index} value={index}>
                  Módulo {index + 1}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Funcionario</p>
            <p className="text-base font-semibold text-blue-600">{currentUser?.name || module.pharmacist}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPasswordChange(true)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded flex items-center gap-1"
          >
            <Key className="h-4 w-4" />
            <span>Cambiar Contraseña</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded"
          >
            Cerrar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{preferentialQueue.length}</p>
          <p className="text-sm font-medium">Preferente</p>
          {preferentialQueue.length > 0 && (
            <p className="text-xs text-gray-600 mt-1">
              Primer ticket: {preferentialQueue[0].prefix}{preferentialQueue[0].number}
              <br />
              Espera: {getWaitingTime(preferentialQueue[0])} min
            </p>
          )}
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{generalQueue.length}</p>
          <p className="text-sm font-medium">General</p>
          {generalQueue.length > 0 && (
            <p className="text-xs text-gray-600 mt-1">
              Primer ticket: {generalQueue[0].prefix}{generalQueue[0].number}
              <br />
              Espera: {getWaitingTime(generalQueue[0])} min
            </p>
          )}
        </div>
      </div>

      {module.currentTicket ? (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Atendiendo</h3>
            <button
              onClick={() => speakNumber(module.currentTicket!)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition"
              title="Volver a llamar"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
          <p className="text-3xl font-bold text-blue-600 text-center">
            {module.currentTicket.prefix}{module.currentTicket.number}
          </p>
          <p className="text-sm text-center text-gray-600">
            {module.currentTicket.isPreferential ? 'Preferente' : 'General'}
          </p>
          <p className="text-xs text-center text-gray-500 mt-2">
            Tiempo de atención: {getWaitingTime(module.currentTicket)} min
          </p>
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Últimos Números Atendidos</h3>
          {lastServedTickets.length > 0 ? (
            <div className="space-y-2">
              {lastServedTickets.map((ticket, index) => (
                <div 
                  key={`${ticket.prefix}${ticket.number}`}
                  className={`flex justify-between items-center p-2 rounded ${index === 0 ? 'bg-purple-50' : 'bg-white'}`}
                >
                  <div>
                    <span className="font-bold text-lg text-purple-600">
                      {ticket.prefix}{ticket.number}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      ({ticket.isPreferential ? 'Preferente' : 'General'})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">
                      {ticket.endTime?.toLocaleTimeString()}
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">
                      Tiempo total: {Math.floor(ticket.totalTime || 0)} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No hay números atendidos</p>
          )}
        </div>
      )}

      {module.currentTicket ? (
        <button
          onClick={finishService}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Finalizar Atención
        </button>
      ) : (
        <button
          onClick={callNextClient}
          className={`w-full ${hasWaitingPatients ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'} text-white py-2 rounded transition`}
          disabled={!hasWaitingPatients}
        >
          {preferentialQueue.length > 0 
            ? 'Llamar Siguiente (Preferencial)' 
            : hasWaitingPatients 
              ? 'Llamar Siguiente (General)' 
              : 'No hay pacientes en espera'}
        </button>
      )}

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">Cambiar Contraseña</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {passwordError && (
                <p className="text-red-600 text-sm">{passwordError}</p>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordChange(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  <span>Cancelar</span>
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                >
                  <Check className="h-4 w-4" />
                  <span>Guardar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModuleView;