const Webpack = require('webpack')
const Path = require('path')
const fs = require('fs')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')

function resolve(dir) {
  return Path.join(__dirname, dir)
}

const opts = {
  rootDir: process.cwd(),
  devBuild: process.env.NODE_ENV !== 'production'
}

module.exports = {
  target: 'web',
  stats: {
    children: false
  },
  entry: {
    index: './src/index.js'
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool:
    process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
  output: {
    path: Path.join(opts.rootDir, 'dist'),
    pathinfo: opts.devBuild,
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js'
  },
  performance: { hints: false },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 5
        }
      }),
      new CssMinimizerPlugin()
      // new OptimizeCSSAssetsPlugin({})
    ],
    runtimeChunk: false
  },
  plugins: [
    new Webpack.DefinePlugin({
      __VERSION__: JSON.stringify(process.env.npm_package_version)
    }),
    // Extract css files to seperate bundle
    new MiniCssExtractPlugin({
      filename: 'css/index.css',
      chunkFilename: 'css/index.css'
    }),
    // Copy fonts and images to dist
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }
      ]
    }),
    // Speed up webpack build
    // new HardSourceWebpackPlugin(),
    // Copy dist folder to static
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            { source: './dist/css/*', destination: './static/css/' },
            { source: './dist/assets/*', destination: './static/assets/' },
            { source: './dist/js/*', destination: './static/js/' }
          ]
        }
      }
    })
  ],
  module: {
    rules: [
      // Babel-loader
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }]
            ]
          }
        }
      },
      // Css-loader & sass-loader
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      // Load fonts
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '/[name].[ext]',
              outputPath: 'assets/fonts/',
              publicPath: '../assets/fonts/'
            }
          }
        ]
      },
      // Load images
      {
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/img/',
              publicPath: '../assets/img/'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.scss'],
    modules: ['node_modules'],
    alias: {
      request$: 'xhr',
      '@': resolve('src'),
      'assets': resolve('src/assets')
    }
  },
  externals: {
    jquery: 'jQuery'
  },
  devServer: {
    static: {
      directory: Path.join(__dirname, 'static')
    },
    compress: true,
    port: 9129,
    open: true,
    onBeforeSetupMiddleware: function(devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }

      devServer.app.post('**', function(req, res) {
        let url = req.originalUrl
        if (url.indexOf('?') !== -1) {
          url = url.split('?')[0]
        }
        const content = fs.readFileSync(Path.resolve(__dirname, 'static' + url), 'utf8')

        const extend = url.split('.')[1]
        if (extend === 'json') {
          res.json(JSON.parse(content))
        } else {
          res.send(content)
        }
      })
    }
  }
}
