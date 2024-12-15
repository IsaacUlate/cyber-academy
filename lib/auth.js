// lib/auth.js
import jwt from 'jsonwebtoken';
import User from '@/models/User';

export const authenticateUser = async (req) => {
  const token = req.cookies.get('token')?.value; // Asegúrate de obtener el token
  if (!token) throw new Error('Acceso denegado');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error('Usuario no encontrado');

  return user;
};

export const authorizeRoles = (roles) => (user) => {
  if (!roles.includes(user.role)) {
    throw new Error('No tienes permisos para acceder a esta acción');
  }
};
