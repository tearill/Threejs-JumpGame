// 小游戏入口
// console.log('game.js entry')
import './libs/weapp-adapter.js'
import * as THREE from './libs/three.js' // 引入 Three.js

var width = 375
var height = 667
// var canvas = document.getElementById('myCanvas')
var renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
var scene = new THREE.Scene() // 场景
var camera = new THREE.OrthographicCamera(-width / 2, width / 2, // 给定相机范围
  height / 2, -height / 2, -1000, 1000) // 正交相机 没有透视效果

renderer.setClearColor(new THREE.Color(0x000000)) // 设置清空之后的颜色
renderer.setSize(375, 667) // 设置大小

// 创建三角形对象
var triangleShape = new THREE.Shape()
triangleShape.moveTo(0, 100)
triangleShape.lineTo(-100, -100)
triangleShape.lineTo(100, -100)
triangleShape.lineTo(0, 100)

var geometry = new THREE.ShapeGeometry(triangleShape) // 创建几何体
var material = new THREE.MeshBasicMaterial({ // 材质
  color: 0xff0000,
  side: THREE.DoubleSide // 渲染双面
})
var mesh = new THREE.Mesh(geometry, material) // 建模渲染
mesh.position.x = 0
mesh.position.y = 0
mesh.position.z = 1
scene.add(mesh)

// 相机位置 - 中心
camera.position.x = 0
camera.position.y = 0
camera.position.z = 0
camera.lookAt(new THREE.Vector3(0, 0, 1)) // 望向放置三角形的位置

var currentAngle = 0
var lastTime = Date.now()

// 更新角度
var animate = function () {
  var now = Date.now()
  var duration = now - lastTime
  lastTime = now
  currentAngle = currentAngle + duration / 1000 * Math.PI
}

var render = function () {
  animate()
  // mesh.rotation.set(currentAngle, 0, 0) // 绕 x 轴旋转
  mesh.rotation.set(0, currentAngle, 0) // 绕 y 轴旋转
  // mesh.rotation.set(0, 0, currentAngle) // 绕 z 轴旋转
  renderer.render(scene, camera) // 渲染
  requestAnimationFrame(render) // 开启旋转动画
}

render()
