const path = require('path');
const webpack = require('webpack');
const os = require('os');

var package = Object.assign({}, require("./package.json"));
package.buildPCName = os.hostname();
package.buildFolder = __dirname;
package.buildTime = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();

delete package.scripts;
delete package.devDependencies;
delete package.main;

module.exports = {
    mode: (process.env.MODE && false) || "development",
    // mode: 'production',
    entry: ["./dev.js"],
    // entry: ["./src/cookie.js"],
    output: {
        path: path.join(__dirname, "."),
        filename: "./absol/absol_form.js"
    },
    resolve: {
        modules: [
            path.join(__dirname, './node_modules')
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: { presets: [['@babel/preset-env', { modules: false }]] }
            },
            {
                test: /\.(tpl|txt|xml|rels|svg|json)$/i,
                use: 'raw-loader',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    optimization: {
        // We do not want to minimize our code.
        minimize: false
    },
    devServer: {
        compress: false
    },
    performance: {
        hints: false
    },
    plugins: [
        new webpack.DefinePlugin({
            PACKAGE: JSON.stringify(package)
        })
    ]
};