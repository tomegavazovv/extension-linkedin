// Set the environment variables for development mode
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.ASSET_PATH = '/';

var WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('../webpack.config'),
  env = require('./env'),
  path = require('path');

var options = config.chromeExtensionBoilerplate || {};
var excludeEntriesToHotReload = options.notHotReload || [];

// Remove the hot-reload entries from config.entry
for (var entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    // No hot reloading scripts are added to these entries
    config.entry[entryName] = [
      `webpack-dev-server/client?hostname=localhost&port=${env.PORT}`,
    ].concat(config.entry[entryName]);
  }
}

delete config.chromeExtensionBoilerplate;

var compiler = webpack(config);

var server = new WebpackDevServer(
  {
    https: false,
    hot: false, // Ensure that hot reloading is turned off
    liveReload: false, // Prevent automatic reloads when files change
    client: {
      webSocketTransport: 'ws',
      overlay: false, // Turn off error overlays
    },
    webSocketServer: 'ws',
    host: 'localhost',
    port: env.PORT,
    static: {
      directory: path.join(__dirname, '../build'),
    },
    devMiddleware: {
      publicPath: `http://localhost:${env.PORT}/`,
      writeToDisk: true, // Write files to disk for easy inspection
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
  },
  compiler
);

// Start the Webpack Dev Server
(async () => {
  try {
    await server.start();
    console.log(`Server is running on http://localhost:${env.PORT}`);
  } catch (err) {
    console.error('Error starting server:', err);
  }
})();
