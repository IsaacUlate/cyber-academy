"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";

const obtenerFechaFormateada = () => {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

const clasificarIMC = (imc) => {
  if (imc < 18.5) return "Bajo peso";
  if (imc >= 18.5 && imc < 24.9) return "Peso normal";
  if (imc >= 25 && imc < 29.9) return "Sobrepeso";
  return "Obesidad";
};

const generarPDF = async (imc, peso, edad, actividad, clasificacionIMC) => {
  const doc = new jsPDF();
  const fecha = obtenerFechaFormateada();

  // Cargar el logo como imagen
  const logo = new Image();
  logo.src = "/images/logo-alco.png"; // Asegúrate de que esta ruta sea válida

  logo.onload = () => {
    doc.addImage(logo, "PNG", 10, 10, 30, 30); // Logo en la esquina superior izquierda
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor("#0B1F48");
    doc.text("Resultado de IMC", 105, 30, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor("#000000");
    doc.text(`Fecha: ${fecha}`, 10, 50);
    doc.text(`Peso ingresado: ${peso} kg`, 10, 65);
    doc.text(`Edad: ${edad} años`, 10, 80);
    doc.text(`Nivel de Actividad: ${actividad}`, 10, 95);
    doc.text(`Tu IMC es: ${imc}`, 10, 110);
    doc.text(`Clasificación: ${clasificacionIMC}`, 10, 125);

    doc.save("resultado_imc.pdf");
  };
};

const CalculadoraIMC = () => {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [edad, setEdad] = useState("");
  const [actividad, setActividad] = useState("moderado");
  const [imc, setImc] = useState(null);
  const [clasificacionIMC, setClasificacionIMC] = useState("");

  const calcularIMC = (e) => {
    e.preventDefault();
    const alturaMetros = altura / 100;
    const resultadoIMC = peso / (alturaMetros * alturaMetros);
    const clasificacion = clasificarIMC(resultadoIMC);
    setImc(resultadoIMC.toFixed(2));
    setClasificacionIMC(clasificacion);
  };

  return (
    <div className="bg-[#0B1F48] min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#0B1F48]">
          Calculadora IMC
        </h1>
        <form onSubmit={calcularIMC} className="space-y-4">
          <input
            type="number"
            placeholder="Peso (kg)"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
            required
          />
          <input
            type="number"
            placeholder="Altura (cm)"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
            required
          />
          <input
            type="number"
            placeholder="Edad"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
          />
          <select
            value={actividad}
            onChange={(e) => setActividad(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
          >
            <option value="bajo">Actividad Baja</option>
            <option value="moderado">Actividad Moderada</option>
            <option value="alta">Actividad Alta</option>
          </select>
          <button
            type="submit"
            className="w-full bg-[#F4A300] text-white py-3 rounded-lg font-bold hover:bg-yellow-600 transition"
          >
            Calcular IMC
          </button>
        </form>

        {imc && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold">Tu IMC es: {imc}</h2>
            <h3 className="text-lg text-gray-700">
              Clasificación: {clasificacionIMC}
            </h3>
            <button
              onClick={() =>
                generarPDF(imc, peso, edad, actividad, clasificacionIMC)
              }
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Descargar PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculadoraIMC;
