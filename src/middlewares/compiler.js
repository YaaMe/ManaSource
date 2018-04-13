const fs = require('fs');
require.extensions['.sol'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};
const solc = require('solc');

function compiler(path) {
  const contract = require(`contracts/${path}`);
  return solc.compile(contract);
};

const middleware = store => next => action => {
  console.log('compile middleware');
  next(action);
};


const a = (s) => {
  return 1;
}

module.exports = store => next => action => {
  // return middleware;
  if (/@compiler/.test(action.type)) {
    console.log('===compile===>', action);
    action.data.compile = compiler(action.data.file);
    console.log('>>>>>>');
    console.log(action.data.compile.contracts[':x']);
  }
  next(action);
};
