import mongoose from 'mongoose';

const ProfessionalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  canton: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },
});

const Professional = mongoose.models.Professional || mongoose.model('Professional', ProfessionalSchema);

export default Professional;
