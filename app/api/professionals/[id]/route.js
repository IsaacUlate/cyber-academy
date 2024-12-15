import connectDB from "@/lib/mongoose";
import Professional from "@/models/Professional";
import { NextResponse } from "next/server";

connectDB();

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const professional = await Professional.findById(id);
    if (!professional) {
      return NextResponse.json(
        { success: false, error: "Profesional no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: professional });
  } catch (error) {
    console.error("Error al obtener el profesional:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener el profesional" },
      { status: 400 }
    );
  }
}
