import mongoose from 'mongoose'

export interface IMemo {
  id: number,
  content: string,
}

const MemoSchema = new mongoose.Schema<IMemo>({
  id: Number,
  content: String
})

export default mongoose.models.Memo || mongoose.model<IMemo>('Memo', MemoSchema)
