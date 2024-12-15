import connectDB from '@/lib/mongoose';
import Sponsor from '@/models/Sponsor';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/apiAuth';

// Conectar a la base de datos
connectDB();

// GET: Obtener todos los patrocinadores (Accesible para todos)
export async function GET() {
  try {
    const sponsors = await Sponsor.find({}).sort({ createdAt: -1 }).exec();
    return NextResponse.json({ success: true, data: sponsors });
  } catch (error) {
    console.error('Error al obtener los patrocinadores:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener los patrocinadores' }, { status: 400 });
  }
}

// POST: Agregar patrocinador (solo administrador)
export async function POST(req) {
  const authResult = await verifyAuth(req, ['admin']);
  if (!authResult.success) {
    return NextResponse.json({ success: false, error: authResult.message }, { status: 401 });
  }

  try {
    const { content } = await req.json();

    const newSponsor = await Sponsor.create({
      content,
    });

    return NextResponse.json({ success: true, data: newSponsor }, { status: 201 });
  } catch (error) {
    console.error('Error al agregar el patrocinador:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE: Eliminar patrocinador (solo administrador)
export async function DELETE(req) {
  const authResult = await verifyAuth(req, ['admin']);
  if (!authResult.success) {
    return NextResponse.json({ success: false, error: authResult.message }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    const deletedSponsor = await Sponsor.findByIdAndDelete(id);

    if (!deletedSponsor) {
      return NextResponse.json({ success: false, error: 'Patrocinador no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedSponsor });
  } catch (error) {
    console.error('Error al eliminar el patrocinador:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT: Actualizar patrocinador (solo administrador)
export async function PUT(req) {
  const authResult = await verifyAuth(req, ['admin']);
  if (!authResult.success) {
    return NextResponse.json({ success: false, error: authResult.message }, { status: 401 });
  }

  try {
    const { id, content } = await req.json();
    const updatedSponsor = await Sponsor.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    if (!updatedSponsor) {
      return NextResponse.json({ success: false, error: 'Patrocinador no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedSponsor });
  } catch (error) {
    console.error('Error al actualizar el patrocinador:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
