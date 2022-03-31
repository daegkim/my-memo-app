import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../db'
import Memo, { IMemo } from '../../db/models/memo'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IMemo[]>
) {
  await dbConnect()

  switch (req.method) {
    case 'GET':
      const memos = await getMemos();
      res.status(200).json(memos);
      break;
    case 'POST':
      break;
    default:
      break;
  }
}

export const getMemos = async (): Promise<IMemo[]> => {
  const memos = await Memo.find<IMemo>();
  // nextjs hydration 때문
  // https://helloinyong.tistory.com/315
  return JSON.parse(JSON.stringify(memos));
}
