"use client";
import React from 'react';

// Datos de ejemplo de eventos
const eventos = [
  {
    titulo: "Taller de Nutrición",
    fecha: "15 de Octubre, 2024",
    descripcion: "Aprende sobre la alimentación saludable y cómo crear un plan de comidas.",
  },
  {
    titulo: "Caminata por la Salud",
    fecha: "22 de Octubre, 2024",
    descripcion: "Únete a nosotros para una caminata y actividades al aire libre.",
  },
  {
    titulo: "Seminario sobre Obesidad Infantil",
    fecha: "29 de Octubre, 2024",
    descripcion: "Charla sobre la prevención y manejo de la obesidad infantil.",
  },
];

const EventosPage = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen pt-20">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Eventos</h1>
        <p className="text-gray-600 mt-2">Participa en nuestras actividades y aprende más sobre la obesidad.</p>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {eventos.map((evento, index) => (
          <div key={index} className="bg-gray-100 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold">{evento.titulo}</h2>
            <h3 className="text-lg text-gray-600">{evento.fecha}</h3>
            <p className="text-gray-700 mt-2">{evento.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventosPage;
