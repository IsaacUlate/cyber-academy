import connectDB from "@/lib/mongoose";
import Video from "@/models/Video";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/apiAuth";

// GET: Obtener todos los videos (Accesible para todos) d
export async function GET() {
  await connectDB();
  try {
    const videos = await Video.find({});
    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    console.error("Error al obtener los videos:", error);
    return NextResponse.json({ success: false, error: "Error al obtener los videos" }, { status: 400 });
  }
}

// POST: Agregar un video (solo administrador)
export async function POST(req) {
  const authResult = await verifyAuth(req, ['admin']);
  if (!authResult.success) {
    return NextResponse.json({ success: false, error: authResult.message }, { status: 401 });
  }

  await connectDB();
  try {
    const { title, url, scheduledDate } = await req.json();
    const newVideo = new Video({ title, url, scheduledDate, published: false });
    await newVideo.save();
    return NextResponse.json({ success: true, data: newVideo });
  } catch (error) {
    console.error("Error al agregar el video:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT: Actualizar un video (solo administrador)
export async function PUT(req) {
  const authResult = await verifyAuth(req, ['admin']);
  if (!authResult.success) {
    return NextResponse.json({ success: false, error: authResult.message }, { status: 401 });
  }

  await connectDB();
  try {
    const { id, title, url, scheduledDate } = await req.json();
    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { title, url, scheduledDate },
      { new: true }
    );

    if (!updatedVideo) {
      return NextResponse.json({ success: false, error: "Video no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedVideo });
  } catch (error) {
    console.error("Error al actualizar el video:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE: Eliminar un video (solo administrador)
export async function DELETE(req) {
  const authResult = await verifyAuth(req, ['admin']);
  if (!authResult.success) {
    return NextResponse.json({ success: false, error: authResult.message }, { status: 401 });
  }

  await connectDB();
  try {
    const { id } = await req.json();
    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return NextResponse.json({ success: false, error: "Video no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedVideo });
  } catch (error) {
    console.error("Error al eliminar el video:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
