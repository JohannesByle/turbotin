const CompressionPlugin = require("compression-webpack-plugin");
const zlib = require("zlib");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const { BROTLI_MAX_QUALITY, BROTLI_PARAM_QUALITY } = zlib.constants;

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new CompressionPlugin({
      algorithm: "brotliCompress",
      threshold: 10240,
      compressionOptions: {
        params: {
          [BROTLI_PARAM_QUALITY]: BROTLI_MAX_QUALITY,
        },
      },
    }),
  ],
});
