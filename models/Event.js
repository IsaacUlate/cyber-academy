import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true, // Crea automáticamente los campos createdAt y updatedAt
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
