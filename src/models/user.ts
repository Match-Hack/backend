import mongoose, { Schema, Document } from 'mongoose';

interface User extends Document {
  lensProfile : string,
  hackathon : string;
  github : string;
  twitter: string;
  telegram: string;
  skills : string;
  bio : string 
}

const brandSchema: Schema<User> = new Schema<User>({
  lensProfile: {
    type: String,
    required: true
  },
  hackathon: {
    type: String,
    required: true
  },
  github: {
    type: String,
    required: true
  },
  twitter: {
    type: String,
    required: true
  },
  telegram: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  }
}, {
  collection: 'user' // Specify the collection name
});

export default mongoose.model<User>('user', brandSchema);