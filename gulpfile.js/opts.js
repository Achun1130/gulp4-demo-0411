const minimist = require('minimist');

const envOpts = {
  string: 'env',
  default: {
    env: 'develop',
  },
};

const opts = minimist(process.argv.slice(2), envOpts);

exports.opts = opts;
