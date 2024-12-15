import { SignJWT } from 'jose';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  await connectDB();

  const { username, password } = await req.json();
  const user = await User.findOne({ username });

  if (!user) {
    return NextResponse.json({ success: false, error: 'Credenciales Incorrectas' }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ success: false, error: 'Credenciales Incorrectas' }, { status: 401 });
  }

  // Crear el token JWT con el id y rol del usuario
  const token = await new SignJWT({ id: user._id, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(JWT_SECRET);

  // Configurar correctamente la cookie
  const response = NextResponse.json({ success: true, message: 'Login exitoso', role: user.role }); // Asegúrate de incluir "role"
  response.cookies.set('token', token, {
    httpOnly: true,
    maxAge: 3600, // 1 hora
    path: '/', // Disponible para toda la aplicación
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'lax', // Evita problemas de envío de cookies en navegadores
  });

  return response;
}