"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProfessionalDetailPage() {
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchProfessional = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/professionals/${id}`);
        const data = await response.json();
        if (data.success) {
          setProfessional(data.data);
        } else {
          console.error("Error al obtener el profesional:", data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProfessional();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-400">Cargando profesional...</p>;
  }

  if (!professional) {
    return <p className="text-center text-gray-500">Profesional no encontrado.</p>;
  }

  return (
    <div className="bg-white min-h-screen text-[#0B1F48] font-sans p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{professional.name}</h1>
        <p className="text-sm text-gray-500 mb-4">
          Especialidad: {professional.specialty}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Región: {professional.region}, Cantón: {professional.canton}
        </p>
        <p className="text-sm text-gray-600 font-semibold mb-4">
          Contacto: {professional.contactInfo}
        </p>
        <div
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: professional.description }}
        />
      </div>
    </div>
  );
}
