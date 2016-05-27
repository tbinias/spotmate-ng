var path = require("path");
var webpack = require("webpack");


module.exports = {
        entry: {
            "spotmate": "./app/index.es6"
        },
	output: {
            path: __dirname + "/build/dist/",
            filename: "[name].js"
        },
        devServer: {
            contentBase: "./app",
            proxy: {
                /*
                '/resources*': {
                    target: 'https://spotmate.binias-online.de/spotmate',
                    secure: false
                },
                '/spotmate/resources*': {
                    target: 'https://spotmate.binias-online.de',
                    secure: false
                }*/
                '/resources*': {
                    target: 'http://localhost:3000',
                    secure: false
                }
            }
        },
        resolve: {
            root: ["", path.join(__dirname, "node_modules")],
            extensions: ['', '.js', '.es6']
        },
        plugins: [
        ],
        externals: {
            angular: "angular",
            jquery: "jQuery"
        },
        module: {
            loaders: [
                {
                    test: /\.es6$/,
                    loader: "babel-loader",
                    query: {
                        plugins: ['object-assign']
                    }
                },
                {
                    test: /\.html$/,
                    loader: "html-loader"
                },
                {
                    test: /\.scss$/,
                    loader: "style!css!sass?sourceMap"
                },
                {
                    test: /\.css$/,
                    loader: "style!css"
                },
                {
                    test: /\.(png|jpg|svg)$/,
                    loader: 'url-loader?limit=8192'
                }
            ]
        },
        devtool: 'source-map'
}
