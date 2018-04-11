const reducers = require('reducer');
const middleware = require('middleware');
const { applyMiddleware, createStore } = require('redux');

module.exports = applyMiddleware(...middleware)(createStore)(reducers);
