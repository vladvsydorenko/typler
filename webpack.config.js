const path = require('path');

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    output: {
        filename: 'main.js',
        library: "typler",
        libraryTarget: "umd",
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: "tsconfig.prod.json"
                }
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};
