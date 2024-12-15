import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("MongoDB ya conectado");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw error;
  }
};

export default connectDB;
