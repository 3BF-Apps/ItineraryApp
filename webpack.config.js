const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './client/src/index.jsx',
    mode: 'production',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'client/dist'),
        publicPath: '/'
    },
    devServer: {
        historyApiFallback: true
    },
    plugins: [
        new Dotenv({ path: path.resolve(__dirname, './.env'), systemvars: true })
    ],
    module: {
        rules: [{
                test: /\.m?jsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            }
        ]
    }

};