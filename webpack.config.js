const path = require('path');

module.exports = {
  entry: {
    main: './src/main/resources/META-INF/resources/js/main.js',
  },
  output: {
    path: path.resolve(
      __dirname,
      'build/resources/main/META-INF/resources/js'
    ),
    filename: '[name].js',
    library: 'MyReactPortlet',
    libraryTarget: 'global'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
};
