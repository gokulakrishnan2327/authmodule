// module.exports = {
//   plugins: {
//     '@tailwindcss/postcss': {}, // Keep this as is since that's what your package.json shows
//     autoprefixer: {},
//   },
// }

// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// }

import type { Config } from 'postcss-load-config';

const config: Config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
};

export default config;