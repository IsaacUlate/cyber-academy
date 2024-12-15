"use client";
import React, { useState } from 'react';

const CalculadoraIMC = () => {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const calcularIMC = (e) => {
    e.preventDefault();
    const alturaMetros = altura / 100; // Convertir a metros
    const resultadoIMC = peso / (alturaMetros * alturaMetros);
    setImc(resultadoIMC.toFixed(2));
    
    // Mensaje según el resultado
    if (resultadoIMC < 18.5) {
      setMensaje('Bajo peso');
    } else if (resultadoIMC < 24.9) {
      setMensaje('Peso normal');
    } else if (resultadoIMC < 29.9) {
      setMensaje('Sobrepeso');
    } else {
      setMensaje('Obesidad');
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen pt-20">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Calculadora IMC</h1>
        <p className="text-gray-600 mt-2">
          Descubre tu Índice de Masa Corporal
        </p>
      </header>

      <div className="max-w-md mx-auto bg-gray-100 p-8 rounded-lg shadow-lg">
        <form onSubmit={calcularIMC}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="peso">Peso (kg)</label>
            <input
              type="number"
              id="peso"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="altura">Altura (cm)</label>
            <input
              type="number"
              id="altura"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            Calcular IMC
          </button>
        </form>

        {imc && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold">Tu IMC es: {imc}</h2>
            <p className="text-gray-700">{mensaje}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculadoraIMC;
