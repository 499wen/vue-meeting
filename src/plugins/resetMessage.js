import { Message } from 'element-ui';
let messageInstance = null;
const resetMessage = (options) => {
    if(messageInstance) {
      messageInstance.close()
    }
    messageInstance = Message(options)
  }
;
['error','success','info','warning'].forEach(type => {
  resetMessage[type] = (options) => {
    let opt = {
      type,
      message: ''
    }
    if(typeof options === 'string' || typeof options === 'number') {
      opt.message = options
    }
    opt.type = type;
    return resetMessage(opt);
  }
});
export default resetMessage