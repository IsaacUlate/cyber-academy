import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { verifyAuth } from '@/lib/apiAuth';

// Conectar a la base de datos
connectDB();

// GET: Obtener todos los usuarios (Solo para administradores)
export async function GET(req) {
  const authResult = await verifyAuth(req, ['admin']);
  if (!authResult.success) {
    return NextResponse.json({ success: false, error: authResult.message }, { status: 401 });
  }

  try {
    const users = await User.find({}).sort({ createdAt: -1 }).exec();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener los usuarios' }, { status: 400 });
  }
}

// POST: Crear un usuario (Solo para administradores)
export async function POST(req) {
  const authResult = await verifyAuth(req, ['admin']);
  if (!authResult.success) {
    return NextResponse.json({ success: false, error: authResult.message }, { status: 401 });
  }

  try {
    const { username, password, role } = await req.json();

    // Validación del rol
    if (!['admin', 'journalist', 'user'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Rol inválido' }, { status: 400 });
    }

    // Verificar si ya existe un usuario con el mismo nombre de usuario
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'El nombre de usuario ya existe' }, { status: 400 });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT: Actualizar un usuario (Solo para administradores)
export async function PUT(req) {
  const authResult = await verifyAuth(req, ['admin']);
  if (!authResult.success) {
    return NextResponse.json({ success: false, error: authResult.message }, { status: 401 });
  }

  try {
    const { id, username, password, role } = await req.json();

    // Validación del rol
    if (!['admin', 'journalist', 'user'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Rol inválido' }, { status: 400 });
    }

    // Actualizar los datos del usuario
    const updateData = { username, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE: Eliminar un usuario (Solo para administradores)
export async function DELETE(req) {
  const authResult = await verifyAuth(req, ['admin']);
  if (!authResult.success) {
    return NextResponse.json({ success: false, error: authResult.message }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedUser });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
