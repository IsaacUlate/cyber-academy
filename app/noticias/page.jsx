"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "swiper/css";

export default function NewsPage() {
  const [allNews, setAllNews] = useState([]);
  const [visibleNews, setVisibleNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cargar noticias desde la API
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/news");
        const data = await response.json();
        if (data.success) {
          const now = new Date();
          const latestNews = data.data
            .filter(
              (news) =>
                news.approved === true && new Date(news.scheduledDate) <= now
            )
            .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
          setAllNews(latestNews);
          setVisibleNews(latestNews.slice(0, visibleCount));
        } else {
          console.error("Error al obtener las noticias:", data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    // Actualizar las noticias visibles cuando el conteo cambia
    setVisibleNews(allNews.slice(0, visibleCount));
  }, [visibleCount, allNews]);

  const handleShowMore = () => {
    const newVisibleCount = visibleCount + 5;
    setVisibleCount(newVisibleCount);
  };

  const handleViewNews = (id) => {
    router.push(`/noticias/${id}`);
  };

  return (
    <div className="bg-white min-h-screen text-[#0B1F48] font-sans">
      {/* Hero Section */}
      <section className="text-center py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Últimas <span className="text-[#4B5563]">Noticias</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Entérate de las noticias más recientes relacionadas con la salud y bienestar.
          </p>
        </div>
      </section>

      {/* News List Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <p className="text-center text-gray-400">Cargando noticias...</p>
        ) : visibleNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {visibleNews.map((news) => (
              <div
                key={news._id}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow h-full flex flex-col"
              >
                <h3 className="text-2xl font-bold mb-3">{news.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Fecha:{" "}
                  {new Date(news.scheduledDate).toLocaleDateString("es-ES", {
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
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: news.content.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
                    }}
                  />
                </div>
                <button
                  onClick={() => handleViewNews(news._id)}
                  className="text-[#2563EB] font-semibold hover:bg-[#d1d0d0] underline self-start"
                >
                  Leer más
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No hay noticias disponibles en este momento.
          </p>
        )}

        {visibleCount < allNews.length && (
          <div className="text-center mt-8">
            <button
              onClick={handleShowMore}
              className="bg-[#0B1F48] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#092841] transition-all shadow-md"
            >
              Ver más noticias
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
