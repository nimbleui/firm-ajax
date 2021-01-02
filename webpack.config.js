/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const bodyParser = require("body-parser");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
  const mode = env.NODE_ENV;
  const plugins = [];
  const entry = {};
  if (mode === "production") {
    entry.firmAjax = "./lib/index.ts";
    entry["firmAjax.min"] = "./lib/index.ts";
    plugins.push(new CleanWebpackPlugin());
  } else {
    plugins.push(
      new HtmlWebpackPlugin({
        template: "./examples/index.html",
      })
    );
    entry.firmAjax = "./examples/index.ts";
  }

  return {
    mode: "development",
    entry: entry,
    devtool: "cheap-source-map",
    output: {
      filename: "[name].js",
      library: "firmAjax",
      libraryTarget: "umd",
      path: path.resolve(__dirname, "./dist"),
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["ts-loader"],
        },
        {
          test: /\.(js|ts)$/,
          loader: "eslint-loader",
          enforce: "pre",
          include: [path.join(__dirname, "lib")],
          options: {
            fix: true,
          },
        },
      ],
    },
    devServer: {
      contentBase: path.resolve(__dirname, "./dist"),
      port: 9000,
      before: function (app) {
        app.use(bodyParser.json());
        app.get("/api/get", (req, res) => {
          const query = req.query;
          res.json({
            Code: 0,
            Data: {
              query: query,
            },
            Massage: "请求成功",
          });
        });

        app.get("/api/get/error", (req, res) => {
          const query = req.query;
          res.json({
            Code: 1,
            Data: { query },
            Massage: "请求失败",
          });
        });

        app.delete("/api/delete", (req, res) => {
          const query = req.query;
          const body = req.body;
          res.json({
            Code: 0,
            Data: { query, body },
            Massage: "请求成功",
          });
        });

        app.post("/api/post", (req, res) => {
          const body = req.body;
          res.json({
            Code: 0,
            Data: { body },
            Massage: "请求成功",
          });
        });
      },
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          include: /min/,
          parallel: true,
        }),
      ],
    },
    plugins: plugins,
  };
};
