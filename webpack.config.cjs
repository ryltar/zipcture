const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: ['./src/index.ts'],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: false
        }
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  plugins: [new ForkTsCheckerWebpackPlugin()]



};