const path = require('path');
const Unused = require('./plugin/unused');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new Unused()],
};
