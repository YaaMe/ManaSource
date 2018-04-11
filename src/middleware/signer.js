module.exports = store => next => action => {
  if (/@/.test(action.type)) {
    console.log('sign tx', action.data.tx);
  }
  next(action);
};
