import sceneConf from '../../config/scene-config'

class Camera {
  constructor() {
    this.instance = null
  }

  init() {
    const aspect = window.innerHeight / window.innerWidth
    // OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )
    this.instance = new THREE.OrthographicCamera(-sceneConf.frustumSize, sceneConf.frustumSize,
      sceneConf.frustumSize * aspect, -sceneConf.frustumSize * aspect, -100, 85)
    this.instance.position.set(-10, 10, 10) // 改变相机位置
    this.target = new THREE.Vector3(0, 0, 0) // lookAt 望向
    this.instance.lookAt(this.target)
  }
}

export default new Camera()
