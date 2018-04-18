const fs = require('fs');
require.extensions['.sol'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};
const solc = require('solc');

function compile(path) {
  const contract = require(`contracts/${path}`);
  return solc.compile(contract);
};

const middleware = store => next => action => {
  const { file, contractName } = action.$compile;
  const result = compile(file);
  const detail = result.contracts[`:${contractName}`];
  action.$compile = Object.assign(action.$compile, {
    data: `0x${detail.bytecode}`,
    abi: JSON.parse(detail.interface)
  });
  next(action);
};

module.exports = {
  id: 'compile',
  middleware
}
