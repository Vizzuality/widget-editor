import path from "path";

import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";
import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default [
  {
    input: "./src/applications/widget-editor/src/index.js",
    output: {
      dir: "dist",
      format: "cjs",
    },
    external: ["react", "react-proptypes"],
    plugins: [
      json(),
      babel({
        exclude: "node_modules/**",
      }),
      resolve(),
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
    ],
  }
];
