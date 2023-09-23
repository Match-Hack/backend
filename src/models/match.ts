import mongoose, { Schema, Document } from 'mongoose';

interface Match extends Document {
   lens1: string,
   lens2: string
 }

const matchSchema: Schema<Match> = new Schema<Match>({
   lens1: {
     type: String,
     required: true
   },
   lens2: {
     type: String,
     required: true
   }
 }, {
   collection: 'match' // Specify the collection name
});

export default mongoose.model<Match>('match', matchSchema);
