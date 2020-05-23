import BaseBlock from './base'

export default class Cylinder extends BaseBlock {
  constructor(x, y, z, width) {
    super('cylinder')
    const size = width || this.width
    // CylinderGeometry(radiusTop : Float, radiusBottom : Float, 
    // height : Float, radialSegments : Integer, heightSegments : Integer, 
    // openEnded : Boolean, thetaStart : Float, thetaLength : Float)
    const geometry = new THREE.CylinderGeometry(size / 2, size / 2, this.height, 120) // 顶面底面圆的半径、高度,
    // radialSegments 由多少个三角形组成 三角形越多越接近一个圆
    const material = new THREE.MeshPhongMaterial({ // 材质
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