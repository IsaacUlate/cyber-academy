"use client";
import Link from "next/link";

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <AdminCard
          title="Administrar Videos"
          description="Gestiona los videos del sitio."
          link="/admin/videos"
        />
        <AdminCard
          title="Administrar Noticias"
          description="Gestiona las noticias publicadas."
          link="/admin/noticias"
        />
        <AdminCard
          title="Panel de Revisión"
          description="Revisa y aprueba las noticias pendientes."
          link="/admin/revision"
        />
        <AdminCard
          title="Administrar Patrocinadores"
          description="Gestiona los patrocinadores del sitio."
          link="/admin/patrocinadores"
        />
        <AdminCard
          title="Administrar Profesionales"
          description="Gestiona la lista de profesionales de salud."
          link="/admin/profesionales"
        />

        <AdminCard
          title="Administrar Eventos"
          description="Gestiona la lista de eventos."
          link="/admin/eventos"
        />

        <AdminCard
          title="Administrar Usuarios"
          description="Gestión de Usuarios."
          link="/admin/usuarios"
        />
    
      </div>
    </div>
  );
}

function AdminCard({ title, description, link }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-200">
      <h2 className="text-2xl font-bold mb-2 text-center">{title}</h2>
      <p className="text-gray-600 mb-4 text-center">{description}</p>
      <div className="text-center">
        <Link href={link}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Ir a {title}
          </button>
        </Link>
      </div>
    </div>
  );
}
