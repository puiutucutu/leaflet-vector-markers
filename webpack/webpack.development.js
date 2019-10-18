const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackBaseConfig = require("./webpack.base");

// devServer is only activated when explicitly calling webpack-dev-server
// through a package.json script
module.exports = Object.assign({}, webpackBaseConfig, {
  entry: {
    "leaflet-vector-markers": [
      "@babel/polyfill", // emulates ES2015 environment for browsers on runtime
      path.resolve("dev", "index.js")
    ]
  },
  output: {
    ...webpackBaseConfig.output,
    ...{
      publicPath: "/",
      path: path.resolve("dev")
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true, // suffixes asset filenames with a hash like `styles.css?564201b6c8cc6c0a1d8e` for cache busting
      inject: true,
      template: path.resolve("dev/index.html")
    })
  ],
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
});
