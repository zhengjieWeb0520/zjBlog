// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // 'indent': [2, 4], // 缩进风格 - 开启缩进4格
    'no-spaced-func': 2, // 函数调用时 函数名与()之间不能有空格 - 开启
    'no-const-assign': 2, //禁止修改const声明的变量 - 开启
    'space-before-function-paren': [0, 'always'], // 函数定义时括号前面要有空格 - 关闭
    'eol-last': 0, // 文件以单一的换行符结束 - 关闭
    'camelcase': 0, // 强制驼峰法命名 - 关闭
    'no-undef': 0, // 不能有未定义的变量 - 关闭
    'no-alert': 0, // 禁止使用alert confirm prompt - 关闭
    'arrow-parens': 0, // 箭头函数用小括号括起来 - 关闭
    'no-console': [
      "error",
      {
        "allow": [
          "warn",
          "error"
        ]
      }
    ],
    'no-func-assign': 2 // 禁止重复的函数声明
  }
}
