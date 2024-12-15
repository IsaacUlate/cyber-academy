import cron from 'node-cron';
import connectDB from './lib/mongoose'; // Asegúrate de que la ruta sea correcta
import Video from './models/Video';

const scheduleUploads = async () => {
  await connectDB();

  // Esta tarea se ejecuta cada minuto para verificar videos programados
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const videosToUpload = await Video.find({
        scheduledDate: { $lte: now }, // Videos cuya fecha de subida es menor o igual al momento actual
        uploaded: false,
      });

      for (const video of videosToUpload) {
        video.uploaded = true; // Marcar como subido
        await video.save();
        console.log(`Video ${video.title} ha sido publicado.`);
      }
    } catch (error) {
      console.error('Error al procesar las publicaciones programadas:', error);
    }
  });
};

scheduleUploads();
