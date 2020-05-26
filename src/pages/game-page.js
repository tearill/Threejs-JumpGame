import { scene } from '../scene/index'
import Cuboid from '../block/cuboid'
import Cylinder from '../block/cylinder'
import ground from '../objects/ground'
import bottle from '../objects/bottle'
import blockConf from '../../config/block-config'
import gameConf from '../../config/game-config'
import bottleConf from '../../config/bottle-config'
import utils from '../utils/index'
import ScoreText from '../view3d/scoreText'

const HIT_NEXT_BLOCK_CENTER = 1
const HIT_CURRENT_BLOCK = 2
const GAME_OVER_NEXT_BLOCK_BACK = 3
const GAME_OVER_CURRENT_BLOCK_BACK = 4
const GAME_OVER_NEXT_BLOCK_FRONT = 5
const GAME_OVER_BOTH = 6
const HIT_NEXT_BLOCK_NORMAL = 7

export default class GamePage {
  constructor(callbacks) {
    this.callbacks = callbacks
    this.targetPosition = {}
    this.axis = null
    this.checkingHit = false
    this.score = 0
  }

  init() {
    this.scene = scene
    this.ground = ground
    this.bottle = bottle
    this.scoreText = new ScoreText()
    this.scene.init()
    this.ground.init()
    this.bottle.init()
    this.scoreText.init({
      fillStyle: 0x666699
    })
    this.addInitBlock()
    this.addGround()
    this.addBottle()
    this.addScore()
    this.bindTouchEvent()
    this.render()
  }

  // 绑定 touch 事件
  bindTouchEvent() {
    console.log('bind touch event')
    canvas.addEventListener('touchstart', this.touchStartCallback)
    canvas.addEventListener('touchend', this.touchEndCallback)
  }

  removeTouchEvent() {
    console.log('remove touch event')
    console.log(canvas, '-----canvas')
    // return
    canvas.removeEventListener('touchstart', this.touchStartCallback)
    canvas.removeEventListener('touchend', this.touchEndCallback)
  }

  touchStartCallback = (e) => {
    console.log('touch start callback')
    this.touchStartTime = Date.now()
    this.bottle.shrink()
    this.currentBlock.shrink()
  }

  touchEndCallback = (e) => {
    console.log('touch end callback')
    this.touchEndTime = Date.now()
    const duration = this.touchEndTime - this.touchStartTime // 按压的时间间隔
    // 初速度和加速度
    this.bottle.velocity.vx = Math.min(duration / 6, 400)
    this.bottle.velocity.vx = +this.bottle.velocity.vx.toFixed(2)
    this.bottle.velocity.vy = Math.min(150 + duration / 20, 400)
    this.bottle.velocity.vy = +this.bottle.velocity.vy.toFixed(2)

    this.bottle.stop()
    const initY = (1 - this.currentBlock.instance.scale.y) * blockConf.height // 下压高度 原始高度 - 当前高度
    this.hit = this.getHitStatus(this.bottle, this.currentBlock, this.nextBlock, initY)
    this.checkingHit = true
    this.bottle.rotate()
    this.currentBlock.rebound()
    this.bottle.jump(duration)
  }

  setDirection(direction) {
    const currentPosition = {
      x: this.bottle.obj.position.x,
      z: this.bottle.obj.position.z
    }

    this.axis = new THREE.Vector3(this.targetPosition.x - currentPosition.x, 0, this.targetPosition.z - currentPosition.z)
    this.axis.normalize()
    this.bottle.setDirection(direction, this.axis)
  }

