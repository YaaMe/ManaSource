module.exports = store => next => action => {
  console.log('====>', action.type, action);
  if (/@signer/.test(action.type)) {
    console.log('sign tx', action.data.tx);
  }
  next(action);
};
