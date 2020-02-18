const paths = require("./paths");

module.exports = {
  webpack: function(config, env) {
    // Without this, the monorepo won't work
    config.module.rules = config.module.rules.map(rule => {
      if (!Reflect.has(rule, "oneOf")) {
        return rule;
      }
      console.log("test");
      const oneOf = rule.oneOf.map(loader => {
        if (!Reflect.has(loader, "test")) {
          return loader;
        }

        if (!loader.test.toString().includes("js|mjs|jsx")) {
          return loader;
        }

        if (loader.include !== paths.srcPath) {
          return loader;
        }

        if (!loader.loader.includes("node_modules/babel-loader")) {
          return loader;
        }

        return {
          ...loader,
          include: [paths.srcPath, paths.componentsPath]
        };
      });

      return {
        ...rule,
        oneOf
      };
    });
    return config;
  },
  devServer: function(config) {
    // Return the replacement function for create-react-app to use to generate the Webpack
    // Development Server config. "configFunction" is the function that would normally have
    // been used to generate the Webpack Development server config - you can use it to create
    // a starting configuration to then modify instead of having to create a config from scratch.
    // console.log("dev server", configFunction);
    // const config = configFunction();
    config.before = (app, server) => {
      console.log("BEFORE");
    };
    return config;
  }
};
