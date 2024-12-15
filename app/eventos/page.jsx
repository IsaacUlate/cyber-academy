"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "swiper/css";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cargar eventos desde la API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        if (data.success) {
          setEvents(data.data);
        } else {
          console.error("Error al obtener los eventos:", data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleViewEvent = (id) => {
    router.push(`/eventos/${id}`);
  };

  return (
    <div className="bg-white min-h-screen text-[#0B1F48] font-sans">
      {/* Hero Section */}
      <section className="text-center py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Participa en Nuestros <span className="text-[#4B5563]">Eventos</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explora los próximos eventos y participa para aprender sobre salud y bienestar de la mano de expertos.
          </p>
        </div>
      </section>

      {/* Events List Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <p className="text-center text-gray-400">Cargando eventos...</p>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {events.map((event) => (
              <div
                key={event._id}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow h-full flex flex-col"
              >
                <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
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
                  className="text-gray-700 mb-4 text-justify leading-relaxed flex-grow"
                  dangerouslySetInnerHTML={{
                    __html: event.description.substring(0, 100) + "...",
                  }}
                />
                <button
                  onClick={() => handleViewEvent(event._id)}
                  className="text-[#2563EB] font-semibold hover:bg-[#d1d0d0] underline self-start"
                >
                  Más información
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No hay eventos disponibles en este momento.
          </p>
        )}
      </section>
    </div>
  );
}
