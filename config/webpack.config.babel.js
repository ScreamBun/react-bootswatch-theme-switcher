/* eslint import/no-unresolved: off, import/no-self-import: off */
import path from 'path';
import webpack from 'webpack';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const NODE_ENV = 'production';
const ROOT_DIR = path.join(__dirname, '..');
const LIB_DIR = path.join(ROOT_DIR, 'lib');

module.exports = {
  mode: NODE_ENV,
  devtool: 'source-map',
  entry: {
    index: "./src/index.ts"
  },
  output: {
    path: LIB_DIR,
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs'
  },
  // Determine the array of extensions that should be used to resolve modules
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [LIB_DIR, 'node_modules']
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV
    }),
    new CleanWebpackPlugin({
      dry: false
    })
  ],
  optimization: {
    minimizer: [
    ],
    mergeDuplicateChunks: true,
    runtimeChunk: false,
    splitChunks: {
      automaticNameDelimiter: '_',
      cacheGroups: {
        themes: {
          test: /[\\/]themes[\\/]/,
          name: 'themes',
          chunks: 'all'
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'awesome-typescript-loader',
          options: {
            declaration: true,
          }
        }
      }
    ]
  }
};
