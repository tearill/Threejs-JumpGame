// 背景地面
class Ground {
  constructor() {

  }

  init() {
    const groundGeometry = new THREE.PlaneGeometry(200, 200)
    const material = new THREE.ShadowMaterial({
      transparent: true,
      color: 0x000000,
      opacity: 0.3
    })

    this.instance = new THREE.Mesh(groundGeometry, material)
    this.instance.rotation.x = -Math.PI / 2 // 旋转 90 度
    this.instance.position.y = -16 / 3.2
    this.instance.receiveShadow = true // 地面接收阴影
  }

  updatePosition(targetPosition) {
    this.instance.position.x = targetPosition.x
    this.instance.position.z = targetPosition.z
  }
}

export default new Ground()
