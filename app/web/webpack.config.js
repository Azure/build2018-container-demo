const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const SITE_API = process.env.SITE_API
const SUBJECT_API = process.env.SUBJECT_API
const RATING_API = process.env.RATING_API
// const PORT = process.env.PORT
// const TAG = process.env.IMAGE_TAG
// const TAG_DATE = process.env.IMAGE_BUILD_DATE

var onError = function (err, req, res) {
  console.log('Error with webpack proxy :', err);
};

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            loaders: {
              'scss': 'vue-style-loader!css-loader!sass-loader',
              'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
            }
          }
        }]
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name].[ext]?[hash]',
            limit: 10000
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [
      'node_modules'
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devtool: '#eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        SITE_API: JSON.stringify(process.env.SITE_API),
        SUBJECT_API: JSON.stringify(process.env.SUBJECT_API),
        RATING_API: JSON.stringify(process.env.RATING_API)
        // IMAGE_BUILD_DATE: JSON.stringify(process.env.IMAGE_BUILD_DATE || "DATE OF TAG"),
        // IMAGE_TAG: JSON.stringify(process.env.IMAGE_TAG || "TAG NAME"),
        // KUBE_NODE_NAME: JSON.stringify(process.env.KUBE_NODE_NAME || "NODE NAME"),
        // KUBE_POD_NAME: JSON.stringify(process.env.KUBE_POD_NAME || "POD NAME"),
        // KUBE_POD_IP: JSON.stringify(process.env.KUBE_POD_IP || "POD IP"),
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$|\.png$|\.jpg$|\.ico$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    host: '0.0.0.0',
    disableHostCheck: true,
    // port: 80,
    before(app) {
      app.use((req, res, next) => {
        // console.log(`ENV IMAGE_TAG: `, process.env.IMAGE_TAG);
        // console.log(`ENV IMAGE_BUILD_DATE: `, process.env.IMAGE_BUILD_DATE);
        // console.log(`ENV KUBE_NODE_NAME: `, process.env.KUBE_NODE_NAME);
        // console.log(`ENV KUBE_POD_NAME: `, process.env.KUBE_POD_NAME);
        // console.log(`ENV KUBE_POD_IP: `, process.env.KUBE_POD_IP);
        console.log(`ENV SITE API: `, process.env.SITE_API);
        console.log(`ENV SUBJECT API: `, process.env.SUBJECT_API);
        console.log(`ENV RATING API: `, process.env.RATING_API);
        console.log(`Using middleware for ${req.url}`);
        next();
      });
    },
    noInfo: false,
    historyApiFallback: {
      index: '/dist/'
    },
    proxy: {
      '/site-api': {
        target: SITE_API,
        pathRewrite: { '^/site-api': '' }
      },
      '/subject-api': {
        target: SUBJECT_API,
        pathRewrite: { '^/subject-api': '' }
      },
      '/rating-api': {
        target: RATING_API,
        pathRewrite: { '^/rating-api': '' }
      },
      onError: onError,
      logLevel: 'debug'
    }
  }
}
