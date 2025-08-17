const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Business Name Registration Australia',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    proxy: [
      {
        context: ['/microsvc'],
        target: 'https://aim.apiro.ai',
        secure: true,
        changeOrigin: true,
        logLevel: 'debug',
        onProxyReq: function (proxyReq, req, res) {
          console.log('Proxying request:', req.method, req.url);
        },
        onError: function (err, req, res) {
          console.error('Proxy error:', err);
        }
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};