  getHitStatus(bottle, currentBlock, nextBlock, initY) {
    // debugger
    let flyingTime = parseFloat(bottle.velocity.vy) / parseFloat(gameConf.gravity) * 2.0
    initY = initY || bottle.obj.position.y.toFixed(2)
    let time = +((bottle.velocity.vy - Math.sqrt(Math.pow(bottle.velocity.vy, 2) - 2 * initY * gameConf.gravity)) / gameConf.gravity).toFixed(2)
    flyingTime -= time
    flyingTime = +flyingTime.toFixed(2)
    const destination = []
    const bottlePosition = new THREE.Vector2(bottle.obj.position.x, bottle.obj.position.z)
    const translate = new THREE.Vector2(this.axis.x, this.axis.z).setLength(bottle.velocity.vx * flyingTime)
    bottlePosition.add(translate)
    bottle.destination = [+bottlePosition.x.toFixed(2), +bottlePosition.y.toFixed(2)]
    destination.push(+bottlePosition.x.toFixed(2), +bottlePosition.y.toFixed(2))

    const bodyWidth = 1.8141 * bottleConf.headRadius
    // nextBlock 的碰撞检测
    let result1, result2
    if (nextBlock) {
      const nextDiff = Math.pow(destination[0] - nextBlock.instance.position.x, 2) + Math.pow(destination[1] - nextBlock.instance.position.z, 2)
      const nextPolygon = nextBlock.getVertices() // 顶点
      if (utils.pointInPolygon(destination, nextPolygon)) { // 是否在范围之内
        if (Math.abs(nextDiff) < 5) { // 靠近中心
          result1 = HIT_NEXT_BLOCK_CENTER
        } else {
          result1 = HIT_NEXT_BLOCK_NORMAL
        }
      } else if (utils.pointInPolygon([destination[0] - bodyWidth / 2, destination[1]], nextPolygon) || utils.pointInPolygon([destination[0], destination[1] + bodyWidth / 2], nextPolygon)) {
        result1 = GAME_OVER_NEXT_BLOCK_BACK
      } else if (utils.pointInPolygon([destination[0] + bodyWidth / 2, destination[1]], nextPolygon) || utils.pointInPolygon([destination[0], destination[1] - bodyWidth / 2], nextPolygon)) {
        result1 = GAME_OVER_NEXT_BLOCK_FRONT
      }
    }

    if (currentBlock) {
      // currentBlock 的碰撞检测
      const currentPolygon = currentBlock.getVertices()
      if (utils.pointInPolygon(destination, currentPolygon)) {
        result2 = HIT_CURRENT_BLOCK
      } else if (utils.pointInPolygon([destination[0] - bodyWidth / 2, destination[1]], currentPolygon) || utils.pointInPolygon([destination[0], destination[1] + bodyWidth / 2], currentPolygon)) {
        if (result1) return GAME_OVER_BOTH // 举例过近两个 block 都碰到了
        result2 = GAME_OVER_CURRENT_BLOCK_BACK
      }
    }

    return result1 || result2 || 0
  }

  render() {
    if (this.currentBlock) {
      this.currentBlock.update()
    }
    this.scene.render()
    if (this.bottle) {
      this.bottle.update()
    }
    // if (!this.checkingHit) {
      this.checkBottleHit() // 判断碰撞
    // }
    // if (this.visible) {
    //   this.scene.render()
    // }
    requestAnimationFrame(this.render.bind(this))
  }

  checkBottleHit() {
    if (this.bottle.obj.position.y <= blockConf.height / 2 && this.bottle.status === 'jump' && this.bottle.flyingTime > 0.3) { // 到了砖块的高度之下
      this.checkingHit = true
      if (this.hit == HIT_NEXT_BLOCK_CENTER || this.hit == HIT_NEXT_BLOCK_NORMAL || this.hit == HIT_CURRENT_BLOCK) {
        // 在 nextBlock 或 currentBlock 上
        // 游戏继续
        this.bottle.stop()
        this.bottle.obj.position.y = blockConf.height / 2
        this.bottle.obj.position.x = this.bottle.destination[0]
        this.bottle.obj.position.z = this.bottle.destination[1]
        if (this.hit == HIT_NEXT_BLOCK_CENTER || this.hit == HIT_NEXT_BLOCK_NORMAL) {
          this.updateScore(++this.score)
          // 更新下一个砖块 block
          this.updateNextBlock()
        }
      } else {
        // 游戏结束 game over
        this.removeTouchEvent()
        this.callbacks.showGameOverPage()
        this.checkingHit = false
      }
    }
  }

