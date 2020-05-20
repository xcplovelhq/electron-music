const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  configureWebpack: {
    entry: "./src/renderer/main.js",
    resolve: {
      extensions: [".js", ".vue", ".json", ".ts", ".less"],
      alias: {
        "@": resolve("src/renderer")
      }
    }
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/renderer/less/theme.less")]
    },
    electronBuilder: {
      outputDir: "dist/electron",
      mainProcessFile: "src/main/index.js",
      mainProcessWatch: ["src/main"]
    }
  }
};
