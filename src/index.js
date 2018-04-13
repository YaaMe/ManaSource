const { privateToAddress } = require('ethereumjs-util');
const privateKey =
      Buffer.from('234a5f6c29135031bdf8faf0fc39ceafee3d71a60d7d865c57ade0ceac33f247', 'hex');
const address = `0x${privateToAddress(privateKey).toString('hex')}`;

const store = require('store');
const solc = require('solc');
const { connect } = require('actions/connect');
const { batchActions } = require('redux-batched-actions');
const { compiler } = require('utils/compiler');
const PARITY_WS = 'ws://127.0.0.1:8546/';
const EthereumTx = require('ethereumjs-tx');
const Contract = require('api/contract');

const main = async () => {
  const action = {
    type: 'TEST',
    $step: ['step-1', 'step-2'],
    data: {}
  };
  console.log('start dispatch action');
  store.dispatch(action);
  // let so = solc.compile(contract);
// 
//   console.log(so.contracts[':x'].bytecode == remix2);
//   console.log('=============');
//   console.log(remix2);
//   console.log(so.contracts[':x'].bytecode);
  //   console.log(optcode == so.contracts[':x'].opcode);
  const initBatch = batchActions[
    connect(PARITY_WS)
  ];
  const batchAction = batchActions([{
    type: '@test',
    data: {
      tx: '0x00'
    }
  },{
    type: '@signer',
    data: {
      tx: '0x000'
    }
  }], 'TEST_ACTION');
  // store.dispatch(batchAction);
  const { data, abi } = compiler({
    fileName: 'test.sol',
    contractName: 'x'
  });
  // store.dispatch(connect(PARITY_WS));
  async function send() {
    const { connector: { parityConnector } } = store.getState();
    const testContract = new Contract(parityConnector, '', abi);
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
    console.log(serializedTx);
    // const txHash = await parityConnector.sendTx(serializedTx);
    // console.log('==hash==> ', txHash);

  }
  setTimeout(() => {
    // send();
  }, 1000);
  console.log(abi);
  const pack = {
    from: 'address',
    gas: 1000000,
    data
  };
  // store.dispatch({
  //   type: '@compiler',
  //   data: {
  //     file: 'test.sol'
  //   }
  // });
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
