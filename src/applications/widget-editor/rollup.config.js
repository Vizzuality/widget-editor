import path from "path";

import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";
import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";


export default [
  {
    input: "./src/index.js",
    output: {
      dir: "dist",
      format: "cjs",
      globals: { 'styled-components': 'styled' }
    },
    external: ["react", "react-dom", "prop-types", "react-proptypes", "styled-components", "symbol-observable"],
    plugins: [
      json(),
      nodeResolve({
        "jsnext:main": true,
        "browser:main": true,
        skip: ['lodash']
      }),
      commonjs({
        include: "node_modules/**",
        namedExports: {
          "node_modules/react-is/index.js": [
            "isValidElementType",
            "typeOf",
            "isElement",
          ],
          "symbol-observable": ["createPortal", "findDOMNode"],
          "react-dom": ["createPortal", "findDOMNode"],
        },
      }),
      babel({
        exclude: "node_modules/**",
        presets: [['@babel/preset-env', {'modules': false}],'@babel/react'],
        plugins: [['@babel/plugin-proposal-class-properties', { 'loose': true }]]
      }),
    ],
  }
];
