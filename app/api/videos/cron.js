import connectDB from '@/lib/mongoose';
import Video from '@/models/Video';

export async function GET(req, res) {
  try {
    await connectDB();

    // Obtener todos los videos que deben ser publicados
    const now = new Date(); // Hora actual en UTC
    const videosToPublish = await Video.find({
      scheduledDate: { $lte: now }, // Videos cuya fecha ya pasó
      published: false, // Solo videos no publicados
    });

    // Marcar los videos como publicados
    for (const video of videosToPublish) {
      video.published = true;
      await video.save();
    }

    return res.status(200).json({ success: true, message: 'Videos actualizados.' });
  } catch (error) {
    console.error('Error en el cron job:', error);
    return res.status(500).json({ success: false, error: 'Error en el cron job.' });
  }
}
