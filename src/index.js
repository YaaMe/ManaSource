const { privateToAddress } = require('ethereumjs-util');


const { address } = require('config');
const store = require('store');
const solc = require('solc');
const { connect } = require('actions/connect');
const { batchActions } = require('redux-batched-actions');
const { compiler } = require('utils/compiler');
const PARITY_WS = 'http://127.0.0.1:8545/';
const EthereumTx = require('ethereumjs-tx');
const Contract = require('api/contract');

const main = async () => {
  const action = {
    type: 'TEST',
    $stream: [
      () => ({ type: 'step-1' }),
      async () => ({ type: 'step-2' }),
      async () => ({ type: 'step-3' }),
      () => ({ type: 'step-4' }),
    ],
    data: {}
  };
  const initBatch = batchActions[
    connect(PARITY_WS)
  ];
  const getJson = () => new Promise((resolv) => {
    setTimeout(() => resolv(3333), 3000);
  });
  const solAction = {
    type: 'DEPLOY',
    $stream: [
      () => {
        const { file, contractName } = require('config');
        return {
          type: 'COMPILE_SOLC',
          $compile: { file, contractName }
        };
      },
      async ({$compile: { data }}) => {
        const { connector } = store.getState();
        const gasPrice = await connector.eth.getGasPrice();
        const options = {
          from: address,
          gasPrice,
          value: '0x0',
          data
        };
        const gasLimit = await connector.eth.estimateGas(options);
        const nonce = await connector.eth.getTransactionCount(address);
        return {
          type: 'SIGNER_TX',
          $signer: {
            ...options,
            gasLimit,
            nonce: nonce+1
          }
        };
      },
      async ({$signer: { result }}) => {
        const { connector } = store.getState();
        console.log('ready to send ');
        const txid = await connector.eth.sendSignedTransaction(result);
        console.log('tx: ', txid);
        return {
          type: 'CALL_ETH',
          $call: {
            method: 'sendTx',
            tx: result
          }
        };
      }
    ]
  };

  const { data, abi } = compiler({
    fileName: 'test.sol',
    contractName: 'x'
  });
  store.dispatch(connect(PARITY_WS));

  async function send() {
    store.dispatch(solAction);
  }
  setTimeout(() => {
    send();
  }, 1000);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
