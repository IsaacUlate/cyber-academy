"use client";
import React from 'react';

// Datos de ejemplo de profesionales
const profesionales = [
  {
    nombre: "Dr. Juan Pérez",
    especialidad: "Nutricionista",
    biografia: "Especialista en nutrición clínica y bienestar.",
    foto: "/images/profesionales/juan-perez.jpg", // Ruta de la foto
  },
  {
    nombre: "Lic. María López",
    especialidad: "Psicóloga",
    biografia: "Psicóloga especializada en trastornos alimentarios.",
    foto: "/images/profesionales/maria-lopez.jpg",
  },
  {
    nombre: "Entrenador Carlos García",
    especialidad: "Entrenador Personal",
    biografia: "Entrenador personal con más de 10 años de experiencia.",
    foto: "/images/profesionales/carlos-garcia.jpg",
  },
];

const ProfesionalesPage = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen pt-20">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Profesionales</h1>
        <p className="text-gray-600 mt-2">
          Conoce a nuestro equipo de expertos
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {profesionales.map((profesional, index) => (
          <div key={index} className="bg-gray-100 rounded-lg shadow-lg p-6">
            <img
              src={profesional.foto}
              alt={profesional.nombre}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-semibold">{profesional.nombre}</h2>
            <h3 className="text-lg text-gray-600">{profesional.especialidad}</h3>
            <p className="text-gray-700 mt-2">{profesional.biografia}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfesionalesPage;
