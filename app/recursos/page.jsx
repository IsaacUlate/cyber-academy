"use client";
import React from 'react';

// Datos de ejemplo de recursos
const recursos = [
  {
    titulo: "Guía de Alimentación Saludable",
    descripcion: "Una guía completa sobre cómo llevar una alimentación balanceada.",
    enlace: "https://ejemplo.com/guia-alimentacion",
  },
  {
    titulo: "Ejercicios para Mantenerse Activo",
    descripcion: "Una lista de ejercicios simples que puedes hacer en casa.",
    enlace: "https://ejemplo.com/ejercicios",
  },
  {
    titulo: "Consejos para Manejar el Estrés",
    descripcion: "Estrategias para reducir el estrés y mejorar tu bienestar emocional.",
    enlace: "https://ejemplo.com/estres",
  },
];

const RecursosPage = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen pt-20">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Recursos</h1>
        <p className="text-gray-600 mt-2">Accede a materiales y guías que te ayudarán en tu camino.</p>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recursos.map((recurso, index) => (
          <div key={index} className="bg-gray-100 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold">{recurso.titulo}</h2>
            <p className="text-gray-700 mt-2">{recurso.descripcion}</p>
            <a
              href={recurso.enlace}
              className="text-blue-600 hover:underline mt-4 block"
              target="_blank"
              rel="noopener noreferrer"
            >
              Acceder al Recurso
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecursosPage;
