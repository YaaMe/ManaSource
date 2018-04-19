const { CachingTransport } = require('api/transport');
const ParityConnector = require('api/parity');
const { TYPE } = require('actions/compiler');

module.exports = (state, action) => {
  switch (action.type) {
    case TYPE.INIT:
      if (state.connector) {
        console.warning('connector exists');
        return state;
      }
      const { url } = action.data;
      return new ParityConnector(new CachingTransport(url));
    default: return state;
  };
};
