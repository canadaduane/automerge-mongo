module.exports = function(api) {
  api.cache(false);

  const presets = ["@babel/preset-env"];
  const plugins = [
    ["@babel/plugin-proposal-class-properties", {}],
    ["@babel/transform-runtime", { helpers: true, regenerator: true }]
  ];

  return {
    presets,
    plugins
  };
};
