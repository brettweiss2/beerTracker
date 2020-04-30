// message.js
 class Message {
   // 省略...
   show({ type = 'info', text = '', duration = 2000, closeable = false }) {
    let containerEl = document.getElementById('app');
   // 创建一个Element对象
   let messageEl = document.createElement('div');
   // 设置消息class，这里加上move-in可以直接看到弹出效果
   messageEl.className = 'message move-in';
   // 消息内部html字符串
   messageEl.innerHTML = `
   <span class="icon icon-${type}"></span>
   <div class="text">${text}</div>
   `;
   // 是否展示关闭按钮
   if (closeable) {
   // 创建一个关闭按钮
   let closeEl = document.createElement('div');
   closeEl.className = 'close icon icon-close';
   // 把关闭按钮追加到message元素末尾
   messageEl.appendChild(closeEl);
   // 监听关闭按钮的click事件，触发后将调用我们的close方法
   // 我们把刚才写的移除消息封装为一个close方法
   closeEl.addEventListener('click', () => {
   this.close(messageEl)
   });
   }
   // 追加到message-container末尾
   // this.containerEl属性是我们在构造函数中创建的message-container容器
   containerEl.appendChild(messageEl);
   // 只有当duration大于0的时候才设置定时器，这样我们的消息就会一直显示
   if (duration > 0) {
   // 用setTimeout来做一个定时器
   setTimeout(() => {
   this.close(messageEl);
   }, duration);
   } 
   }
   /**
   * 关闭某个消息
   * 由于定时器里边要移除消息，然后用户手动关闭事件也要移除消息，所以我们直接把移除消息提取出来封装成一个方法
   * @param {Element} messageEl 
   */
   close(messageEl) {
   // 首先把move-in这个弹出动画类给移除掉，要不然会有问题，可以自己测试下
   messageEl.className = messageEl.className.replace('move-in', '');
   // 增加一个move-out类
   messageEl.className += 'move-out';
   // 这个地方是监听动画结束事件，在动画结束后把消息从dom树中移除。
   // 如果你是在增加move-out后直接调用messageEl.remove，那么你不会看到任何动画效果
   messageEl.addEventListener('animationend', () => {
   // Element对象内部有一个remove方法，调用之后可以将该元素从dom树种移除！
   messageEl.remove();
   });
   }
  }