import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../db'
import { Document } from 'mongoose'
import Memo, { IMemo } from '../../db/models/memo'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case 'GET':
      const memos = await getMemos()
      res.status(200).json(memos)
      break
    case 'POST':
      await setMemos(req.body)
      res.status(200).json({ isSuccess: true })
      break
    default:
      break
  }
}

export const getMemos = async (): Promise<IMemo[]> => {
  try {
    await dbConnect()
    const memos = await Memo.find<IMemo>().sort({id: 'desc'})
    return JSON.parse(JSON.stringify(memos))
  }
  catch(err) {
    return []
  }
}

const setMemos = async (content: string) => {
  await dbConnect()
  const memos = await Memo.find<IMemo>().sort({id: 'desc'}).limit(1)
  const newMemo: IMemo = {
    id: memos.length === 0 ? 1 : memos[0].id + 1,
    content: content,
  }
  const memoDoc: Document = new Memo<IMemo>(newMemo)
  await memoDoc.save()
}
