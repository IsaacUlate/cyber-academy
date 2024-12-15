"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EventDetailPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/events/${id}`);
        const data = await response.json();
        if (data.success) {
          setEvent(data.data);
        } else {
          console.error("Error al obtener el evento:", data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-400">Cargando evento...</p>;
  }

  if (!event) {
    return <p className="text-center text-gray-500">Evento no encontrado.</p>;
  }

  const shareUrl = `${window.location.origin}/eventos/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Enlace copiado al portapapeles.");
  };

  return (
    <div className="bg-white min-h-screen text-[#0B1F48] font-sans p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          Fecha:{" "}
          {new Date(event.scheduledDate).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </p>
        <div
          className="text-gray-800 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
        <button
          onClick={handleCopyLink}
          className="bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition-all"
        >
          Compartir
        </button>



      </div>
    </div>
  );
}
