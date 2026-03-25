import mongoose from "mongoose";

const connectMongoDatabase = async () => {
  const data = await mongoose.connect(process.env.DB_URI);

  console.log(`MongoDB connected with server ${data.connection.host}`);
};

export { connectMongoDatabase };
