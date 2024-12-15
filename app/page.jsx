"use client";
import React from 'react';

const HomePage = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Main content */}
      <main className="pt-20">
        <section className="container mx-auto px-6 py-12 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Bienvenidos a la Asociación Lucha Contra la Obesidad</h2>
          <p className="text-gray-600 text-xl mb-8">
            Nuestro objetivo es educar, apoyar y difundir información relacionada con la lucha contra la obesidad.
          </p>
          <a
            href="/recursos"
            className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition-colors"
          >
            Explorar Recursos
          </a>
        </section>
        
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-3xl font-semibold text-gray-900">Calculadora IMC</h3>
              <p className="text-gray-600">
                Usa nuestra calculadora para saber si tu índice de masa corporal está dentro del rango saludable.
              </p>
              <a
                href="/calculadora-imc"
                className="inline-block bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition-colors"
              >
                Calcular ahora
              </a>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-semibold text-gray-900">Próximos eventos</h3>
              <p className="text-gray-600">
                Participa en nuestros eventos educativos para aprender más sobre cómo manejar la obesidad de manera efectiva.
              </p>
              <a
                href="/eventos"
                className="inline-block bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition-colors"
              >
                Ver Eventos
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
