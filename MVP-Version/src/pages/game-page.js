import { scene } from '../scene/index'
import Cuboid from '../block/cuboid'
import Cylinder from '../block/cylinder'
import ground from '../objects/ground'

export default class GamePage {
  constructor(callbacks) {
    this.callbacks = callbacks
  }

  init() {
    this.scene = scene
    this.ground = ground
    this.scene.init()
    this.ground.init()
    this.addInitBlock()
    this.addGround()
    this.render()
  }

  render() {
    this.scene.render()
    requestAnimationFrame(this.render.bind(this))
  }

  show() {
    // this.visible = true
  }

  hide() {
    // this.visible = false
  }

  addInitBlock() {
    const cuboidBlock = new Cuboid(-15, 0, 0)
    const cylinderBlock = new Cylinder(23, 0, 0)
    this.scene.instance.add(cuboidBlock.instance)
    this.scene.instance.add(cylinderBlock.instance)
  }

  addGround() {
    this.scene.instance.add(this.ground.instance)
  }

  restart() {
    console.log('game page restart')
  }
}

