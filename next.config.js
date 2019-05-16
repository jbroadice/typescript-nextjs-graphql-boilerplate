const path = require('path');
const withPlugins = require('next-compose-plugins');
const typescript = require('@zeit/next-typescript');
const sass = require('@zeit/next-sass');
const bundleAnalyzer = require('@zeit/next-bundle-analyzer');
const transpileModules = require('@weco/next-plugin-transpile-modules');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
// const WebpackFilterWarningPlugin = require('./lib/WebpackFilterWarningPlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

// next.js configuration
const nextConfig = {
  poweredByHeader: false,

  useFileSystemPublicRoutes: false,

  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '_variables.sass': path.resolve(__dirname, 'sass/_variables.scss')
    };

    // Service Worker
    config.plugins.push(
      new SWPrecacheWebpackPlugin({
        verbose: true,
        staticFileGlobsIgnorePatterns: [/\.next\//],
        runtimeCaching: [
          {
            handler: 'networkFirst',
            urlPattern: /^https?.*/
          }
        ]
      })
    );

    // Load .graphql files
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
    });

    // TypeScript type checking
    if (env === 'development' && !isServer) {
      config.plugins.push(new ForkTsCheckerWebpackPlugin({
        async: false,
      }));

      config.resolve.modules.unshift(__dirname);
    }

    // Filter mini-css-extract-plugin 'conflicting order' warnings
    // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250#issuecomment-426102538
    if (env === 'development') {
      // config.plugins.push(
      //   new WebpackFilterWarningPlugin({
      //     filter: /chunk styles \[mini-css-extract-plugin]\nConflicting order between:/
      //   })
      // );
    }

    return config;
  }
}

module.exports = withPlugins([

  // Typescript
  [typescript, {}],

  // node-sass
  [sass, {}],

  // webpack-bundle-analyzer
  [bundleAnalyzer, {
    analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: 'static',
        reportFilename: '../../bundles/server.html'
      },
      browser: {
        analyzerMode: 'static',
        reportFilename: '../bundles/client.html'
      }
    }
  }],

  // Transpile untranspiled node_modules
  [transpileModules, {
    transpileModules: ['lodash-es']
  }]

], nextConfig);
