"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0); // Línea añadida
  const [isBlocked, setIsBlocked] = useState(false); // Línea añadida para el estado de bloqueo
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      alert('Demasiados intentos fallidos. Por favor, intenta de nuevo en 5 minutos.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('Login exitoso');

        // Restablece los intentos después de un inicio de sesión exitoso
        setLoginAttempts(0); // Línea añadida para restablecer intentos

        // Redirigir según el rol
        if (data.role === 'journalist') {
          router.push('/periodista/noticias'); // Redirige a la página de noticias para periodistas
        } else if (data.role === 'admin') {
          router.push('/admin'); // Redirige al panel de administración
        } else {
          alert('Rol desconocido');
        }
      } else {
        alert(data.error || 'Error en el inicio de sesión');
        
        // Incrementar intentos fallidos
        setLoginAttempts((prev) => prev + 1); // Línea añadida para incrementar intentos

        // Verificar si se han realizado 3 intentos fallidos
        if (loginAttempts + 1 >= 3) {
          setIsBlocked(true); // Bloquea después de 3 intentos

          // Desbloquear después de 5 minutos
          setTimeout(() => {
            setIsBlocked(false);
            setLoginAttempts(0); // Restablecer intentos después del bloqueo
          }, 5 * 60 * 1000);
        }
      }
    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión:', error);
      alert('Hubo un error. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isBlocked} // Deshabilita el botón si está bloqueado
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}
