import connectDB from '@/lib/mongoose';
import Professional from '@/models/Professional';
import { authenticateUser, authorizeRoles } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Conectar a la base de datos
connectDB();

// GET: Obtener todos los profesionales (público)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region") || "";
    const canton = searchParams.get("canton") || "";

    // Crear filtro basado en los parámetros de consulta
    let filter = {};
    if (region) filter.region = region;
    if (canton) filter.canton = canton;

    const professionals = await Professional.find(filter).sort({ name: 1 }).exec();
    return NextResponse.json({ success: true, data: professionals });
  } catch (error) {
    console.error("Error al obtener los profesionales:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener los profesionales" },
      { status: 400 }
    );
  }
}

// POST: Agregar profesional (solo administrador)
export async function POST(req) {
  try {
    // Autenticar y autorizar al usuario
    const user = await authenticateUser(req);
    authorizeRoles(['admin'])(user);

    const { name, specialty, region, canton, description, contactInfo } = await req.json();

    const newProfessional = await Professional.create({
      name,
      specialty,
      region,
      canton,
      description,
      contactInfo,
    });

    return NextResponse.json({ success: true, data: newProfessional }, { status: 201 });
  } catch (error) {
    console.error('Error al agregar el profesional:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT: Editar profesional (solo administrador)
export async function PUT(req) {
  try {
    // Autenticar y autorizar al usuario
    const user = await authenticateUser(req);
    authorizeRoles(['admin'])(user);

    const { id, name, specialty, region, canton, description, contactInfo } = await req.json();

    const updatedProfessional = await Professional.findByIdAndUpdate(
      id,
      { name, specialty, region, canton, description, contactInfo },
      { new: true }
    );

    if (!updatedProfessional) {
      return NextResponse.json({ success: false, error: 'Profesional no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProfessional });
  } catch (error) {
    console.error('Error al actualizar el profesional:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE: Eliminar profesional (solo administrador)
export async function DELETE(req) {
  try {
    // Autenticar y autorizar al usuario
    const user = await authenticateUser(req);
    authorizeRoles(['admin'])(user);

    const { id } = await req.json();
    const deletedProfessional = await Professional.findByIdAndDelete(id);

    if (!deletedProfessional) {
      return NextResponse.json({ success: false, error: 'Profesional no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedProfessional });
  } catch (error) {
    console.error('Error al eliminar el profesional:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
