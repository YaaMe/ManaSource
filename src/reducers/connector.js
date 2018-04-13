const { CachingTransport } = require('api/transport');
const ParityConnector = require('api/parity');
const { TYPE } = require('actions/connect');

module.exports = (state = {}, action) => {
  console.log('-------=>', action.type);
  switch (action.type) {
  case TYPE.INIT:
    if (state.connector) {
      console.warning('connector exists');
      return state;
    }
    const { url } = action.data;
    return {
      ...state,
      parityConnector: new ParityConnector(new CachingTransport(url))
    };
  default: return state;
  };
};
