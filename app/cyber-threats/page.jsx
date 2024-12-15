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
    router.push(`/cyber-threats/${id}`);
  };

  return (
    <div className="bg-[#0B0F19] min-h-screen text-[#E5E7EB] font-sans">
      {/* Hero Section */}
      <section className="text-center py-24 bg-gradient-to-r from-[#0B0F19] to-[#1A2238]">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 leading-tight text-[#00C3FF]">
            Latest <span className="text-[#3ABFF8]">Cybersecurity News</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Stay updated with the latest threats, updates, and solutions in cybersecurity.
          </p>
        </div>
      </section>

      {/* News List Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <p className="text-center text-gray-400">Loading news...</p>
        ) : visibleNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {visibleNews.map((news) => (
              <div
                key={news._id}
                className="p-6 border border-[#1E2A47] bg-[#1A1F2F] rounded-lg hover:shadow-lg transition-shadow h-full flex flex-col"
              >
                <h3 className="text-2xl font-bold mb-3 text-[#00C3FF]">
                  {news.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Published on:{" "}
                  {new Date(news.scheduledDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
                <div className="text-gray-300 mb-4 text-justify leading-relaxed flex-grow">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: news.content.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
                    }}
                  />
                </div>
                <button
                  onClick={() => handleViewNews(news._id)}
                  className="text-[#00C3FF] font-semibold hover:text-[#3ABFF8] underline self-start transition"
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No news available at the moment.
          </p>
        )}

        {visibleCount < allNews.length && (
          <div className="text-center mt-8">
            <button
              onClick={handleShowMore}
              className="bg-[#00C3FF] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#3ABFF8] transition-all shadow-md"
            >
              Show More
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
