module.exports = {
    mode: "development",
    entry: "./src/app.js",
    output: {
        path: `${__dirname}/dist`,
        filename: "bundle.js",
    },
    devServer: {
        static: "./dist",
    },
    resolve: {
        extensions: [".js", ".glsl", "vs", "fs"],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                type: "asset/source",
                generator: {
                    filename: "assets/images/[hash][ext]",
                }
            },
            {
                test: /\.(ipg|png|gif|svg)$/,
                type: "asset/resource",
                generator: {
                    filename: "assets/images/[hash][ext]",
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            }
        ]
    }
}