"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function NewsDetailPage() {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/news/${id}`);
        const data = await response.json();
        if (data.success) {
          setNews(data.data);
        } else {
          console.error("Error al obtener la noticia:", data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchNews();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-400">Cargando noticia...</p>;
  }

  if (!news) {
    return <p className="text-center text-gray-500">Noticia no encontrada.</p>;
  }

  const shareUrl = `${window.location.origin}/noticias/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Enlace copiado al portapapeles.");
  };

  return (
    <div className="bg-white min-h-screen text-[#0B1F48] font-sans p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
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
          className="text-gray-800 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: news.content }}
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
