const privateKey =
      Buffer.from('234a5f6c29135031bdf8faf0fc39ceafee3d71a60d7d865c57ade0ceac33f247', 'hex');
const address = `0x${privateToAddress(privateKey).toString('hex')}`;

const EthereumTx = require('ethereumjs-tx');
const middleware = store => next => action => {
  console.log('signer middleware', action.$signer);
  const { data } = action.$signer;
  const pack = {
    nonce: 2,
    from: address,
    value: '0x0',
    gasPrice: 100000,
    gasLimit: 200000,
    data
  };
  const tx = new EthereumTx(pack);
  tx.sign(privateKey);
  const serializedTx = `0x${tx.serialize().toString('hex')}`;
  action.$signer.result = serializedTx;
  next(action);
};

module.exports = {
  id: 'signer',
  middleware
};
