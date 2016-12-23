var path = require("path");
var webpack = require("webpack");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var config = {
    entry: {
        app: "./src/main.js"
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/dist/",
        filename: "app.bundle.js"
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: "vue-loader",
            options: {
                loaders: {
                    // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                    // the "scss" and "sass" values for the lang attribute to the right configs here.
                    // other preprocessors should work out of the box, no loader config like this nessessary.
                    "scss": "vue-style-loader!css-loader!sass-loader",
                    "sass": "vue-style-loader!css-loader!sass-loader?indentedSyntax"
                }
                // other vue-loader options go here
            }
        }, {
            test: /\.scss$/,
            loaders: ["style-loader", "css-loader", "sass-loader"],
            exclude: /node_modules/
        }, {
            test: /\.js$/,
            loader: "babel-loader",
            exclude: /node_modules/
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: "file-loader",
            options: {
                name: "[name].[ext]?[hash]"
            }
        }]
    },
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.common.js"
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        compress: true
    },
    devtool: "#eval-source-map",
    watch: true,
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFileName: "bundle.report.html",
            openAnalyzer: false
        })
    ]
};

if (process.env.NODE_ENV === "production") {
    config.devtool = "#source-map";
    
    // http://vue-loader.vuejs.org/en/workflow/production.html
    config.watch = false;

    config.plugins = (config.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            debug: false,
            minimize: true
        })
    ]);
}

module.exports = config;