import mongoose from 'mongoose';

const SponsorSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Sponsor || mongoose.model('Sponsor', SponsorSchema);
