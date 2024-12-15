"use client";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  // Cargar usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          console.error("Error al obtener los usuarios:", data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Agregar usuario
  const handleAddUser = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUsers((prev) => [...prev, updatedData.data]);
        setUsername("");
        setPassword("");
        setRole("user");
        alert("Usuario agregado.");
      } else {
        alert("Error al agregar el usuario.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error interno del servidor.");
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
        alert("Usuario eliminado.");
      } else {
        alert("Error al eliminar el usuario.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error interno del servidor.");
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "journalist":
        return "Periodista";
      case "user":
        return "Usuario";
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador - Usuarios</h1>

      <div className="mb-6">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nombre de usuario"
          className="block w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="block w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="block w-full mb-4 p-2 border border-gray-300 rounded"
        >
          <option value="user">Usuario</option>
          <option value="journalist">Periodista</option>
          <option value="admin">Administrador</option>
        </select>

        <button
          onClick={handleAddUser}
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all"
        >
          Agregar Usuario
        </button>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Usuarios Existentes</h2>
      <ul className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-400">Cargando usuarios...</p>
        ) : users.length > 0 ? (
          users.map((user) => (
            <li key={user._id} className="p-4 bg-white rounded-lg shadow-md">
              <p>
                <strong>Nombre:</strong> {user.username}
              </p>
              <p>
              <strong>Rol:</strong> {getRoleLabel(user.role)}
              </p>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all"
              >
                Eliminar
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No hay usuarios disponibles.</p>
        )}
      </ul>
    </div>
  );
}
