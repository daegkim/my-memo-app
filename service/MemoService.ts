import { IMemo } from '../db/models/memo'
import BaseService, { IResponse } from './BaseService'
import MemoRepository from '../repository/MemoRepository'

class MemoService extends BaseService<IMemo[]> {
  memoRepository: MemoRepository

  constructor() {
    super()
    this.memoRepository = new MemoRepository()
  }

  getMemos = async (): Promise<IResponse<IMemo[]>> => {
    try {
      const result = await this.memoRepository.getMemos()
      if (result.isSuccess) {
        const memos: IMemo[] = JSON.parse(JSON.stringify(result.data))
        return this.createSuccessResponseWithData(memos)
      } else {
        return this.createFailResponse(result.errMsg || 'err')
      }
    }
    catch (err) {
      if (err instanceof Error) {
        return this.createFailResponse(err.message)
      } else {
        return this.createFailResponse('err')
      }
    }
  }

  setMemo = async (content: string): Promise<IResponse<IMemo[]>> => {
    try {
      const result = await this.memoRepository.setMemo(content)

      if (result.isSuccess) {
        return this.createSuccessResponse()
      } else {
        return this.createFailResponse(result.errMsg || 'err')
      }
    }
    catch (err) {
      if (err instanceof Error) {
        return this.createFailResponse(err.message)
      }
      else {
        return this.createFailResponse('err')
      }
    }
  }

  deleteMemos = async (deleteMemoIds: string): Promise<IResponse<IMemo[]>> => {
    try {
      const result = await this.memoRepository.deleteMemos(JSON.parse(deleteMemoIds))

      if (result.isSuccess) {
        return this.createSuccessResponse()
      } else {
        return this.createFailResponse(result.errMsg || 'err')
      }
    }
    catch (err) {
      if (err instanceof Error) {
        return this.createFailResponse(err.message)
      }
      else {
        return this.createFailResponse('err')
      }
    }
  }
}

export default MemoService
