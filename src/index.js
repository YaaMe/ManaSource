const store = require('store');

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

const main = async () => {
  console.log('run main');
  const connect = {
    type: 'CONNECT',
    data: {
      url: PARITY_WS
    }
  };
  const action = {
    type: 'TEST',
    data: {}
  };
  console.log('dispatch action');
  store.dispatch(connect);
  store.dispatch({
    type: '@#sign',
    data: {
      tx: '0x000'
    }
  });
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
