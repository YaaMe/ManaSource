const { CachingTransport } = require('api/transport');
const ParityConnector = require('api/parity');
const { hex2int } = require('utils');
const { createStore, applyMiddleware, combineReducers } = require('redux');

const PARITY_WS = 'ws://127.0.0.1:8546/';
const testMiddleware = store => next => action => {
  console.log('test middleware');
  return next(action);
};

const getMiddleware = config => {
  return store => next => action => {
    console.log(config);
    console.log('another middleware');
    return next(action);
  };
};

const test = (state = {}, action) => {
  console.log('reducer');
  if (/@/.test(action.type)) {
    console.log(action.type);
  }
  switch (action.type) {
  case 'CONNECT':
    if (state.connector) {
      console.warning('connector exists');
      return state;
    }
    return {
      ...state,
      connector: new ParityConnector(new CachingTransport(PARITY_WS))
    };
  default: return state;
  };
};
const reducers = combineReducers({
  test
});
const main = async () => {
  console.log('run main');
  const store = applyMiddleware(
    getMiddleware('testConfig')
  )(createStore)(reducers);
  const connect = {
    type: 'CONNECT'
  };
  const action = {
    type: 'TEST',
    data: {}
  };
  console.log('dispatch action');
  store.dispatch(connect);
  store.dispatch({ type: '@sign' });
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
