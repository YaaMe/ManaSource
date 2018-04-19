const { CachingTransport } = require('api/transport');
const Web3 = require('web3');
const ParityConnector = require('api/parity');
const { TYPE } = require('actions/connect');

module.exports = (state = {}, action) => {
  switch (action.type) {
    case TYPE.INIT:
      if (state.connector) {
        console.warning('connector exists');
        return state;
      }
      const { url } = action.data;
      return new Web3(new Web3.providers.HttpProvider(url));
      // return {
      //   ...state,
      //   parityConnector: new ParityConnector(new CachingTransport(url))
      // };
    default: return state;
  };
};
