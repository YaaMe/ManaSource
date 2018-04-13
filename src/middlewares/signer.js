const middleware = store => next => action => {
  console.log('signer middleware');
  console.log('====>', action.type, action);
  if (/@signer/.test(action.type)) {
    console.log('sign tx', action.data.tx);
  }
  next(action);
};

module.exports = store => next => action => {
  return middleware(store)(next)(action);
  // console.log('signer middleware');
  // console.log('====>', action.type, action);
  // if (/@signer/.test(action.type)) {
  //   console.log('sign tx', action.data.tx);
  // }
  // next(action);
};
