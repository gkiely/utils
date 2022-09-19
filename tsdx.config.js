module.exports = {
  rollup(config, options) {
    config.output.strict = false;
    return config; // always return a config.
  },
};
