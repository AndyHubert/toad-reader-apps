const initialState = {
  "1": {
    idpName: "ToadReader",
    domain: "demo.toadreader.com",
    idpExpire: null,
  },
}

export default function(state = initialState, action) {
    
  switch (action.type) {

    case "UPDATE_IDPS":
      return action.idps

  }

  return state
}