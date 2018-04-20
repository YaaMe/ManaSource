const { privateKey } = require('config');
const privateKeyBuffer =
      Buffer.from('234a5f6c29135031bdf8faf0fc39ceafee3d71a60d7d865c57ade0ceac33f247', 'hex');
const { privateToAddress } = require('ethereumjs-util');
const address = '0x' + privateToAddress(privateKeyBuffer).toString('hex');
const EthereumTx = require('ethereumjs-tx');


const middleware = store => next => action => {
  const data = action.$signer;
  const tx = new EthereumTx(data);
  tx.sign(privateKeyBuffer);
  const serializedTx = `0x${tx.serialize().toString('hex')}`;
  action.$signer.result = serializedTx;
  next(action);
};

module.exports = {
  id: 'signer',
  middleware
};
