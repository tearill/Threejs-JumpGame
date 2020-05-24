import { scene } from '../scene/index'
import Cuboid from '../block/cuboid'
import Cylinder from '../block/cylinder'
import ground from '../objects/ground'
import bottle from '../objects/bottle'

export default class GamePage {
  constructor(callbacks) {
    this.callbacks = callbacks
  }

  init() {
    this.scene = scene
    this.ground = ground
    this.bottle =  bottle
    this.scene.init()
    this.ground.init()
    this.bottle.init()
    this.addInitBlock()
    this.addGround()
    this.addBottle()
    this.bindTouchEvent()
    this.render()
  }
  
  // 绑定 touch 事件
  bindTouchEvent() {
    canvas.addEventListener('touchstart', this.touchStartCallback)
    canvas.addEventListener('touchend', this.touchEndCallback)
  }

  removeTouchEvent() {
    canvas.removeEventListener('touchstart', this.touchStartCallback)
    canvas.removeEventListener('touchend', this.touchEndCallback)
  }

  touchStartCallback = () => {
    console.log('touch start callback')
  }

  touchEndCallback = () => {
    console.log('touch end callback')
    this.bottle.rotate()
  }

  render() {
    this.scene.render()
    if (this.bottle) {
      this.bottle.update()
    }
    requestAnimationFrame(this.render.bind(this))
  }

  show() {
    // this.visible = true
  }

  hide() {
    // this.visible = false
  }

  addInitBlock() { // 添加初始化砖块
    const cuboidBlock = new Cuboid(-15, 0, 0)
    const cylinderBlock = new Cylinder(23, 0, 0)
    this.scene.instance.add(cuboidBlock.instance)
    this.scene.instance.add(cylinderBlock.instance)
  }

  addGround() { // 添加地板
    this.scene.instance.add(this.ground.instance)
  }
  
  addBottle() { // 添加跳跃的物体
    this.scene.instance.add(this.bottle.obj)
    this.bottle.showUp()
  }

  restart() {
    console.log('game page restart')
  }
}

