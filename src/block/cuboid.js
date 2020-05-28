import BaseBlock from './base'
import utils from '../utils/index'
import blockConf from '../../config/block-config'

export default class Cuboid extends BaseBlock {
  constructor(x, y, z, name, width) {
    super('cuboid')
    this.loader = new THREE.TextureLoader()
    const size = width || this.width
    // const material = new THREE.MeshPhongMaterial({ // 材质
    //   // - MeshBasicMaterial 没有光照模型，不会响应任何光照效果
    //   color: 0xffffff
    // })
    if (name === 'color') {
      let currentColor
      const seed = Math.floor(Math.random() * 6)
      switch (seed) {
        case 0:
          currentColor = blockConf.colors.orange
          break
        case 1:
          currentColor = blockConf.colors.orangeDark
          break
        case 2:
          currentColor = blockConf.colors.green
          break
        case 3:
          currentColor = blockConf.colors.blue
          break
        case 4:
          currentColor = blockConf.colors.yellow
          break
        case 5:
          currentColor = blockConf.colors.purple
          break
        default:
          break
      }
      const innerMaterial = new THREE.MeshLambertMaterial({ color: blockConf.colors.white })
      const outerMaterial = new THREE.MeshLambertMaterial({ color: currentColor })

      const innerHeight = 3
      const outerHeight = (blockConf.height - innerHeight) / 2
      const outerGeometry = new THREE.BoxGeometry(size, outerHeight, size)
      const innerGeometry = new THREE.BoxGeometry(size, innerHeight, size)

      const totalMesh = new THREE.Object3D()
      const topMesh = new THREE.Mesh(outerGeometry, outerMaterial)
      topMesh.position.y = (innerHeight + outerHeight) / 2
      topMesh.receiveShadow = true
      topMesh.castShadow = true
      
      const middleMesh = new THREE.Mesh(innerGeometry, innerMaterial)
      middleMesh.receiveShadow = true
      middleMesh.castShadow = true

      const bottomMesh = new THREE.Mesh(outerGeometry, outerMaterial)
      bottomMesh.position.y = -(innerHeight + outerHeight) / 2
      bottomMesh.receiveShadow = true
      bottomMesh.castShadow = true

      totalMesh.add(topMesh)
      totalMesh.add(middleMesh)
      totalMesh.add(bottomMesh)
      this.instance = totalMesh

    } else if (name === 'well') { // 井
      const geometry = new THREE.BoxGeometry(size, this.height, size) // 长宽高
      const material = new THREE.MeshLambertMaterial({
        map: this.loader.load('resource/images/well.png')
      })
      utils.mapUv(280, 428, geometry, 1, 0, 0, 280, 148) // 前侧
      utils.mapUv(280, 428, geometry, 2, 0, 148, 280, 428) // 顶部
      utils.mapUv(280, 428, geometry, 4, 0, 0, 280, 148, true) // 右侧
      this.instance = new THREE.Mesh(geometry, material)
    }
    // this.instance = new THREE.Mesh(geometry, material) // Mesh 网格
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
