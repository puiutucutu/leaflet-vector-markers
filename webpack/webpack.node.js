const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

/**
 * Environment Variables
 */

const environment = process.env.NODE_ENV;

/**
 * Webpack Config
 */

module.exports = {
  mode: "development",
  devtool: "none",
  target: "node",
  node: {
    fs: "empty"
  },
  entry: {
    "leaflet-vector-markers": path.resolve("src", "index.js")
  },
  output: {
    path: path.resolve("dist", "node"),
    filename: "[name].cjs.js",
    libraryTarget: "commonjs2"
  },
  resolve: {
    extensions: [".js"]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ],
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.js$/,
            include: path.resolve("src"),
            resolve: {
              extensions: [".js"] // allows js file import without specifying the extension
            },
            use: {
              loader: "babel-loader"
            }
          },
          {
            test: /\.css$/,
            use: [
              { loader: MiniCssExtractPlugin.loader },
              { loader: "css-loader", options: { importLoaders: 1 } },
              { loader: "postcss-loader" }
            ]
          },
          {
            test: /\.(sass|scss)$/,
            use: [
              { loader: MiniCssExtractPlugin.loader },
              { loader: "css-loader", options: { importLoaders: 2 } },
              { loader: "postcss-loader" },
              { loader: "sass-loader" }
            ]
          },

          /**
           * Asset Rules
           */

          {
            test: /\.svg$/,
            loader: "svg-inline-loader"
          },

          /**
           * Everything Else (fall through)
           */

          {
            // prettier-ignore
            exclude: [
              /\.js$/,
              /\.json$/,
              /\.html$/,
              /\.ejs$/
            ],
            use: {
              loader: "file-loader",
              options: {
                name: "static/media/[name].[hash:8].[ext]"
              }
            }
          }
        ]
      }
    ]
  }
};
