"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";

// Importación dinámica del editor Quill para evitar problemas con SSR
const QuillNoSSRWrapper = dynamic(() => import("react-quill"), { ssr: false });

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const quillRef = useRef();

  // Configuración del editor Quill
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // Cargar patrocinadores desde la API
  useEffect(() => {
    const fetchSponsors = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  // Agregar patrocinador
  const handleAddSponsor = async () => {
    try {
      const response = await fetch("/api/sponsors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setSponsors((prev) => [...prev, updatedData.data]);
        setContent("");
        alert("Patrocinador agregado.");
      } else {
        alert("Error al agregar el patrocinador.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error interno del servidor.");
    }
  };

  // Editar patrocinador
  const handleEditSponsor = async () => {
    if (!selectedSponsor) return;

    try {
      const response = await fetch("/api/sponsors", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedSponsor._id, content }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setSponsors((prev) =>
          prev.map((sponsor) =>
            sponsor._id === updatedData.data._id ? updatedData.data : sponsor
          )
        );
        setContent("");
        setSelectedSponsor(null);
        alert("Patrocinador actualizado.");
      } else {
        alert("Error al actualizar el patrocinador.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error interno del servidor.");
    }
  };

  // Manejar la selección de patrocinador para editar
  const handleSelectSponsor = (sponsor) => {
    setSelectedSponsor(sponsor);
    setContent(sponsor.content);
  };

  // Eliminar patrocinador
  const handleDeleteSponsor = async (id) => {
    try {
      const response = await fetch("/api/sponsors", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setSponsors((prev) => prev.filter((sponsor) => sponsor._id !== id));
        alert("Patrocinador eliminado.");
      } else {
        alert("Error al eliminar el patrocinador.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error interno del servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador - Patrocinadores</h1>

      <div className="mb-6">
        <QuillNoSSRWrapper
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          theme="snow"
        />
      </div>

      <button
        onClick={selectedSponsor ? handleEditSponsor : handleAddSponsor}
        className={`${
          selectedSponsor ? "bg-blue-500" : "bg-green-500"
        } text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition-all`}
      >
        {selectedSponsor ? "Actualizar Patrocinador" : "Agregar Patrocinador"}
      </button>

      {selectedSponsor && (
        <button
          onClick={() => {
            setSelectedSponsor(null);
            setContent("");
          }}
          className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition-all"
        >
          Cancelar
        </button>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">Patrocinadores Existentes</h2>
      <ul className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-400">Cargando patrocinadores...</p>
        ) : sponsors.length > 0 ? (
          sponsors.map((sponsor) => (
            <li key={sponsor._id} className="p-4 bg-white rounded-lg shadow-md">
              <div
                className="text-gray-800"
                dangerouslySetInnerHTML={{ __html: sponsor.content }}
              />
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleSelectSponsor(sponsor)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteSponsor(sponsor._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No hay patrocinadores disponibles.</p>
        )}
      </ul>
    </div>
  );
}
