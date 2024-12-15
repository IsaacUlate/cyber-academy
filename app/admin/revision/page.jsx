'use client';
import { useEffect, useState } from 'react';

export default function ReviewPanel() {
  const [pendingNews, setPendingNews] = useState([]);

  useEffect(() => {
    const fetchPendingNews = async () => {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();

        // Filtrar solo noticias que estén pendientes de aprobación y no rechazadas
        const filteredNews = data.data.filter(
          (news) => news.approved === false && !news.rejected
        );

        setPendingNews(filteredNews);
      } catch (error) {
        console.error('Error al obtener las noticias pendientes:', error);
      }
    };

    fetchPendingNews();
  }, []);

  const handleApproval = async (id, approved) => {
    try {
      const res = await fetch(`/api/news/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved }),
      });

      if (res.ok) {
        setPendingNews((prev) => prev.filter((news) => news._id !== id));
        alert(approved ? 'Noticia aprobada' : 'Noticia rechazada');
      } else {
        console.error('Error al actualizar la noticia');
        alert('Error al actualizar la noticia');
      }
    } catch (error) {
      console.error('Error en la solicitud de aprobación/rechazo:', error);
      alert('Error en la solicitud');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Revisión de Noticias</h1>
      <div className="grid gap-6">
        {pendingNews.map((news) => (
          <div key={news._id} className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
            <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: news.content }}></div>
            <div className="flex justify-between">
              <button
                onClick={() => handleApproval(news._id, true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Aprobar
              </button>
              <button
                onClick={() => handleApproval(news._id, false)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>
      {pendingNews.length === 0 && (
        <p className="text-gray-500 text-center mt-8">No hay noticias pendientes de revisión.</p>
      )}
    </div>
  );
}
