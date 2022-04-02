import type { NextApiRequest, NextApiResponse } from 'next'
import MemoService from '../../service/MemoController'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const memoService = new MemoService()

  switch (req.method) {
    case 'GET':
      res.status(200).json(await memoService.getMemos())
      break
    case 'POST':
      res.status(200).json(await memoService.setMemo(req.body))
      break
    default:
      break
  }
}
