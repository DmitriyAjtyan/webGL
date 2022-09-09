const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolveRelativePath = (relativePath) => path.resolve(__dirname, relativePath);

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  console.log('argv.mode: ', argv.mode);

  return {
    mode: argv.mode,
    module: {
      rules: [
        {
          test: /\.(glsl)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
    entry: {
      index: resolveRelativePath('./src/index.js')
    },
    output: {
      path: resolveRelativePath('./dist'),
    },
    plugins: [new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolveRelativePath('./src/index.html')
    })],
    devtool: isDevelopment? 'eval-source-map' : false,
    devServer: {
      port: 3000,
      hot: true,
    },
  };
}
