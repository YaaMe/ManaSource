const reducers = require('reducers');
const middleware = require('middlewares');
// const { batchDispatchMiddleware } = require('redux-batched-actions');
const { applyMiddleware, createStore } = require('redux');

function test(state, action) {
  console.log('>>>>test', action.type, action);
}

const firstMiddleware = store => next => action => {
  console.log('first middleware');
  next(action);
};

const secondMiddleware = store => next => action => {
  console.log('second middleware');
  next(action);
};

const options = {
  'first': firstMiddleware,
  'second': secondMiddleware
};

const higherOrderMiddleware = options => store => next => action => {
  Object.keys(options).forEach(key => action[`$${key}`] ? options[key]);
    
};

module.exports = createStore(
  reducers,
  applyMiddleware(
//    batchDispatchMiddleware,
    ...middleware
  )
);
// module.exports = applyMiddleware(
//   ...middleware
// )(
//   createStore
// )(
//   enableBatching(test)
// );
