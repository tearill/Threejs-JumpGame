export default class GameOverPage {
  constructor(callbacks) {
    this.callbacks = callbacks
  }

  init(options) {
    console.log('game over page init')
    this.initGameOverCanvas(options)
    console.log(options, '+++++')
  }

  initGameOverCanvas(options) {
    const aspect = window.innerHeight / window.innerWidth
    // this.scene = options.scene
    this.canvas = document.createElement('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.texture = new THREE.Texture(this.canvas) // 纹理
    this.material = new THREE.MeshBasicMaterial({ // 材质
      map: this.texture,
      transparent: true,
      side: THREE.DoubleSide
    })
    this.geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight) // 形状
    // 生成 Mesh 建模
    this.obj = new THREE.Mesh(this.geometry, this.material)
    this.obj.position.z = 1
    this.obj.rotation.y = Math.PI // 绕 y 轴旋转 180 度
    // 图形绘制
    this.context = this.canvas.getContext('2d')
    this.context.fillStyle = '#333'
    this.context.fillRect((window.innerWidth - 200) / 2, (window.innerHeight - 100) / 2, 200, 100)
    this.context.fillStyle = '#eee'
    this.context.font = '20px Georgia'
    this.context.fillText('Game Over', (window.innerWidth - 200) / 2 + 50, (window.innerHeight - 100) / 2 + 55)
    this.texture.needsUpdate = true
    this.obj.visible = false
    // this.scene.add(this.obj)
  }

  show() {
    // console.log('game over page show')
    this.obj.visible = true
  }

  hide() {
    this.obj.visible = false
  }
}
