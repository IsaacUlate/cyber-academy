"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [editVideoId, setEditVideoId] = useState(null);

  // Función para cargar los videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos");
        const data = await response.json();
        if (data.success) {
          setVideos(data.data); // Cargar videos publicados
        } else {
          console.error("Error al obtener los videos:", data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    fetchVideos();
  }, []);

  const toUTCDate = (date) => new Date(new Date(date).toISOString()); // Convertir a UTC

  // Función para agregar o editar videos
  const handleAddOrEditVideo = async () => {
    const method = editVideoId ? "PUT" : "POST";
    const urlPath = "/api/videos";
    const utcScheduledDate = toUTCDate(scheduledDate); // Fecha en UTC

    try {
      const response = await fetch(urlPath, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url, scheduledDate: utcScheduledDate, id: editVideoId }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setVideos((prev) =>
          editVideoId
            ? prev.map((video) => (video._id === editVideoId ? updatedData.data : video))
            : [...prev, updatedData.data]
        );
        resetForm();
        alert(editVideoId ? "Video actualizado." : "Video agregado.");
      } else {
        alert("Error al procesar la solicitud.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error interno del servidor.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch("/api/videos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setVideos((prev) => prev.filter((video) => video._id !== id));
        alert("Video eliminado.");
      } else {
        alert("Error al eliminar el video.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleEdit = (video) => {
    setEditVideoId(video._id);
    setTitle(video.title);
    setUrl(video.url);
    setScheduledDate(new Date(video.scheduledDate).toISOString().slice(0, 16));
  };

  const resetForm = () => {
    setEditVideoId(null);
    setTitle("");
    setUrl("");
    setScheduledDate("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Panel Admin</h1>
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="Título del video"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <input
          type="text"
          placeholder="URL del video"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <div className="w-1/2">
          <label className="block text-gray-700 mb-2" htmlFor="scheduledDate">
           Programar Fecha
          </label>
          <input
            id="scheduledDate"
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <button onClick={handleAddOrEditVideo} className="bg-green-500 text-white px-4 py-2 rounded">
          {editVideoId ? "Guardar Cambios" : "Agregar Video"}
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2">Videos Existentes</h2>
      <ul>
        {videos.length > 0 ? (
          videos.map((video) => (
            <li key={video._id} className="mb-2">
              <strong>{video.title}</strong> - {video.url} <br />
              Programado para: {new Date(video.scheduledDate).toLocaleString("es-ES")} <br />
              <div className="space-x-2">
                <button onClick={() => handleEdit(video)} className="bg-blue-500 text-white px-2 py-1 rounded">
                  Editar
                </button>
                <button onClick={() => handleDelete(video._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Eliminar
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No hay videos disponibles.</p>
        )}
      </ul>
    </div>
  );
}
