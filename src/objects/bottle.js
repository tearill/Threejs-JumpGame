// Bottle 形状
// 四个部分：  
// 上方头部：  
// 1. OctahedronGeometry  
// 下方身体部分：  
// 2. 最上方部分：一个 SphereGeometry 构成的半球  
// 3. 中间部分：一个 CylinderGeometry 构成的圆柱  
// 4. 底部：一个 CylinderGeometry 构成的圆台  

import bottleConf from '../../config/bottle-config'
import blockConf from '../../config/block-config'
import { customAnimation } from '../../libs/animation'

class Bottle {
  constructor() {
    this.status = 'stop'
    this.direction = 1
    this.axis = null // 跳跃所沿着的轴
    this.scale = 1
  }

  init() {
    this.loader = new THREE.TextureLoader() // 加载纹理
    // console.log(this.loader)
    // 将各个部分放在同一个 object 中管理，方便作为一个整体管理
    // 在 3D object 中添加 bottle 的各个部分
    this.obj = new THREE.Object3D()
    this.obj.name = 'bottle'
    this.obj.position.set(bottleConf.initPosition.x, 
      bottleConf.initPosition.y + 30, bottleConf.initPosition.z) // 设置 bottle 初始位置
    // 调整 bottle 的位置向上移动到 block 砖块的顶部中心

    const { specularMaterial, middleMaterial, bottomMaterial } = this.loadTexture()
    
    this.bottle = new THREE.Object3D() // 组合 bottle 的所有元素 (geometry)
    this.human = new THREE.Object3D()

    const headRadius = bottleConf.headRadius // 头部的半径

    // 头部
    this.head = new THREE.Mesh(
      new THREE.OctahedronGeometry(headRadius), // 菱形
      bottomMaterial
    )
    this.head.castShadow = true // 投射阴影

    this.body = new THREE.Object3D() // 组合 bottle 的身体部分

    const topGeometry = new THREE.SphereGeometry( // 球体形状
      headRadius / 1.4, 20, 20
    )
    topGeometry.scale(1, 0.54, 1)

    // 身体部分的顶部半球
    const top = new THREE.Mesh(
      topGeometry,
      specularMaterial
    )
    top.castShadow = true
    top.position.x = 0
    top.position.y = 1.8143 * headRadius
    top.position.z = 0

    // 身体部分的中间部分
    const middle = new THREE.Mesh( 
      new THREE.CylinderGeometry(
        headRadius / 1.4,
        headRadius / 1.44 * 0.88,
        headRadius * 1.2,
        20
      ),
      middleMaterial
    )
    middle.castShadow = true // 投射阴影
    middle.position.x = 0
    middle.position.y = 1.3857 * headRadius
    middle.position.z = 0

    // 身体部分的底部
    const bottom = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.62857 * headRadius, // 顶面半径
        0.907143 * headRadius, // 底面半径
        1.91423 * headRadius, // 高
        20 // segments 模拟成一个圆
      ), // 上下面圆半径不同构成圆台
      bottomMaterial
    )
    bottom.castShadow = true // 投射阴影

    this.head.position.x = 0
    // 7.56 / 2.1168 维持比例防止 headRadius 改变影响整个 bottle 的尺寸
    this.head.position.y = 3.57143 * headRadius // 调整位置，向下移
    this.head.position.z = 0

    // 组合到 body 身体中
    this.body.add(top)
    this.body.add(middle)
    this.body.add(bottom)

    // 组合到 bottle 整体中
    this.human.add(this.head)
    this.human.add(this.body)

    this.bottle.add(this.human)

    this.bottle.position.x = 0
    this.bottle.position.y = 2.2 // 上移
    this.bottle.position.z = 0

    // 最终构建到 obj 中统一管理
    this.obj.add(this.bottle)
  }

  loadTexture() {
    const specularTexture = this.loader.load('/game/resource/images/head.png')
    const specularMaterial = new THREE.MeshBasicMaterial({
      // color: 0x800080 // 红色
      map: specularTexture
    })
    const middleTexture = this.loader.load('/game/resource/images/middle.png')
    const middleMaterial = new THREE.MeshBasicMaterial({
      map: middleTexture
    })
    const bottomTexture = this.loader.load('/game/resource/images/bottom.png')
    const bottomMaterial = new THREE.MeshBasicMaterial({
      map: bottomTexture
    })
    return { specularMaterial, middleMaterial, bottomMaterial }
  }

  
  // 游戏开局 bottle 从天而降
  showUp() {
    customAnimation.to(this.obj.position, 0.5, {
      x: bottleConf.initPosition.x, 
      y: bottleConf.initPosition.y + blockConf.height / 2,
      z: bottleConf.initPosition.z
    }, 'BounceEaseOut')
  }
  
  setDirection(direction, axis) {
    this.direction = direction
    this.axis = axis
  }
  
  // 收缩蓄力
  shrink() {
    this.status = 'shrink'
  }

  // 按压收缩蓄力效果实现
  _shrink() {
    const MIN_SCALE = 0.55 // 压缩的最大范围
    const HORIZON_DELTA_SCALE = 0.007
    const DELTA_SCALE = 0.005
    const HEAD_DELTA = 0.03

    this.scale -= DELTA_SCALE
    this.scale = Math.max(MIN_SCALE, this.scale)
    if (this.scale <= MIN_SCALE) {
      return
    }

    this.body.scale.y = this.scale
    this.body.scale.x += HORIZON_DELTA_SCALE
    this.body.scale.z += HORIZON_DELTA_SCALE
    this.head.position.y -= HEAD_DELTA

    const bottleDeltaY = HEAD_DELTA / 2 
    this.obj.position.y -= bottleDeltaY
  }

  stop() {
    this.scale = 1 // 还原
    this.status = 'stop'
  }
  
  rotate() {
    const scale = 1.4
    this.human.rotation.x = this.human.rotation.z = 0
    if (this.direction == 0) { // 沿 x 轴跳跃
      customAnimation.to(this.human.rotation, 0.14, {z: this.human.rotation.z - Math.PI})
      customAnimation.to(this.human.rotation, 0.18, {z: this.human.rotation.z - 2 * Math.PI}, 'Linear', 0.14)
      customAnimation.to(this.head.position, 0.1, { y: this.head.position.y + 0.9 * scale, x: this.head.position.x + 0.45 * scale })
      customAnimation.to(this.head.position, 0.1, { y: this.head.position.y - 0.9 * scale, x: this.head.position.x - 0.45 * scale}, 'Linear', 0.1)
      customAnimation.to(this.head.position, 0.15, { y: 7.56, x: 0}, 'Linear', 0.25)
      customAnimation.to(this.body.scale, 0.1, { y: Math.max(scale, 1), x: Math.max(Math.min(1 / scale, 1), 0.7), z: Math.max(Math.min(1 / scale, 1), 0.7) })
      customAnimation.to(this.body.scale, 0.1, { y: Math.min(0.9 / scale, 0.7), x: Math.max(scale, 1.2), z: Math.max(scale, 1.2)}, 'Linear', 0.1)
      customAnimation.to(this.body.scale, 0.3, { y: 1, x: 1, z: 1}, 'Linear', 0.2 )
    } else if (this.direction == 1) { // 沿 y 轴跳跃
      customAnimation.to(this.human.rotation, 0.14, { x: this.human.rotation.x - Math.PI })
      customAnimation.to(this.human.rotation, 0.18, { x: this.human.rotation.x - 2 * Math.PI}, 'Linear', 0.14)
      customAnimation.to(this.head.position, 0.1, { y: this.head.position.y + 0.9 * scale, z: this.head.position.z - 0.45 * scale })
      customAnimation.to(this.head.position, 0.1, { z: this.head.position.z + 0.45 * scale, y: this.head.position.y - 0.9 * scale}, 'Linear', 0.1)
      customAnimation.to(this.head.position, 0.15, { y: 7.56, z: 0}, 'Linear', 0.25)
      customAnimation.to(this.body.scale, 0.05, { y: Math.max(scale, 1), x: Math.max(Math.min(1 / scale, 1), 0.7), z: Math.max(Math.min(1 / scale, 1), 0.7) })
      customAnimation.to(this.body.scale, 0.05, { y: Math.min(0.9 / scale, 0.7), x: Math.max(scale, 1.2), z: Math.max(scale, 1.2)}, 'Linear', 0.1)
      customAnimation.to(this.body.scale, 0.2, { y: 1, x: 1, z: 1, }, 'Linear', 0.2)
    }
  }
  
  jump() {
    this.status = 'jump'
  }
  
  _jump() {
    
  }

  // bottle 位置的更新
  update() {
    if (this.status === 'shrink') {
      // 收缩
      this._shrink()
    }
    this.head.rotation.y += 0.06 // 顶部菱形旋转
  }
}

export default new Bottle()
