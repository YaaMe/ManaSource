const { CachingTransport } = require('api/transport');
const ParityConnector = require('api/parity');

module.exports = (state = {}, action) => {
  switch (action.type) {
  case 'CONNECT':
    if (state.connector) {
      console.warning('connector exists');
      return state;
    }
    const { url } = action.data;
    return {
      ...state,
      connector: new ParityConnector(new CachingTransport(url))
    };
  default: return state;
  };
};
