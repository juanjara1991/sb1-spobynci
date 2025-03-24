import React, { useState } from 'react';
import { User, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Ticket as TicketType } from '../types';
import Ticket from '../components/Ticket';

function TicketGeneration() {
  const { ticketCounter, setTicketCounter, preferentialQueue, setPreferentialQueue, generalQueue, setGeneralQueue, addLog } = useApp();
  const [printingTicket, setPrintingTicket] = useState<TicketType | null>(null);

  const generateTicket = (isPreferential: boolean) => {
    const prefix = isPreferential ? 'A' : 'B';
    const ticket = {
      prefix,
      number: ticketCounter,
      arrivalTime: new Date(),
      isPreferential
    };

    setTicketCounter(prev => prev + 1);
    const queue = isPreferential ? setPreferentialQueue : setGeneralQueue;
    queue(prev => [...prev, ticket]);
    addLog(`Nuevo número ${isPreferential ? 'PREFERENTE' : 'GENERAL'} ${prefix}${ticket.number} generado`);
    setPrintingTicket(ticket);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          CESFAM Dr. Aníbal Ariztía
        </h1>
        <p className="text-center text-gray-600 mb-8">Sistema de Generación de Números</p>
        <div className="space-y-6">
          <button
            onClick={() => generateTicket(true)}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-3 text-lg"
          >
            <Users className="h-8 w-8" />
            <span>Número Preferente</span>
          </button>
          <button
            onClick={() => generateTicket(false)}
            className="w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-3 text-lg"
          >
            <User className="h-8 w-8" />
            <span>Número General</span>
          </button>
        </div>
      </div>
      {printingTicket && (
        <Ticket 
          ticket={printingTicket}
          onPrintComplete={() => setPrintingTicket(null)}
        />
      )}
    </div>
  );
}

export default TicketGeneration;