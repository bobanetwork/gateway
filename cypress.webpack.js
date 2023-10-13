// @ts-ignore
const wp = require('@cypress/webpack-preprocessor')
const path = require('path')

export const cypressWebpackPlugin = (on, config) => {
  const options = {
    webpackOptions: {
      resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
        alias: {
          _: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'cypress'),
          ],
        },
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'babel-loader',
            // options: { transpileOnly: true },
          },
        ],
      },
    },
  }
  on('file:preprocessor', wp(options))
  // Tus otras configuraciones de plugins...
}
