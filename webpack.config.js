var path = require("path");
var webpack = require("webpack");


module.exports = {
        entry: {
            app: "./app/app.js"
        },
        devServer: {
            contentBase: "./app",
            proxy: {
                '/resources*': {
                    target: 'https://spotmate.binias-online.de/spotmate',
                    secure: false
                }
            }
        },
        resolve: {
            root: ["", path.join(__dirname, "node_modules")]
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
                    test: /\.css$/i,
                    loader: 'style-loader!css-loader'
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader'
                }

            ]
        },
}