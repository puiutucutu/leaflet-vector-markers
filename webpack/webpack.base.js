const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

/**
 * Environment Variables
 */

const environment = process.env.NODE_ENV;
const isDevelopment = environment === "development";

/**
 * Webpack Config
 */

const rootPath = path.resolve("");
const buildPath = path.resolve("dist");
const devPath = path.resolve("dev");

module.exports = {
  mode: isDevelopment ? "development" : "production",
  devtool: isDevelopment ? "source-map" : "none", // `source-map` shows the file and line number of an error

  entry: {
    //
    // acts as an namespace for the entry point of the code that can be
    // later referred to in the config as `[name]
    //
    // placing `@babel/polyfill` emulates the ES2015 environment for browsers on
    // runtime`
    //
    "leaflet-vector-markers": isDevelopment
      ? ["@babel/polyfill", path.resolve("dev", "index.js")]
      : ["@babel/polyfill", path.resolve("src", "index.js")]
  },

  output: {
    path: isDevelopment ? devPath : buildPath,
    filename: "[name].js",
    library: "VectorMarkers",
    libraryTarget: "umd"
  },

  externals: [
    {
      leaflet: {
        amd: "leaflet",
        commonjs: "leaflet",
        commonjs2: "leaflet",
        root: "L"
      }
    }
  ],

  resolve: {
    extensions: [".js"]
  },

  plugins: isDevelopment
    ? [
        new HtmlWebpackPlugin({
          hash: true, // suffixes asset filenames with a hash like `styles.css?564201b6c8cc6c0a1d8e` for cache busting
          inject: true,
          template: path.resolve("dev/index.html")
        })
      ]
    : [
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
          // prettier-ignore
          {
            test: /\.css$/,
            use: isDevelopment
              ? [
                { loader: "style-loader" },
                { loader: "css-loader", options: { importLoaders: 1, sourceMap: true } },
                { loader: "postcss-loader", options: { sourceMap: true } }
              ]
              : [
                { loader: MiniCssExtractPlugin.loader },
                { loader: "css-loader", options: { importLoaders: 1 } },
                { loader: "postcss-loader" }
              ]
          },
          {
            test: /\.(sass|scss)$/,
            use: isDevelopment
              ? [
                  { loader: "style-loader" },
                  { loader: "css-loader", options: { importLoaders: 2 } },
                  { loader: "postcss-loader" },
                  { loader: "sass-loader" }
                ]
              : [
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
  },

  // @see https://webpack.js.org/configuration/dev-server/
  devServer: {
    //
    // Tell the server where to serve content from. This is only necessary
    // if you want to serve static files. `devServer.publicPath` will be used
    // to determine where the bundles should be served from, and takes
    // precedence.
    //
    contentBase: false,
    historyApiFallback: true, // allows access to dev server from arbitrary url (needed to load a route like `/users/5` for react-router),
    hot: true, // enable HMR on the server (i.e., webpack-dev-serer) by exposing the `module.hot` api to javascript code
    inline: true,
    progress: true,
    open: true,
    publicPath: "/" // must match the `output.publicPath` setting
  }
};