  // 随机生成下一个 block
  updateNextBlock() {
    const seed = Math.round(Math.random())
    const type = seed ? 'cuboid' : 'cylinder' // 随机类型
    const direction = Math.round(Math.random()) // 随机方向 0 -> x 轴 | 1 -> y 轴
    const width = Math.round(Math.random() * 12) + 8 // 随机宽度
    const distance = Math.round(Math.random() * 20) + 20 // 随机远近
    this.currentBlock = this.nextBlock
    const targetPosition = this.targetPosition = {}
    if (direction == 0) { // x 轴
      targetPosition.x = this.currentBlock.instance.position.x + distance
      targetPosition.y = this.currentBlock.instance.position.y
      targetPosition.z = this.currentBlock.instance.position.z
    } else if (direction == 1) { // z 轴
      targetPosition.x = this.currentBlock.instance.position.x
      targetPosition.y = this.currentBlock.instance.position.y
      targetPosition.z = this.currentBlock.instance.position.z - distance
    }
    this.setDirection(direction) // 跳跃方向
    if (type == 'cuboid') {
      this.nextBlock = new Cuboid(targetPosition.x, targetPosition.y, targetPosition.z, width)
    } else if (type == 'cylinder') {
      this.nextBlock = new Cylinder(targetPosition.x, targetPosition.y, targetPosition.z, width)
    }
    this.scene.instance.add(this.nextBlock.instance)
    const cameraTargetPosition = { // 相机始终看向 currentBlock 和 nextBlock 的中心位置
      x: (this.currentBlock.instance.position.x + this.nextBlock.instance.position.x) / 2,
      y: (this.currentBlock.instance.position.y + this.nextBlock.instance.position.y) / 2,
      z: (this.currentBlock.instance.position.z + this.nextBlock.instance.position.z) / 2,
    }

    this.scene.updateCameraPosition(cameraTargetPosition)
    this.ground.updatePosition(cameraTargetPosition)
    // this.show()
  }

  show() {
    this.visible = true
  }

  hide() {
    this.visible = false
    // this.removeTouchEvent()
  }

  addInitBlock() { // 添加初始化砖块
    const cuboidBlock = this.currentBlock = new Cuboid(-15, 0, 0)
    const cylinderBlock = this.nextBlock = new Cylinder(23, 0, 0)
    this.targetPosition = {
      x: 23,
      y: 0,
      z: 0
    }
    const initPosition = 0
    this.scene.instance.add(cuboidBlock.instance)
    this.scene.instance.add(cylinderBlock.instance)
    this.setDirection(initPosition)
  }

  addGround() { // 添加地板
    this.scene.instance.add(this.ground.instance)
  }

  addBottle() { // 添加跳跃的物体
    this.scene.instance.add(this.bottle.obj)
    this.bottle.showUp()
  }

  addScore() {
    this.scene.addScore(this.scoreText.instance)
  }

  updateScore(score) {
    this.scoreText.updateScore(score)
    this.scene.updateScore(this.scoreText.instance)
  }

  // 重启游戏
  restart() {
    this.deleteObjectsFromScene()
    this.scene.reset()
    this.bottle.reset()
    this.ground.reset()
    // this.updateScore(0)
    this.addInitBlock()
    this.addGround()
    this.addBottle()
    this.bindTouchEvent()
  }

  // 清空场景中的物体
  deleteObjectsFromScene() {
    let obj = this.scene.instance.getObjectByName('block')
    while (obj) {
      this.scene.instance.remove(obj)
      if (obj.geometry) {
        obj.geometry.dispose()
      }
      if (obj.material) {
        obj.material.dispose()
      }
      obj = this.scene.instance.getObjectByName('block')
    }
    this.scene.instance.remove(this.bottle.obj)
    this.scene.instance.remove(this.ground.instance)
  }
}

