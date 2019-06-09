const HtmlWebPackPlugin = require("html-webpack-plugin"); //html loader
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //css loader
const autoprefixer = require('autoprefixer'); //autoprefixer for styles
const { CleanWebpackPlugin } = require('clean-webpack-plugin');  //clear dist loader

const imagemin = require('imagemin');
const imageminGifsicle = require("imagemin-gifsicle");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminOptipng = require("imagemin-optipng");
const imageminSvgo = require("imagemin-svgo");
const ImageminPlugin = require('imagemin-webpack-plugin').default;

path = {
    dist: {
        scripts: 'assets/js/',
        styles: 'assets/styles/',
        images: 'assets/images/',
        fonts: 'assets/fonts/'
    }
};

module.exports = {
    output: {
        filename: path.dist.scripts + 'app.min.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    "overrideBrowserslist": [
                                        "> 1%",
                                        "last 30 versions"
                                    ]
                                })
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        context: 'src'
                    }
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        context: 'src'
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: path.dist.styles + "[name].css",
            chunkFilename: "[id].css"
        }),
        new ImageminPlugin({
            bail: false, // Ignore errors on corrupted images
            cache: true,
            imageminOptions: {
                // Lossless optimization with custom option
                // Feel free to experement with options for better result for you
                plugins: [
                    imageminGifsicle({
                        interlaced: true
                    }),
                    imageminJpegtran({
                        progressive: true
                    }),
                    imageminOptipng({
                        optimizationLevel: 5
                    }),
                    imageminSvgo({
                        removeViewBox: true
                    })
                ]
            }
        })
    ]
};