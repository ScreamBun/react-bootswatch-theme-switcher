/* eslint import/no-unresolved: off, import/no-self-import: off */
import path from 'path';
import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const NODE_ENV = 'production';
const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const SRC_DIR = path.join(ROOT_DIR, 'src');

module.exports = {
  mode: NODE_ENV,
  devtool: 'source-map',
  entry: {
    index: "./src/index.js"
  },
  output: {
    path: DIST_DIR,
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs',
  },
  // Determine the array of extensions that should be used to resolve modules
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: [SRC_DIR, 'node_modules']
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
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },
  node: {
    fs: 'empty'
  }
};
