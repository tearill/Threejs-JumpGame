import camera from './camera'
import light from './light'
import background from '../objects/background'

class Scene {
  constructor() {
    this.instance = null
  }

  init() {
    this.instance = new THREE.Scene()
    const renderer = this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true, // 抗锯齿
      preserveDrawingBuffer: true // 保存绘制缓冲区
    })

    // 调用 camera
    this.camera = camera
    this.light = light
    this.camera.init() // 初始化相机
    this.light.init() // 初始化灯光

    this.axesHelper = new THREE.AxesHelper(100)
    this.instance.add(this.axesHelper)
    this.instance.add(this.camera.instance)
    for (let lightType in this.light.instances) {
      this.instance.add(this.light.instances[lightType])
    }

    this.background = background
    this.background.init()
    this.background.instance.position.z = -84
    this.camera.instance.add(this.background.instance)
  }

  render() {
    this.renderer.render(this.instance, this.camera.instance)
  }
}

export default new Scene()
