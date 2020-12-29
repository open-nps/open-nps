import mongoose from 'mongoose';
import '~/model';

export const connectMongo = async (): Promise<typeof mongoose> =>
  await mongoose.connect('mongodb://localhost:27017/open-nps', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
