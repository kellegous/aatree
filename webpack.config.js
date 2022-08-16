const HtmlWebpackPlugin = require("html-webpack-plugin"),
	path = require('path');

module.exports = {
	devtool: 'inline-source-map',
	mode: "development",
	entry: "./src/index.ts",
	output: {
		filename: "[name].[fullhash].js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
			},
			{
				test: /\.s?css$/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader",
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "./src/index.html",
		}),
	],
	devServer: {
		static: './dist'
	},
};
