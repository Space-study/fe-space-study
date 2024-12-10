module.exports = {
    arrowParens: 'avoid',
    bracketSameLine: true,
    bracketSpacing: false,
    singleQuote: true,
    trailingComma: 'all',
    tabWidth: 2,
    jsxBracketSameLine: true,
    jsxSingleQuote: true,
    semi: false,
    printWidth: 100,
    importOrder: ['^@/core/(.*)$', '^@/app/(.*)$', '^@/packages/space-study/(.*)$', '^-(.*)$', '^[./]'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    organizeImportsSkipDestructiveCodeActions: true,
    endOfLine: 'crlf',
    plugins: [
      require.resolve('@trivago/prettier-plugin-sort-imports'), // sort-imports-ignore are skipped. You can also ignore sections by using // sort-imports-begin-ignore and // sort-imports-end-ignore
      require.resolve('prettier-plugin-organize-imports'), //Files containing the substring // organize-imports-ignore or // tslint:disable:ordered-imports are skipped
    ],
  }
  