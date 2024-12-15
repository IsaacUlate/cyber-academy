import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false, // Por defecto, las noticias no están aprobadas
  },
  rejected: {
    type: Boolean,
    default: false, // Por defecto, las noticias no están rechazadas
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.News || mongoose.model('News', NewsSchema);
