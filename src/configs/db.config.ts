import mongoose from 'mongoose';
import 'dotenv/config'

const MONGODB_URI = process.env.MONGODB_URI as string

mongoose.connection.on('connected', () =>
  console.log(`Connected to the mongo database successfully`),
);

mongoose.connection.on('error', (err) =>
  console.log(`Database connection error: ${err} \n`),
); 

const connectToDb = async () => {
  await mongoose.connect(MONGODB_URI);
};

export default connectToDb;
