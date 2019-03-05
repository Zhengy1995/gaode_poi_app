import {message} from './variables'

let messageBox = (_this, status, msg) => {
  switch (status) {
    case message.INFO :
      _this.$notify.info({
        title: '提示',
        message: msg
      })
      break
    case message.SUCCESS :
      _this.$notify({
        title: '成功',
        message: msg,
        type: 'success'
      })
      break
    case message.ERROR :
      _this.$notify.error({
        title: '错误',
        message: msg
      })
      break
  }
}

export {messageBox}
