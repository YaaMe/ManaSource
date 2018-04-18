const reducers = require('reducers');
const { applyMiddleware, createStore } = require('redux');

const { higherOrderMiddleware, services: { stream }} = require('redux-hom');
const diyServices = require('services');

module.exports = createStore(
  reducers,
  applyMiddleware(
    higherOrderMiddleware({
      services: [
        stream,
        ...diyServices
      ]
    }),
  )
);
