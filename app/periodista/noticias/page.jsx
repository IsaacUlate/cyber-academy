"use client";
import { useEffect, useState, useRef, useCallback } from "react";

export default function JournalistNewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [editNewsId, setEditNewsId] = useState(null);

  const editorRef = useRef();
  let debounceTimer;

  // Manejar cambios en el contenido del editor con debounce
  const handleInput = useCallback(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setContent(editorRef.current.innerHTML);
    }, 300);
  }, []);

  // Aplicar comandos de formato de texto
  const handleCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    handleInput(); // Actualiza el contenido
  }, [handleInput]);

  // Manejar inserción de audio
  const handleAudioUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const audioUrl = reader.result;
          insertAtCursor(`<audio controls src="${audioUrl}"></audio><div><br></div>`);
        };
        reader.readAsDataURL(file);
      }
    };
  }, []);

  // Insertar HTML en la posición del cursor
  const insertAtCursor = useCallback((html) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const fragment = range.createContextualFragment(html);
    range.insertNode(fragment);

    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    handleInput(); // Actualiza el contenido
  }, [handleInput]);

  // Manejar salto de línea con Enter
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      insertAtCursor("<div><br></div>");
    }
  }, [insertAtCursor]);

  // Cargar noticias desde la API
  const fetchNews = useCallback(async () => {
    try {
      const response = await fetch("/api/news");
      const data = await response.json();
      if (data.success) {
        setNewsList(data.data);
      } else {
        console.error("Error al obtener las noticias:", data.error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Agregar o editar una noticia
  const handleAddOrEditNews = useCallback(async () => {
    const method = editNewsId ? "PUT" : "POST";
    const urlPath = "/api/news";

    try {
      const updatedContent = editorRef.current ? editorRef.current.innerHTML : content;
      const scheduledDateUTC = new Date(scheduledDate).toISOString();

      const response = await fetch(urlPath, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: updatedContent,
          scheduledDate: scheduledDateUTC,
          id: editNewsId,
          approved: false,
          rejected: false,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setNewsList((prev) =>
          editNewsId
            ? prev.map((item) =>
                item._id === editNewsId ? updatedData.data : item
              )
            : [...prev, updatedData.data]
        );

        resetForm();
        alert(editNewsId ? "Noticia actualizada exitosamente." : "Noticia agregada y enviada a revisión.");
      } else {
        alert("Error al procesar la solicitud.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error interno del servidor.");
    }
  }, [content, editNewsId, scheduledDate, title]);

  // Reiniciar el formulario
  const resetForm = useCallback(() => {
    setEditNewsId(null);
    setTitle("");
    setContent("");
    setScheduledDate("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  }, []);

  // Eliminar una noticia
  const handleDelete = useCallback(async (id) => {
    try {
      const response = await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setNewsList((prev) => prev.filter((item) => item._id !== id));
        alert("Noticia eliminada.");
      } else {
        alert("Error al eliminar la noticia.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }, []);

  // Editar una noticia existente
  const handleEdit = useCallback((item) => {
    setEditNewsId(item._id);
    setTitle(item.title);
    setContent(item.content);
    if (editorRef.current) {
      editorRef.current.innerHTML = item.content;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Periodista - Noticias</h1>
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="Título de la noticia"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded w-1/2"
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
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 mb-2">
          <button
            onClick={() => handleCommand("bold")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 hover:text-gray-700"
          >
            Negrita
          </button>
          <button
            onClick={() => handleCommand("italic")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 hover:text-gray-700"
          >
            Cursiva
          </button>
          <button
            onClick={() => handleCommand("underline")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 hover:text-gray-700"
          >
            Subrayar
          </button>
          <button
            onClick={() => handleCommand("strikeThrough")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 hover:text-gray-700"
          >
            Tachado
          </button>
          <button
            onClick={handleAudioUpload}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 hover:text-gray-700"
          >
            Insertar Audio
          </button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          className="border p-2 min-h-[300px] bg-white rounded overflow-auto"
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            direction: "ltr",
          }}
        ></div>
      </div>

      <button
        onClick={handleAddOrEditNews}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {editNewsId ? "Guardar Cambios y Enviar a Revisión" : "Agregar Noticia"}
      </button>

      <h2 className="text-xl font-bold mt-8 mb-2">Noticias Existentes</h2>
      <ul>
        {newsList.map((news) => (
          <li key={news._id} className="mb-2">
            <h3 className="text-lg font-semibold">{news.title}</h3>
            <p className="text-gray-600">
              Programado para:{" "}
              {new Date(news.scheduledDate).toLocaleString("es-ES", {
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
              className="text-gray-800"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(news)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(news._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
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
