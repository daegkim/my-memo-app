import mongoose from 'mongoose'

export interface IMemo {
  id: number,
  content: string,
}

const MemoSchema = new mongoose.Schema({
  id: Number,
  content: String
});

export default mongoose.models.Memo || mongoose.model('Memo', MemoSchema);
