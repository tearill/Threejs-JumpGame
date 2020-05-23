class Event {
  constructor(sender) {
    this._sender = sender
    this._listeners = [] // 事件对应的回调函数
  }

  attach(callback) {
    // 绑定事件和对应回调函数
    this._listeners.push(callback)
  }

  notify(args) {
    // 将回调函数全部执行一遍
    for (let i = 0; i < this._listeners.length; i++) {
      this._listeners[i](this._sender, args)
    }
  }
}

export default Event
