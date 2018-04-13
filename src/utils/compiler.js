const fs = require('fs');
require.extensions['.sol'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};
const solc = require('solc');

function compiler({ fileName, contractName }) {
  const contract = require(`contracts/${fileName}`);
  const compiler = solc.compile(contract);
  const details = compiler.contracts[`:${contractName}`];
  console.log('===>', `0x${details.bytecode}`);
  return {
    data: `0x${details.bytecode}`,
    abi: JSON.parse(details.interface)
  };
};

const middleware = store => next => action => {
  if (/@compiler/.test(action.type)) {
    console.log('===compile===>', action);
    // action.data.compile = compiler(action.data.file);
    console.log('>>>>>>');
    // console.log(action.data.compile.contracts[':x']);
  }
  next(action);
};

module.exports = {
  compiler,
  middleware
};
