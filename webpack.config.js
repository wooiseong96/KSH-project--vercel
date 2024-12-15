const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');

module.exports = {   
    entry: {
      'home':  path.resolve(__dirname, 'src/home/home.js'),    
      'login': path.resolve(__dirname, 'src/login/login.js'), 
      'account': path.resolve(__dirname, 'src/account/account.js'),  
      'auth': { import: './src/utils/auth.js', filename: './utils/[name].js' },
      'form-serialize': { import: './src/utils/form-serialize.js',  filename: './utils/[name].js'},
      'toast': { import: './src/utils/toast.js',  filename: './utils/[name].js' },
    },
    output: {        
        path: path.resolve(__dirname, 'dist'),        
        filename: './[name]/[name].js',        
        clean: true
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader , 'css-loader']
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          }
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset',
          generator: {
            filename: 'assets/[hash][ext][query]'
          }
        }
      ],
    },
    optimization: {
      nodeEnv: false,
      minimizer: [
        new CssMinimizerPlugin(),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/home/home.html'),
      filename: path.resolve(__dirname, 'dist/home/home.html'),
      useCdn: process.env.NODE_ENV === 'production',
      chunks: ['home']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/login/login.html'),
      filename: path.resolve(__dirname, 'dist/login/login.html'),
      useCdn: process.env.NODE_ENV === 'production',
      chunks: ['login']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/account/account.html'),
      filename: path.resolve(__dirname, 'dist/account/account.html'),
      useCdn: process.env.NODE_ENV === 'production',
      chunks: ['account']
    }),
      new MiniCssExtractPlugin({
        filename: './stylesheet/index.css'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ],
    performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
}