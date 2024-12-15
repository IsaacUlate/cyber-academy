import mongoose from 'mongoose';

// Definimos el esquema para que las fechas se almacenen en UTC
const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  scheduledDate: { type: Date, required: true }, // Fechas en UTC
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
});

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
