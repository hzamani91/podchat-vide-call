const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'podchat-video-call.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'VideoCall',
      type: 'umd',
      export: 'default'
    },
  },
};