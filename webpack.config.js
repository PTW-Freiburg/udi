"use strict";
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const env = process.env.NODE_ENV;

const config = {
    context: `${__dirname}/src`,
    resolve: {
        extensions: ['','.ts','.js']
    },

    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin()
    ],

    module: {
        preLoaders: [
            { test: /\.ts$/, loader: 'tslint' }
        ],

        loaders: [
            { test: /\.ts$/, loader: 'ts', exclude: /node_modules/ }
        ]
    }
};

/**
 * Build for:
 * - `production` -> minifiy + UMD
 * - `browser` -> UMD
 * otherwhise (`lib`) -> CJS + declaration files
 */
switch(env) {
    case 'production':
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                comments: false,
                beatuify: false,
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false
                }
            })
        );
    case 'browser':
        config.output = {
            library: 'UDI',
            libraryTarget: 'umd'
        };
        break;
    case 'test':
        config.target = 'node';
        config.externals = [nodeExternals()];
        config.devtool = 'cheap-module-source-map';
    default:
        config.ts = {
            compilerOptions: {
                declaration: true
            }
        };
        break;
}

module.exports = config;
