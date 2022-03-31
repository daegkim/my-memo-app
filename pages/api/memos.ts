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
  await dbConnect()
  const memos = await Memo.find<IMemo>()
  // nextjs hydration 때문
  // https://helloinyong.tistory.com/315
  return JSON.parse(JSON.stringify(memos))
}

const setMemos = async (content: string) => {
  await dbConnect()
  const memo: Document = new Memo<IMemo>({ id: 1, content })
  await memo.save()
}
