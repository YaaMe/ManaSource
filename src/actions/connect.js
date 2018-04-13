const TYPE = {
  INIT: 'INIT_CONNECT'
};

function connect(url) {
  return {
    type: TYPE.INIT,
    data: { url }
  };
};

module.exports = {
  TYPE,
  connect
};
