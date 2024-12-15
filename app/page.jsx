"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [loadingNews, setLoadingNews] = useState(true);
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

  // Cargar las últimas noticias aprobadas desde MongoDB usando la API local
  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      try {
        const response = await fetch("/api/news");
        const data = await response.json();
        if (data.success) {
          const now = new Date();
          const latestNews = data.data
            .filter((news) => news.approved === true && new Date(news.scheduledDate) <= now)
            .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))
            .slice(0, 5);
          setNewsList(latestNews);
        } else {
          console.error("Error al obtener las noticias:", data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  // Cargar los patrocinadores desde la API local
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch("/api/sponsors");
        const data = await response.json();
        if (data.success) {
          setSponsors(data.data);
        } else {
          console.error("Error al obtener los patrocinadores:", data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    fetchSponsors();
  }, []);

  const handleOpenSponsorModal = (sponsor, event) => {
    event.preventDefault();
    setSelectedSponsor(sponsor);
  };

  const handleCloseSponsorModal = () => setSelectedSponsor(null);

  return (
    <div className="bg-gray-100 min-h-screen text-[#0B1F48] font-sans">
      <section className="text-center py-32 bg-gray-50">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-[#0B1F48]">
          Bienvenido a <span className="text-[#F4A300]">ALCO</span>
        </h1>
        <p className="text-xl mb-8 text-gray-700 leading-relaxed max-w-2xl mx-auto">
          Acompañamos tu proceso hacia una vida más saludable a través de recursos,
          profesionales y eventos educativos.
        </p>
        <Link
          href="/recursos"
          className="bg-[#F4A300] text-white py-3 px-8 rounded-full font-semibold hover:shadow-md transition-all"
        >
          Explorar Ahora
        </Link>
      </section>

      {/* Noticias y Patrocinadores - Carruseles lado a lado */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Carousel de Noticias con Swiper */}
          <div className="lg:col-span-3">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#F4A300]">
              Últimas Noticias
            </h2>
            {loadingNews ? (
              <p className="text-center text-gray-500">Cargando...</p>
            ) : (
              <Swiper
                modules={[Autoplay]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop={true}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
              >
                {newsList.length > 0 ? (
                  newsList.map((news) => (
                    <SwiperSlide key={news._id}>
                      <div className="p-6 bg-white text-[#0B1F48] rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all h-80 flex flex-col">
                        {news.image && (
                          <div className="w-full h-32 overflow-hidden rounded-lg mb-4">
                            <img
                              src={news.image}
                              alt={news.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <h3 className="font-bold text-xl mb-2">{news.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {new Date(news.scheduledDate).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </p>
                        <p className="text-gray-700 truncate mb-2 flex-grow">
                          {news.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
                        </p>
                        <Link
                          href={`/noticias/${news._id}`}
                          className="text-[#F4A300] mt-2 inline-block hover:underline font-semibold"
                        >
                          Leer más
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No hay noticias disponibles.</p>
                )}
              </Swiper>
            )}
          </div>

          {/* Carousel de Patrocinadores con Swiper */}
          <div>
            <h2 className="text-4xl font-bold text-center mb-12 text-[#F4A300]">
              Patrocinadores
            </h2>
            {sponsors.length > 0 ? (
              <Swiper
                modules={[Autoplay]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop={true}
                spaceBetween={20}
                slidesPerView={1}
              >
                {sponsors.map((sponsor) => (
                  <SwiperSlide key={sponsor._id}>
                    <div
                      className="p-6 bg-white text-[#0B1F48] rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all h-80 flex flex-col"
                      onClick={(event) => handleOpenSponsorModal(sponsor, event)}
                    >
                      <div
                        className="text-gray-700 mb-4 text-justify leading-relaxed flex-grow"
                        dangerouslySetInnerHTML={{ __html: sponsor.content }}
                      />
                      <a
                        href="#"
                        className="text-[#F4A300] mt-2 inline-block hover:underline font-semibold"
                      >
                        Más información
                      </a>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-center text-gray-500">No hay patrocinadores disponibles.</p>
            )}
          </div>
        </div>
      </section>

      {/* Modal para mostrar el patrocinador seleccionado */}
      {selectedSponsor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-semibold mb-2">{selectedSponsor.name}</h2>
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: selectedSponsor.content,
              }}
            />
            <button
              onClick={handleCloseSponsorModal}
              className="mt-4 bg-[#F4A300] text-white py-2 px-4 rounded hover:bg-yellow-600 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Videos List Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#0B1F48]">
          Videos Recomendados
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

      <footer className="bg-gray-800 py-6 text-gray-400 text-center">
        <p>&copy; 2024 Asociación ALCO. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
