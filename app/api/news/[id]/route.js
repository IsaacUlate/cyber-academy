import connectDB from '@/lib/mongoose';
import News from '@/models/News';
import { NextResponse } from 'next/server';

// Conectar a la base de datos
connectDB();

// GET: Obtener una noticia por ID
export async function GET(req, { params }) {
  try {
    const { id } = params; // Obtén el ID de la noticia desde los parámetros de la URL

    // Busca la noticia por su ID
    const news = await News.findById(id);
    if (!news) {
      return NextResponse.json({ success: false, error: 'Noticia no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error('Error al obtener la noticia:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener la noticia' }, { status: 400 });
  }
}
