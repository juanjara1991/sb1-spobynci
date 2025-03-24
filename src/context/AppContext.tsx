import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket, Module, ModuleUser } from '../types';

interface AppContextType {
  modules: Module[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  preferentialQueue: Ticket[];
  setPreferentialQueue: React.Dispatch<React.SetStateAction<Ticket[]>>;
  generalQueue: Ticket[];
  setGeneralQueue: React.Dispatch<React.SetStateAction<Ticket[]>>;
  ticketCounter: number;
  setTicketCounter: React.Dispatch<React.SetStateAction<number>>;
  servedClients: Ticket[];
  setServedClients: React.Dispatch<React.SetStateAction<Ticket[]>>;
  systemLogs: string[];
  setSystemLogs: React.Dispatch<React.SetStateAction<string[]>>;
  inactiveModules: number[];
  setInactiveModules: React.Dispatch<React.SetStateAction<number[]>>;
  moduleUsers: ModuleUser[];
  setModuleUsers: React.Dispatch<React.SetStateAction<ModuleUser[]>>;
  currentUser: ModuleUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<ModuleUser | null>>;
  addLog: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default data for exactly 6 modules
const defaultModules: Module[] = [
  { id: 0, pharmacist: "TAMARA OJEDA", currentTicket: null, lastActivityTime: new Date() },
  { id: 1, pharmacist: "JAIME VEGA", currentTicket: null, lastActivityTime: new Date() },
  { id: 2, pharmacist: "LISETTE MARCHANT", currentTicket: null, lastActivityTime: new Date() },
  { id: 3, pharmacist: "YESSENIA QUINTRILEO", currentTicket: null, lastActivityTime: new Date() },
  { id: 4, pharmacist: "ANA MARIA LANZARINI", currentTicket: null, lastActivityTime: new Date() },
  { id: 5, pharmacist: "MARIA EUGENIA FLORES", currentTicket: null, lastActivityTime: new Date() }
];

const defaultModuleUsers: ModuleUser[] = [
  { rut: "18414670-3", password: "12345", name: "JUAN JARA BENAVENTE", moduleId: -1, role: "admin" },
  { rut: "13885835-9", password: "12345", name: "TAMARA OJEDA", moduleId: 0, role: "module" },
  { rut: "19171259-5", password: "12345", name: "JAIME VEGA", moduleId: 1, role: "module" },
  { rut: "12865282-5", password: "12345", name: "LISETTE MARCHANT", moduleId: 2, role: "module" },
  { rut: "16247857-5", password: "12345", name: "YESSENIA QUINTRILEO", moduleId: 3, role: "module" },
  { rut: "10205723-6", password: "12345", name: "ANA MARIA LANZARINI", moduleId: 4, role: "module" },
  { rut: "9991391-6", password: "12345", name: "MARIA EUGENIA FLORES", moduleId: 5, role: "module" }
];

const parseStoredData = <T,>(storedData: string | null, defaultValue: T): T => {
  if (!storedData) return defaultValue;
  try {
    return JSON.parse(storedData, (key, value) => {
      // Convert date strings back to Date objects
      if (['arrivalTime', 'attendanceTime', 'endTime', 'lastActivityTime'].includes(key)) {
        return value ? new Date(value) : null;
      }
      return value;
    });
  } catch (error) {
    console.error("Error parsing stored data:", error);
    return defaultValue;
  }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with stored data or defaults
  const [modules, setModules] = useState(() => 
    parseStoredData(localStorage.getItem('modules'), defaultModules)
  );
  
  const [moduleUsers, setModuleUsers] = useState(() => 
    parseStoredData(localStorage.getItem('moduleUsers'), defaultModuleUsers)
  );
  
  const [currentUser, setCurrentUser] = useState(() => 
    parseStoredData(localStorage.getItem('currentUser'), null)
  );
  
  const [preferentialQueue, setPreferentialQueue] = useState<Ticket[]>(() => 
    parseStoredData(localStorage.getItem('preferentialQueue'), [])
  );
  
  const [generalQueue, setGeneralQueue] = useState<Ticket[]>(() => 
    parseStoredData(localStorage.getItem('generalQueue'), [])
  );
  
  const [ticketCounter, setTicketCounter] = useState(() => 
    parseInt(localStorage.getItem('ticketCounter') || '1', 10)
  );
  
  const [servedClients, setServedClients] = useState<Ticket[]>(() => 
    parseStoredData(localStorage.getItem('servedClients'), [])
  );
  
  const [systemLogs, setSystemLogs] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('systemLogs') || '[]')
  );
  
  const [inactiveModules, setInactiveModules] = useState<number[]>([]);

  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem('modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('moduleUsers', JSON.stringify(moduleUsers));
  }, [moduleUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('preferentialQueue', JSON.stringify(preferentialQueue));
  }, [preferentialQueue]);

  useEffect(() => {
    localStorage.setItem('generalQueue', JSON.stringify(generalQueue));
  }, [generalQueue]);

  useEffect(() => {
    localStorage.setItem('ticketCounter', ticketCounter.toString());
  }, [ticketCounter]);

  useEffect(() => {
    localStorage.setItem('servedClients', JSON.stringify(servedClients));
  }, [servedClients]);

  useEffect(() => {
    localStorage.setItem('systemLogs', JSON.stringify(systemLogs));
  }, [systemLogs]);

  // Check for inactive modules
  useEffect(() => {
    const checkInactivity = () => {
      if (preferentialQueue.length === 0 && generalQueue.length === 0) {
        setInactiveModules([]);
        return;
      }

      const now = new Date().getTime();
      const inactiveTimeout = 15 * 60 * 1000; // 15 minutes
      const inactive = modules
        .filter(module => now - module.lastActivityTime.getTime() >= inactiveTimeout)
        .map(module => module.id);

      setInactiveModules(inactive);
      inactive.forEach(moduleId => {
        if (!inactiveModules.includes(moduleId)) {
          addLog(`⚠️ ALERTA: El Módulo ${moduleId + 1} ha estado inactivo por 15 minutos y hay personas en espera`);
        }
      });
    };

    const interval = setInterval(checkInactivity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [modules, inactiveModules, preferentialQueue, generalQueue]);

  const addLog = (message: string) => {
    setSystemLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const value = {
    modules,
    setModules,
    preferentialQueue,
    setPreferentialQueue,
    generalQueue,
    setGeneralQueue,
    ticketCounter,
    setTicketCounter,
    servedClients,
    setServedClients,
    systemLogs,
    setSystemLogs,
    inactiveModules,
    setInactiveModules,
    moduleUsers,
    setModuleUsers,
    currentUser,
    setCurrentUser,
    addLog
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}