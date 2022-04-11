import dbConnect from '../db'
import { Document, startSession } from 'mongoose'
import Memo, { IMemo } from '../db/models/memo'

interface IResult {
  isSuccess: boolean,
  errMsg?: string,
  data?: IMemo[],
}

class MemoRepository {
  getMemos = async (): Promise<IResult> => {
    try {
      await dbConnect()
      const memos = await Memo.find<IMemo>().sort({ id: 'desc' })
      return {
        isSuccess: true,
        data: memos,
      }
    }
    catch (err) {
      const errResult: IResult = {
        isSuccess: false,
        errMsg: 'err',
      }
      if (err instanceof Error) {
        errResult.errMsg = err.message
      }
      return errResult
    }
  }

  setMemo = async (content: string): Promise<IResult> => {
    try {
      await dbConnect()
      const memoWithTheLargestId = await Memo.find<IMemo>().sort({ id: 'desc' }).limit(1)
      const newMemo: Document = new Memo<IMemo>({
        id: memoWithTheLargestId.length === 0 ? 1 : memoWithTheLargestId[0].id + 1,
        content: content,
      })
      await newMemo.save()
      return { isSuccess: true }
    }
    catch (err) {
      const errResult: IResult = {
        isSuccess: false,
        errMsg: 'err',
      }
      if (err instanceof Error) {
        errResult.errMsg = err.message
      }
      return errResult
    }
  }

  deleteMemos = async (deleteMemoIds: number[]): Promise<IResult> => {
    try {
      await dbConnect()
      const session = await startSession()
      session.startTransaction()
      for(const id of deleteMemoIds) {
        const result = await Memo.findOneAndDelete({id: id})
      }
      await session.commitTransaction()
      session.endSession()
      return { isSuccess: true }
    }
    catch (err) {
      const errResult: IResult = {
        isSuccess: false,
        errMsg: 'err',
      }
      if (err instanceof Error) {
        errResult.errMsg = err.message
      }
      return errResult
    }
  }
}

export default MemoRepository
