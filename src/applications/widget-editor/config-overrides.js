const paths = require("./paths");

module.exports = {
  webpack: function(config, env) {
    // Without this, the monorepo won't work
    config.module.rules = config.module.rules.map(rule => {
      if (!Reflect.has(rule, "oneOf")) {
        return rule;
      }

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
  }
};
