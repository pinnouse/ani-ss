const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./index.html"
        }),
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, '.')
        }),
        new webpack.ProvidePlugin({
            TextDecoder: [ 'text-encoding', 'TextDecoder' ],
            TextEncoder: [ 'text-encoding', 'TextEncoder' ],
        }),
    ],
    experiments: {
        syncWebAssembly: true,
    }
}