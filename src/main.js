// js 逻辑入口
// 游戏主函数
import game from './game/game.js'
import * as THREE from '../libs/three.js' // 引入 Three.js
window.THREE = THREE // 挂载全局

class Main {
  constructor() {

  }
  static init() {
    game.init()
  }
}

export default Main
