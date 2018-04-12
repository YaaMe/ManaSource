const reducers = require('reducer');
const middleware = require('middleware');
// const { batchDispatchMiddleware } = require('redux-batched-actions');
const { applyMiddleware, createStore } = require('redux');

function test(state, action) {
  console.log('>>>>test', action.type, action);
}


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
