import { getIdsFromAccountId } from "../../utils/toolbox"

const initialState = {}

export default function(state, action) {

  const newState = {
    ...state,
    readingRecordsByAccountId: {...state.readingRecordsByAccountId},
  }

  switch (action.type) {

    case "END_RECORD_READING":
      if(!state.currentReadingRecord) {
        console.log('ERROR: Tried ending non-existant reading record.')
        return state
      }

      if(
        !state.currentReadingRecord.bookId
        || !state.currentReadingRecord.spineIdRef
        || !state.currentReadingRecord.startTime
      ) {
        console.log('ERROR: Tried ending invalid reading record.', state.currentReadingRecord)
        
        newState.currentReadingRecord = null
        return newState
      }

      const book = state.books[state.currentReadingRecord.bookId]
      const endTime = Date.now()

      if(book && endTime - state.currentReadingRecord.startTime > 5*1000) {
        Object.keys(book.accounts || {}).forEach(accountId => {
          const { idpId } = getIdsFromAccountId(accountId)
          const idp = state.idps[idpId]
  
          if(!(idp || {}).xapiOn && !(idp || {}).readingSessionsOn) return
  
          newState.readingRecordsByAccountId[accountId] = [
            ...(newState.readingRecordsByAccountId[accountId] || []),
            {
              ...state.currentReadingRecord,
              endTime,
            },
          ]
        })
      }

      newState.currentReadingRecord = null

      return newState
      
  }

  return state
}