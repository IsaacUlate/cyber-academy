import { authenticateUser, authorizeRoles } from '@/lib/auth';
import connectDB from '@/lib/mongoose';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

// Conectar a la base de datos
connectDB();

// GET: Obtener todos los eventos (público)
export async function GET() {
  try {
    const events = await Event.find({}).sort({ scheduledDate: -1 }).exec();
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener los eventos' }, { status: 400 });
  }
}

// POST: Agregar evento (solo administrador)
export async function POST(req) {
  try {
    const user = await authenticateUser(req);
    authorizeRoles(['admin'])(user);

    const { title, description, scheduledDate } = await req.json();

    const newEvent = await Event.create({
      title,
      description,
      scheduledDate,
    });

    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error al agregar el evento:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT: Editar evento (solo administrador)
export async function PUT(req) {
  try {
    const user = await authenticateUser(req);
    authorizeRoles(['admin'])(user);

    const { id, title, description, scheduledDate } = await req.json();

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, description, scheduledDate },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json({ success: false, error: 'Evento no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error('Error al actualizar el evento:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE: Eliminar evento (solo administrador)
export async function DELETE(req) {
  try {
    const user = await authenticateUser(req);
    authorizeRoles(['admin'])(user);

    const { id } = await req.json();
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json({ success: false, error: 'Evento no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedEvent });
  } catch (error) {
    console.error('Error al eliminar el evento:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
