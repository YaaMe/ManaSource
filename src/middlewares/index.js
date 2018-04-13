const signer = require('./signer');
const { batchDispatchMiddleware } = require('./batch');
const compiler = require('./compiler');
const test = store => next => action => {
  console.log(store);
  console.log('test middleware');
  if (/#/.test(action.type)) {
    action.data.tx += '33333';
  }
  next(action);
};

module.exports = [
  test,
  batchDispatchMiddleware,
  compiler,
  signer
];
