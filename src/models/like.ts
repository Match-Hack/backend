// mongoose model for 2 users to like each otherin a dating app
import mongoose, { Schema, Document } from 'mongoose';

interface Like extends Document {
  from: string,
  to: string
}

const likeSchema: Schema<Like> = new Schema<Like>({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  }
}, {
  collection: 'like' // Specify the collection name
});

export default mongoose.model<Like>('like', likeSchema);