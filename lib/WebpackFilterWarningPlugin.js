// class WebpackFilterWarningPlugin {
//   constructor(options) {
//     this.options = options
//   }

//   apply(compiler) {
//     compiler.hooks.afterEmit.tap(
//       'WebpackFilterWarningPlugin',
//       (compilation) => {
//         compilation.warnings = (compilation.warnings).filter(
//           warning => !this.options.filter.test(warning.message)
//         )
//       }
//     )
//   }
// }

// module.exports = WebpackFilterWarningPlugin
