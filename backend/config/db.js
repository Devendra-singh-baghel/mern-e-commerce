import mongoose from "mongoose";

const connectMongoDatabase = async () => {
  try {
    const data = await mongoose.connect(process.env.DB_URI);

    console.log(`MongoDB connected with server ${data.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // exit process if DB fails
  }
};

export { connectMongoDatabase };
