"use client";
import React from 'react';

// Datos de ejemplo de noticias
const noticias = [
  {
    titulo: "Nuevo Programa de Concientización sobre la Obesidad",
    fecha: "1 de Octubre, 2024",
    descripcion: "La Asociación ALCO lanza un nuevo programa para educar sobre la obesidad.",
  },
  {
    titulo: "Resultados de la Encuesta de Salud",
    fecha: "10 de Octubre, 2024",
    descripcion: "Presentamos los resultados de nuestra encuesta anual sobre hábitos alimenticios.",
  },
  {
    titulo: "Evento de Salud Mental",
    fecha: "25 de Octubre, 2024",
    descripcion: "Un evento centrado en la salud mental y su relación con la obesidad.",
  },
];

const NoticiasPage = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen pt-20">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Noticias</h1>
        <p className="text-gray-600 mt-2">Mantente informado sobre las últimas novedades de nuestra Asociación.</p>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {noticias.map((noticia, index) => (
          <div key={index} className="bg-gray-100 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold">{noticia.titulo}</h2>
            <h3 className="text-lg text-gray-600">{noticia.fecha}</h3>
            <p className="text-gray-700 mt-2">{noticia.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticiasPage;
