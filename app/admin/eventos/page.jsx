"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";

// Importación dinámica del editor Quill para evitar problemas con SSR
const QuillNoSSRWrapper = dynamic(() => import("react-quill"), { ssr: false });

export default function AdminEventsPage() {
  const [eventsList, setEventsList] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [editEventId, setEditEventId] = useState(null);
  const reactQuillRef = useRef();

  // Configuración del editor Quill
  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["link", "image"], // Añadimos botones estándar para el editor
        ["clean"],
      ],
    },
  };

  // Cargar eventos desde la API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        if (data.success) {
          setEventsList(data.data);
        } else {
          console.error("Error al obtener los eventos:", data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    fetchEvents();
  }, []);

  // Agregar o editar un evento
  const handleAddOrEditEvent = async () => {
    const method = editEventId ? "PUT" : "POST";
    const urlPath = editEventId ? `/api/events` : "/api/events";

    try {
      const response = await fetch(urlPath, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          scheduledDate: new Date(scheduledDate).toISOString(),
          id: editEventId,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setEventsList((prev) =>
          editEventId
            ? prev.map((item) =>
                item._id === editEventId ? updatedData.data : item
              )
            : [...prev, updatedData.data]
        );

        resetForm();
        alert(editEventId ? "Evento actualizado." : "Evento agregado.");
      } else {
        alert("Error al procesar la solicitud.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error interno del servidor.");
    }
  };

  // Eliminar un evento
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/events`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setEventsList((prev) => prev.filter((item) => item._id !== id));
        alert("Evento eliminado.");
      } else {
        alert("Error al eliminar el evento.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error interno del servidor.");
    }
  };

  // Editar evento existente
  const handleEdit = (item) => {
    setEditEventId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setScheduledDate(new Date(item.scheduledDate).toISOString().slice(0, 16));
  };

  // Reiniciar el formulario
  const resetForm = () => {
    setEditEventId(null);
    setTitle("");
    setDescription("");
    setScheduledDate("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador - Eventos</h1>
      <div className="flex flex-col space-y-4 mb-6">
        <input
          type="text"
          placeholder="Título del evento"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="datetime-local"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="mb-6">
        <QuillNoSSRWrapper
          ref={reactQuillRef}
          value={description}
          onChange={setDescription}
          modules={modules}
          theme="snow"
        />
      </div>

      <button
        onClick={handleAddOrEditEvent}
        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all"
      >
        {editEventId ? "Guardar Cambios" : "Agregar Evento"}
      </button>

      <h2 className="text-xl font-bold mt-8 mb-4">Eventos Existentes</h2>
      <ul className="space-y-4">
        {eventsList.map((event) => (
          <li key={event._id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-gray-600">
              Programado para:{" "}
              {new Date(event.scheduledDate).toLocaleString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              })}
            </p>
            <div
              className="text-gray-800 mb-4"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(event)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
