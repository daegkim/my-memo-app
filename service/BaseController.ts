export interface IResponse<T> {
  isSuccess: boolean,
  data?: T,
  errMsg?: string,
}

class BaseService<T> {
  createSuccessResponseWithData = (data: T): IResponse<T> => {
    return {
      isSuccess: true,
      data: data,
    }
  }

  createSuccessResponse= (): IResponse<T> => {
    return {
      isSuccess: true,
    }
  }

  createFailResponse = (errMsg: string): IResponse<T> => {
    return {
      isSuccess: false,
      errMsg: errMsg,
    }
  }
}

export default BaseService