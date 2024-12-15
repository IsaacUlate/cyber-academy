import { authenticateUser, authorizeRoles } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import News from '@/models/News';
import { NextResponse } from 'next/server';

// Conectar a la base de datos
connectDB();

// PUT: Aprobar o rechazar noticia (solo administrador)
export async function PUT(req) {
  try {
    // Autenticar y autorizar al usuario
    const user = await authenticateUser(req);
    authorizeRoles(['admin'])(user);

    const { id, approved } = await req.json();

    // Actualiza los campos `approved` y `rejected`
    const updateFields = {
      approved,
      rejected: !approved, // Si no está aprobado, se marca como rechazado
    };

    const updatedNews = await News.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedNews) {
      return NextResponse.json({ success: false, error: 'Noticia no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedNews });
  } catch (error) {
    console.error('Error al aprobar/rechazar la noticia:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
