/**
 * 防多次点击，重复提交
 */
 export const preventReClick = Vue.directive('preventReClick', {
  inserted: function (el, binding) {
      el.addEventListener('click', () => {
          if (!el.disabled) {
              el.disabled = true
              setTimeout(() => {
                  el.disabled = false
              }, binding.value || 3000)
          }
      })
  }
})