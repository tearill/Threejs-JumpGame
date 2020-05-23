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
    this.instance.name = 'block'
    this.x = x
    this.y = y
    this.z = z
    this.instance.position.x = x
    this.instance.position.y = y
    this.instance.position.z = z
  }
}