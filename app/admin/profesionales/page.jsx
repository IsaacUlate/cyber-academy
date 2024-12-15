"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";

// Importación dinámica del editor Quill para evitar problemas con SSR
const QuillNoSSRWrapper = dynamic(() => import("react-quill"), { ssr: false });

export default function AdminProfessionalsPage() {
  const [professionalsList, setProfessionalsList] = useState([]);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [region, setRegion] = useState("");
  const [canton, setCanton] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [description, setDescription] = useState("");
  const [editProfessionalId, setEditProfessionalId] = useState(null);
  const reactQuillRef = useRef();

  // Configuración del editor Quill
  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["link", "image"],
        ["clean"],
      ],
    },
  };

  // Cargar profesionales desde la API
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await fetch("/api/professionals");
        const data = await response.json();
        if (data.success) {
          setProfessionalsList(data.data);
        } else {
          console.error("Error al obtener los profesionales:", data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    fetchProfessionals();
  }, []);

  // Provincias y cantones
  const regions = [
    "San José",
    "Alajuela",
    "Cartago",
    "Heredia",
    "Guanacaste",
    "Puntarenas",
    "Limón",
  ];

  const cantonsByRegion = {
    "San José": [
      "San José",
      "Escazú",
      "Desamparados",
      "Puriscal",
      "Tarrazú",
      "Aserrí",
      "Mora",
      "Goicoechea",
      "Santa Ana",
      "Alajuelita",
      "Vázquez de Coronado",
      "Acosta",
      "Tibás",
      "Moravia",
      "Montes de Oca",
      "Turrubares",
      "Dota",
      "Curridabat",
      "Pérez Zeledón",
      "León Cortés"
    ],
    "Alajuela": [
      "Alajuela",
      "San Ramón",
      "Grecia",
      "San Mateo",
      "Atenas",
      "Naranjo",
      "Palmares",
      "Poás",
      "Orotina",
      "San Carlos",
      "Zarcero",
      "Sarchí",
      "Upala",
      "Los Chiles",
      "Guatuso",
      "Río Cuarto"
    ],
    "Cartago": [
      "Cartago",
      "Paraíso",
      "La Unión",
      "Jiménez",
      "Turrialba",
      "Alvarado",
      "Oreamuno",
      "El Guarco"
    ],
    "Heredia": [
      "Heredia",
      "Barva",
      "Santo Domingo",
      "Santa Bárbara",
      "San Rafael",
      "San Isidro",
      "Belén",
      "Flores",
      "San Pablo",
      "Sarapiquí"
    ],
    "Guanacaste": [
      "Liberia",
      "Nicoya",
      "Santa Cruz",
      "Bagaces",
      "Carrillo",
      "Cañas",
      "Abangares",
      "Tilarán",
      "Nandayure",
      "La Cruz",
      "Hojancha"
    ],
    "Puntarenas": [
      "Puntarenas",
      "Esparza",
      "Buenos Aires",
      "Montes de Oro",
      "Osa",
      "Quepos",
      "Golfito",
      "Coto Brus",
      "Parrita",
      "Corredores",
      "Garabito"
    ],
    "Limón": [
      "Limón",
      "Pococí",
      "Siquirres",
      "Talamanca",
      "Matina",
      "Guácimo"
    ]
  };

  // Agregar o editar un profesional
  const handleAddOrEditProfessional = async () => {
    const method = editProfessionalId ? "PUT" : "POST";
    const urlPath = editProfessionalId ? `/api/professionals` : "/api/professionals";

    try {
      const response = await fetch(urlPath, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          specialty,
          region,
          canton,
          contactInfo,
          description,
          id: editProfessionalId,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfessionalsList((prev) =>
          editProfessionalId
            ? prev.map((item) =>
                item._id === editProfessionalId ? updatedData.data : item
              )
            : [...prev, updatedData.data]
        );

        resetForm();
        alert(editProfessionalId ? "Profesional actualizado." : "Profesional agregado.");
      } else {
        alert("Error al procesar la solicitud.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error interno del servidor.");
    }
  };

  // Eliminar un profesional
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/professionals`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setProfessionalsList((prev) => prev.filter((item) => item._id !== id));
        alert("Profesional eliminado.");
      } else {
        alert("Error al eliminar el profesional.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error interno del servidor.");
    }
  };

  // Editar profesional existente
  const handleEdit = (item) => {
    setEditProfessionalId(item._id);
    setName(item.name);
    setSpecialty(item.specialty);
    setRegion(item.region);
    setCanton(item.canton);
    setContactInfo(item.contactInfo);
    setDescription(item.description);
  };

  // Reiniciar el formulario
  const resetForm = () => {
    setEditProfessionalId(null);
    setName("");
    setSpecialty("");
    setRegion("");
    setCanton("");
    setContactInfo("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador - Profesionales</h1>
      <div className="flex flex-col space-y-4 mb-6">
        <input
          type="text"
          placeholder="Nombre del profesional"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Especialidad"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
              Provincia
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setCanton("");
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecciona una provincia</option>
              {regions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="canton" className="block text-sm font-medium text-gray-700">
              Cantón
            </label>
            <select
              id="canton"
              value={canton}
              onChange={(e) => setCanton(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              disabled={!region}
            >
              <option value="">Selecciona un cantón</option>
              {region &&
                cantonsByRegion[region].map((can) => (
                  <option key={can} value={can}>
                    {can}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <input
          type="text"
          placeholder="Contacto (Teléfono/Email)"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
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
        onClick={handleAddOrEditProfessional}
        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all"
      >
        {editProfessionalId ? "Guardar Cambios" : "Agregar Profesional"}
      </button>

      <h2 className="text-xl font-bold mt-8 mb-4">Profesionales Existentes</h2>
      <ul className="space-y-4">
        {professionalsList.map((professional) => (
          <li key={professional._id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{professional.name}</h3>
            <p className="text-gray-600">Especialidad: {professional.specialty}</p>
            <p className="text-gray-600">Región: {professional.region}, Cantón: {professional.canton}</p>
            <p className="text-gray-600">Contacto: {professional.contactInfo}</p>
            <div className="text-gray-800 mb-4" dangerouslySetInnerHTML={{ __html: professional.description }} />
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(professional)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(professional._id)}
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
