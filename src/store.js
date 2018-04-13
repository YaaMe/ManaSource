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

const higherOrderMiddleware = services => store => next => action => {
  let chain = [];
  console.log('higher onder middleware');
  
  chain = [firstMiddleware, secondMiddleware];
  return chain;
};

module.exports = createStore(
  reducers,
  applyMiddleware(
    //    batchDispatchMiddleware,
    higherOrderMiddleware(options),
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
