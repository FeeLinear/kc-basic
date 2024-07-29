module.exports = function changeSelector(selector, util) {
  // element-ui这几个样式太宽泛，需减小范围
  switch (selector) {
      case '.el-button:active':
      case '.el-button:focus,.el-button:hover':
          return util.changeEach(selector, '.el-button--default:not(.is-plain):not(.el-button--primary)')
      case '.el-button.is-active,.el-button.is-plain:active':
          return util.changeEach(selector, ':not(.el-button--primary)')
      case '.el-button.is-plain:active':
      case '.el-button.is-plain:focus,.el-button.is-plain:hover':
          return util.changeEach(selector, '.el-button--default')
      case '.el-button.active,.el-button.hover,.el-button:focus,.el-button:hover':
          return '.el-button.active'
      case '.el-pagination button:hover':
          return selector + ':not(:disabled)'
      case '.el-pagination.is-background .el-pager li:not(.disabled):hover':
          return selector + ':not(.active)'
      case '.el-tag':
          return selector + ':not(.el-tag--dark):not(.el-tag--info)'
      case '.el-tabs__item.is-active':
          return selector + ':not(.is-disabled)'
      case '.el-tabs__item:hover':
          return '.el-tabs__item:not(.is-disabled):hover'
      case '.el-radio-button__orig-radio:checked + .el-radio-button__inner':
          return '.el-radio-button__orig-radio:not(:disabled):checked + .el-radio-button__inner'
      case '.el-tag:not(.el-tag--dark)':
          return util.changeEach(selector, '.el-tag:not(.el-tag--dark):not(.el-tag--info)')
      default:
          return selector
  }
}
