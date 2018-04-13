'use strict';
// https://github.com/tshelburne/redux-batched-actions/pull/22
Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.batchActions = batchActions;
exports.enableBatching = enableBatching;
exports.batchDispatchMiddleware = batchDispatchMiddleware;
var BATCH = exports.BATCH = 'BATCHING_REDUCER.BATCH';

function batchActions(actions) {
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : BATCH;

	return { type: type, meta: { batch: true }, payload: actions };
}

function enableBatching(reduce) {
	return function batchingReducer(state, action) {
		if (action && action.meta && action.meta.batch) {
			return action.payload.reduce(batchingReducer, state);
		}
		return reduce(state, action);
	};
}

function batchDispatchMiddleware(store) {
	function dispatchChildActions(store, action) {
		if (action.meta && action.meta.batch) {
			action.payload.forEach(function (childAction) {
				dispatchChildActions(store, childAction);
			});
		} else {
			store.dispatch(action);
		}
	}

	return function (next) {
		return function (action) {
      if (action && action.meta && action.meta.batch) {
			  dispatchChildActions(store, action);
      }
      return next(action);
		};
	};
}