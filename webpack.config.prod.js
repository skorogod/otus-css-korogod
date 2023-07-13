const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCss = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[contenthash:8].js',
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new MiniCss({
            filename: "style.css",
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCss.loader, "css-loader", "sass-loader",
                {
                  loader: "postcss-loader",
                  options: {
                    postcssOptions: {
                      plugins: [
                        [
                          "autoprefixer",
                          {
                            // Options
                          },
                        ],
                      ],
                    },
                  },},],
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                    presets: [
                        ['@babel/preset-env', { targets: "defaults" }]
                    ]
                    }
                }
            },
            {
              test: /\.(jpe?g|png|gif|svg)$/i,
              type: "asset",
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|)$/,
                type: 'asset/resource',
                generator:  {
                    filename: 'fonts/[name]-[hash][ext]',
                }
            },
            {
                test: /\.svg?/,
                type: 'asset/resource',
                generator: {
                    filename: 'icons/[name]=[contenthash:5][ext]'
                }
            },
        ]
    },
    optimization: {
      minimizer: [
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.squooshMinify,
            options: {
              encodeOptions: {
                mozjpeg: {
                  // That setting might be close to lossless, but it’s not guaranteed
                  // https://github.com/GoogleChromeLabs/squoosh/issues/85
                  quality: 65,
                },
                webp: {
                  lossless: 1,
                },
                avif: {
                  // https://github.com/GoogleChromeLabs/squoosh/blob/dev/codecs/avif/enc/README.md
                  cqLevel: 0,
                },
              },
            },
          },
        }),
      ],
    },
    devServer: {
        compress: false,
        open: true,
        port: 3000,
        hot: true,
    }
}