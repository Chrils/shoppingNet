//根据程序运行模式选择是否应用插件
// const prodPlugins = process.env.NODE_ENV === 'production' ? [] : [
//   'transform-remove-console',
// ]

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins:[
    // ...prodPlugins
  ]
}
