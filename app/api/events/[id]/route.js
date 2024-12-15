import connectDB from '@/lib/mongoose';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

// Conectar a la base de datos
connectDB();

// GET: Obtener un evento por ID
export async function GET(req, { params }) {
  try {
    const { id } = params; // Obtén el ID del evento desde los parámetros de la URL

    // Busca el evento por su ID
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error('Error al obtener el evento:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener el evento' },
      { status: 400 }
    );
  }
}
