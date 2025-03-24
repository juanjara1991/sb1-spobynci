import React from 'react';
import { Building2, Phone, Mail, MapPin, Clock, Users, Heart, Stethoscope } from 'lucide-react';

function Schedule() {
  const services = [
    {
      name: 'Farmacia',
      icon: Heart,
      description: 'Dispensación de medicamentos y orientación farmacéutica'
    },
    {
      name: 'Atención Preferencial',
      icon: Users,
      description: 'Atención prioritaria para adultos mayores, embarazadas y personas con movilidad reducida'
    },
    {
      name: 'Gestión de Medicamentos',
      icon: Stethoscope,
      description: 'Control y seguimiento de tratamientos farmacológicos'
    }
  ];

  const modules = [
    { id: 1, pharmacist: "TAMARA OJEDA", specialty: "Medicamentos Crónicos" },
    { id: 2, pharmacist: "JAIME VEGA", specialty: "Medicamentos Generales" },
    { id: 3, pharmacist: "LISETTE MARCHANT", specialty: "Medicamentos Controlados" },
    { id: 4, pharmacist: "YESSENIA QUINTRILEO", specialty: "Medicamentos Generales" },
    { id: 5, pharmacist: "ANA MARIA LANZARINI", specialty: "Medicamentos Crónicos" },
    { id: 6, pharmacist: "MARIA EUGENIA FLORES", specialty: "Medicamentos Controlados" }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CESFAM Dr. Aníbal Ariztía
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema de Gestión de Números para Farmacia
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Sobre el Sistema</h2>
            <p className="text-gray-600 mb-6">
              Nuestro sistema de gestión de números está diseñado para optimizar la atención 
              en la farmacia del CESFAM, reduciendo los tiempos de espera y mejorando la 
              experiencia de nuestros usuarios.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Av. Presidente Kennedy 9001, Las Condes</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">+56 2 2575 8700</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">farmacia.ariztia@cmdsnc.cl</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Lunes a Viernes: 8:00 - 17:00</span>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80"
              alt="CESFAM Farmacia"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-8">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <service.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Información Importante</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Documentos Necesarios</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span>Receta médica vigente</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span>Carnet de identidad</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span>Credencial del consultorio (si aplica)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Horarios de Mayor Afluencia</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span>8:00 - 10:00 hrs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span>12:00 - 14:00 hrs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span>16:00 - 17:00 hrs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedule;