const TYPE = {
  INIT: 'INIT_COMPILE'
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
