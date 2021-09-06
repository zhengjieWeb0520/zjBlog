/*
 * @Author: 郑杰14
 * @Date: 2021-04-13 21:26:55
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-13 21:27:23
 * @Description:
 */
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false
      }
    ],
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'lib',
        style: 'css'
      },
      'ant'
    ]
  ]
}
