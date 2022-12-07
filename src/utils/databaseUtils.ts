import { MongooseError } from "mongoose"

const MongooseErrorMessagePatterns = [
  {
    description: 'Operation Timeout',
    regExp: /Operation `.*` buffering timed out after \d*ms/,
    res: {
      statusCode: 503,
      responseJson: {
        error: 'resource timed out'
      }
    }
  }
]

const parseDatabaseError = (err: MongooseError): { statusCode: number, responseJson: Record<string, string>} => {
  for(const pattern of MongooseErrorMessagePatterns) {
    if(pattern.regExp.test(err.message)) {
      return pattern.res
    }
  }
  return {
    statusCode: 500,
    responseJson: {
      error: 'unknown database error'
    }
  }
}

const filterDatabaseData = (data) => {
  if(Array.isArray(data)) {
    return data.map(d => {
      d.__v = undefined
      return d
    })
  } else {
    data.__v = undefined
    return data
  }
}

export { 
  parseDatabaseError,
  filterDatabaseData
}