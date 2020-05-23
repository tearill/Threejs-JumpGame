import BaseBlock from './base'

export default class Cuboid extends BaseBlock {
  constructor(x, y, z, width) {
    super('cuboid')
    const size = width || this.width
    const geometry = new THREE.BoxGeometry(size, this.height, size) // 长宽高
    const material = new THREE.MeshPhongMaterial({ // 材质
      // - MeshBasicMaterial 没有光照模型，不会响应任何光照效果
      color: 0xffffff
    })
    this.instance = new THREE.Mesh(geometry, material) // Mesh 网格
    this.instance.receiveShadow = true // 物体接收阴影
    this.instance.name = 'block'
    this.x = x
    this.y = y
    this.z = z
    this.instance.castShadow = true // 物体可以投射阴影
    this.instance.position.x = x
    this.instance.position.y = y
    this.instance.position.z = z
  }
}
