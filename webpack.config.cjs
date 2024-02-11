const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: {index: './src/index.ts'},
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.json',
          transpileOnly: false
        }
      },
      {
        test: /\.wasm$/,
    },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.d.ts'],
  },
  devtool: 'source-map',
  output: {
    publicPath: 'auto',
    libraryTarget: 'umd',
  },
  plugins: [new ForkTsCheckerWebpackPlugin()]



};