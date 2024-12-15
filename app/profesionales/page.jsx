"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState("");
  const [canton, setCanton] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ region, canton }).toString();
        const response = await fetch(`/api/professionals?${query}`);
        const data = await response.json();
        if (data.success) {
          setProfessionals(data.data);
        } else {
          console.error("Error al obtener los profesionales:", data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, [region, canton]);

  const handleViewProfessional = (id) => {
    router.push(`/profesionales/${id}`);
  };

  const regions = [
    "San José",
    "Alajuela",
    "Cartago",
    "Heredia",
    "Guanacaste",
    "Puntarenas",
    "Limón",
  ];

  const cantonsByRegion = {
    "San José": ["San José", "Escazú", "Desamparados", "Puriscal"],
    "Alajuela": ["Alajuela", "San Ramón", "Grecia", "San Mateo"],
    "Cartago": ["Cartago", "Paraíso", "La Unión", "Jiménez"],
    "Heredia": ["Heredia", "Barva", "Santo Domingo", "Santa Bárbara"],
    "Guanacaste": ["Liberia", "Nicoya", "Santa Cruz", "Bagaces"],
    "Puntarenas": ["Puntarenas", "Esparza", "Buenos Aires", "Montes de Oro"],
    "Limón": ["Limón", "Pococí", "Siquirres", "Talamanca"],
  };

  return (
    <div className="bg-white min-h-screen text-[#0B1F48] font-sans">
      <section className="text-center py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Conoce a Nuestros <span className="text-[#4B5563]">Profesionales</span>
          </h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select
            id="region"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setCanton("");
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Todas las provincias</option>
            {regions.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
          <select
            id="canton"
            value={canton}
            onChange={(e) => setCanton(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            disabled={!region}
          >
            <option value="">Todos los cantones</option>
            {region &&
              cantonsByRegion[region].map((can) => (
                <option key={can} value={can}>
                  {can}
                </option>
              ))}
          </select>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <p className="text-center text-gray-400">Cargando profesionales...</p>
        ) : professionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {professionals.map((professional) => (
              <div
                key={professional._id}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-bold mb-3">{professional.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Especialidad: {professional.specialty}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Región: {professional.region}, Cantón: {professional.canton}
                </p>
                <p className="text-sm text-gray-600 font-semibold">
                  Contacto: {professional.contactInfo}
                </p>
                <button
                  onClick={() => handleViewProfessional(professional._id)}
                  className="mt-4 text-[#2563EB] font-semibold hover:bg-[#d1d0d0] underline"
                >
                  Más información
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No hay profesionales disponibles en este momento.
          </p>
        )}
      </section>
    </div>
  );
}
