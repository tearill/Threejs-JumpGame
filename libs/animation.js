// 封装动画绘制逻辑
/**
 * @description animation library
 * @detail requestAnimationFrame
 * 1. duration 
 * 2. from
 * 3. to
 * 4. type (linear 等)
 */

import { Tween } from './tween'
console.log(Tween.Quad.easeIn, 'Linear------')

var customAnimation = exports.customAnimation = {}

customAnimation.to = function (duration, from, to, type, delay) { // 状态转换
  // console.log(type, '---type!!!')
  // return 
  // console.log(from, '+++++++')
  for (let prop in to) {
    // 使用闭包防止异步 setTimeout 计时结束之后循环中 prop 值已经改变了导致的问题
    // 闭包记录当前 setTimeout 中 prop 的 name 
    setTimeout(function (prop) {
      return function () {
        TweenAnimation(from[prop], to[prop], duration, type, function (value) {
          from[prop] = value
        })
      }
    }(prop), delay * 1000);
    // console.log(from.x, from.y, from.z, duration, type, '-----prop')
    // console.log(to.x, to.y, to.z, '-----prop to')
  }
}

var TweenAnimation = exports.TweenAnimation = function TweenAnimation(from, to, duration = 300, type = 'Linear', callback) { // 完成某一个相应的属性在某一个数学模型下在某一个时间点具有的值
  // 逐帧绘制
  const options = {
    callback: function () { },
    // type: 'Linear',
    // duration: 300
  }
  if (callback) {
    options.callback = callback
  }

  if (type) {
    options.type = type
  }

  if (duration) {
    options.duration = duration
  }

  const frameCount = Math.ceil(duration * 1000 / 17) // 渲染帧数
  let start = -1 // 当前渲染帧数

  const startTime = Date.now() // 开始时间
  let lastTime = Date.now() // 上一次动画时间

  // 获取数学模型
  const getFunc = function(Tween, type) {
    return type.split('.').reduce((acc, cur) => acc && acc[cur], Tween)
  }
  const tweenFn = getFunc(Tween, type) // 拿到对应的数学模型

  // 一帧要完成的事情
  // 绘制一帧
  const step = function step() {
    const currentTime = Date.now()
    const interval = currentTime - lastTime

    let fps

    if (interval) {
      fps = Math.ceil(1000 / interval)
    } else {
      requestAnimationFrame(step)
      return
    }

    // if (interval <= 1000) {
    if (fps >= 30) {
      // 绘制下一帧
      start++
    } else {
      // 跳过某些帧
      const _start = Math.floor(interval / 17)
      start = start + _start
    }

    // console.log(interval, start, frameCount)

    // 通过数学模型计算位置
    const value = tweenFn(start, from, to - from, frameCount)

    if (start <= frameCount) {
      // 没有全部走完 动画未结束
      options.callback(value)
      requestAnimationFrame(step)
    } else {
      // 动画结束
      options.callback(to, true) // 把最终位置交给回调函数
    }

    lastTime = Date.now()

    // requestAnimationFrame(step)
  }

  step()
}
