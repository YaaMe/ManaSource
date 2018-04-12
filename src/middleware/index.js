const signer = require('./signer');
const { batchDispatchMiddleware } = require('./batch');
const test = store => next => action => {
  if (/#/.test(action.type)) {
    action.data.tx += '33333';
  }
  next(action);
};

module.exports = [
  test,
  batchDispatchMiddleware,
  signer
];
