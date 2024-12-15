import { authenticateUser, authorizeRoles } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import News from '@/models/News';
import { NextResponse } from 'next/server';

// Conectar a la base de datos
connectDB();

// GET: Obtener todas las noticias (público)
export async function GET() {
  try {
    const news = await News.find({}).sort({ scheduledDate: -1 }).exec();
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error('Error al obtener las noticias:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener las noticias' }, { status: 400 });
  }
}

// POST: Agregar noticia (solo administrador o periodista)
export async function POST(req) {
  try {
    // Autenticar y autorizar al usuario
    const user = await authenticateUser(req);
    authorizeRoles(['admin', 'journalist'])(user);

    const { title, content, scheduledDate } = await req.json();

    const newNews = await News.create({
      title,
      content,
      scheduledDate,
      approved: false,
      rejected: false, // Inicializa como false al crear una noticia
      createdBy: user._id,
    });

    return NextResponse.json({ success: true, data: newNews }, { status: 201 });
  } catch (error) {
    console.error('Error al agregar la noticia:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT: Editar noticia (solo administrador o periodista)
// PUT: Editar noticia (solo administrador o periodista)
export async function PUT(req) {
  try {
    // Autenticar y autorizar al usuario
    const user = await authenticateUser(req);
    authorizeRoles(['admin', 'journalist'])(user);

    const { id, title, content, scheduledDate } = await req.json();

    // Si el usuario es un periodista, los cambios deben volver a estado "pendiente"
    const updateFields = {
      title,
      content,
      scheduledDate,
      approved: user.role === 'admin' ? true : false,
      rejected: false, // Siempre lo ponemos en false para permitir que la noticia entre en revisión.
    };

    const updatedNews = await News.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedNews) {
      return NextResponse.json({ success: false, error: 'Noticia no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedNews });
  } catch (error) {
    console.error('Error al actualizar la noticia:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}


// DELETE: Eliminar noticia (solo administrador)
export async function DELETE(req) {
  try {
    // Autenticar y autorizar al usuario
    const user = await authenticateUser(req);
    authorizeRoles(['admin'])(user);

    const { id } = await req.json();
    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return NextResponse.json({ success: false, error: 'Noticia no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedNews });
  } catch (error) {
    console.error('Error al eliminar la noticia:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
