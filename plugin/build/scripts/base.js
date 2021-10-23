const path = require('path');
const webpack = require('webpack');

// plugins
const HtmlWebacpkPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackBar = require('webpackbar');

const root = process.cwd();
const rootJoin = (inRootPath) => path.join(root, inRootPath);

module.exports = {
    entry: {
        main: rootJoin('./src/index.js'),
        content: rootJoin('./src/content/index.js'),
        background: rootJoin('./src/background/index.js'),
    },
    output: {
        path: rootJoin('./dist'),
        filename: '[name].js',
        chunkFilename: '[name].[contenthash].chunk.js',
        clean: true,
    },
    target: 'web',
    resolve: {
        extensions: ['.js', '.ts', '.tsx','.jsx','.less','.css'],
        //建立别名
        alias: {
            "@assets": rootJoin('./src/assets'),
            "@views": rootJoin('./src/views'),
            "@commonModules": rootJoin('./src/commonModules'),
            "@globalComponents": rootJoin('./src/globalComponents'),
            "@mock": rootJoin('./mock'),
            "@/api": rootJoin('./src/api/index.js'),
            "@/mock": rootJoin('./src/mock.js'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(jsx|tsx|js|ts)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                                '@babel/preset-typescript'
                            ],
                            plugins: [
                                ["@babel/plugin-proposal-decorators", {"legacy": true}], 
                                ["@babel/plugin-proposal-class-properties", { "loose": false }],
                                ["import", { libraryName: "antd", style: "css" }],
                                ["@babel/syntax-dynamic-import"],
                                ["babel-plugin-precise-arithmetic"]
                            ],
                            cacheDirectory: true,   // 使用cache提升编译速度
                        },
                    }
                ],
                include: [rootJoin('./src'), rootJoin('./node_modules/webpack-dev-server/client')],
                exclude: /node_modules/
            },
            // .css后缀文件
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            // .less后缀文件
            {
                test:/\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            }
                        }
                    }
                ]
            },
            // .styl
            {
                test: /\.styl$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'stylus-loader'
                ]
            },
            // html
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(a?png|jpe?g|gif|svg)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 10kb以下 asset/inline 10kb以上 asset/resource
                    }
                }
            },
            {
                test: /\.(bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new WebpackBar(),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        // 主页面
        new HtmlWebacpkPlugin({
            template: rootJoin('./src/index.tmpl.html'),
            filename: 'index.html',
            inject: 'body',
            minify: {
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }
        }),
        new CopyPlugin({
            patterns: [
                { from: rootJoin( './src/assets/images'), to: rootJoin('./dist') },
                { from: rootJoin( './src/assets/manifest.json'), to: rootJoin('./dist') },
                { from: rootJoin( './src/assets/insert.js'), to: rootJoin('./dist') },
            ]
        }),
        new webpack.DefinePlugin({
            process_env: {
                PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'prod'),
                MOCK: JSON.stringify(process.env.MOCK),
            },
        })
    ]
};