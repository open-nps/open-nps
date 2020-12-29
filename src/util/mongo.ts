import mongoose from 'mongoose';

export const connectMongo = async (): Promise<typeof mongoose> =>
  await mongoose.connect('mongodb://localhost:27017/open-nps', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
