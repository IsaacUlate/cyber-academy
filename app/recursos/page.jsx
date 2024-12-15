"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ResourcesPage() {
  const [videos, setVideos] = useState([]);
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);

  // Cargar videos desde la API
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/videos");
        const data = await response.json();
        if (data.success) {
          const now = new Date();
          // Filtrar los videos que están programados para publicarse hasta ahora
          const publishedVideos = data.data.filter(
            (video) => new Date(video.scheduledDate) <= now
          );
          setVideos(publishedVideos);
          setVisibleVideos(publishedVideos.slice(0, visibleCount));
        } else {
          console.error("Error al obtener los videos:", data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [visibleCount]);

  const handleShowMore = () => {
    const newVisibleCount = visibleCount + 5;
    setVisibleCount(newVisibleCount);
    setVisibleVideos(videos.slice(0, newVisibleCount));
  };

  return (
    <div className="bg-white min-h-screen text-[#0B1F48] font-sans">
      {/* Hero Section */}
      <section className="text-center py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Recursos de Salud y <span className="text-[#4B5563]">Obesidad</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Encuentra recursos útiles para ayudarte a mejorar tu salud y bienestar.
          </p>
        </div>
      </section>

      {/* Help Request Form Section */}
      <section className="text-center py-16 bg-[#F3F4F6]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">¿Necesitas Ayuda?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Si necesitas asistencia o tienes alguna consulta, llena el formulario de solicitud de ayuda y estaremos encantados de apoyarte.
          </p>
          <Link
            href="https://forms.office.com/Pages/ResponsePage.aspx?id=KfihHhUydku4lkYkLJqOuXLr02ouJPlBiKjMYRgF4R5UQTdDS0kzSTZNRU5HMkZWMExHNTlJMFNTNSQlQCN0PWcu"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#4B5563] text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-700 transition-all"
          >
            Solicitar Ayuda
          </Link>
        </div>
      </section>

      {/* YouTube Channel Section */}
      <section className="text-center py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            {/* YouTube Badge */}
            <div className="flex items-center space-x-4">
              <img
                src="/images/youtube-logo.png" // Coloca aquí la ruta correcta a la imagen que has subido
                alt="Logo del Canal de YouTube"
                className="w-16 h-16 rounded-full"
              />
              <div className="text-left">
                <h3 className="text-2xl font-bold">Hablemos de Obesidad y Salud</h3>
                <p className="text-gray-600">Canal de YouTube</p>
              </div>
            </div>

            {/* Subscribe Button */}
            <Link
              href="https://www.youtube.com/@HablemosdeObesidadySalud"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-red-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-red-700 transition-all"
            >
              Visitar
            </Link>
          </div>

          <p className="text-lg text-gray-600">
            Visita nuestro canal &quot;Hablemos de Obesidad y Salud&quot; para acceder a videos educativos sobre el bienestar, el cuidado de la salud y consejos útiles de nuestros expertos.
          </p>
        </div>
      </section>

      {/* Videos List Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#0B1F48]">
          Videos Educativos
        </h2>
        {loading ? (
          <p className="text-center text-gray-400">Cargando videos...</p>
        ) : videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {visibleVideos.map((video) => (
                <div key={video._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <iframe
                      src={video.url}
                      title={`Video ${video.title}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-md"
                    ></iframe>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{video.title}</h3>
                  <p className="text-gray-600">{video.description}</p>
                </div>
              ))}
            </div>

            {visibleCount < videos.length && (
              <div className="text-center mt-8">
                <button
                  onClick={handleShowMore}
                  className="bg-[#4B5563] text-white py-2 px-4 rounded hover:bg-gray-700 transition-all"
                >
                  Ver más videos
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">
            No hay videos disponibles en este momento.
          </p>
        )}
      </section>
    </div>
  );
}
