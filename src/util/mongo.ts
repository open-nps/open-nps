import mongoose from 'mongoose';
import '~/model';

export const connectMongo = async (): Promise<typeof mongoose> =>
  await mongoose.connect(process.env.MONGO_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
