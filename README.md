# Three.js 模拟实现微信跳一跳小游戏  

## 需求分析  
MVP 最小可行产品(Minimum Viable Product)  
快速构建出符合预期功能的最小功能集合，包含的功能足以满足产品部署的要求并能够检验有关客户与产品交互的关键假设  
用最快、最简明的方式建立一个可用的产品原型  
- MVP 版本  
  核心逻辑：  
  1. 整体场景的搭建，生成设置(scene 搭建、camera 位置放置、光照/光源、物体阴影)  
    根据最终效果对正交相机和平行光的位置进行调整  
  2. 物体降落的逻辑(开场时物体从天而降)  
    游戏初始化时，current Block 初始化在 scene 中渲染，在代码逻辑中生成渲染 next Block  
    跳跃成功后，current Block = next Block 生成新的 next Block 渲染到场景中  
  3. 跳跃过程逻辑(物理引擎-跳跃过程要遵循物理引擎的模拟，模拟真实跳跃的效果)  
    用户按下面板时，bottle 开始跳跃，跳跃的过程是水平向初速度恒定的匀速直线运动向上竖直方向上的竖直上抛运动  
    在用户点击跳跃时，不等跳跃动画完成，根据跳跃的方向和速度，立即完成碰撞检测，并改变相关状态  
    用户点击跳跃时，物体同时进行循环  
  4. 跳跃结果逻辑(碰撞检测-物体碰撞产生新的逻辑)  
    在用户点击跳跃时，不等跳跃动画完成，根据跳跃的方向和速度，立即完成碰撞检测，并改变相关状态  
    具体碰撞检测的方式是通过速度和重力加速数据情况下，通过计算判断 bottle 是否还在下一个 block 上  
  5. 分数累计计算  
    通过计算判断 bottle 是否还在下一个 block 上，如果在，分数 +1，否则游戏结束  
  6. 分数上传到 CloudStorage  
    当游戏结束时，使用 cloudStorage 将数据传到微信服务器  

- 动画优化版本  
  1. 降落的弹性  
  2. 粒子聚集的效果  
  3. 跳跃尾部动态优化  
  4. 跳跃失败动画  
  5. 物体降落弹性动画  

- 社交优化版本  
  1. 分享到微信群  
  2. 分享给朋友  
  3. 增加排行榜  
  4. 观战模式  

- 最终完善版本  
  整体逻辑优化  
  1. 增加开始页面  
  2. 优化积分策略(跳跃到中心、连续跳跃到中心等)  
  3. 增加音乐效果  
  4. 增加 block(底下的方块) 类型和纹理类型  

## 项目结构  
1. 整体使用 ES6 开发  
2. 游戏逻辑使用面向对象进行模块化开发  
3. 通用功能的抽象(提高复用)  
4. 整体使用 MVC 进行控制和管理  

- 结构  
  game.js - 小游戏入口文件  
  game.json - 配置文件  
  
- 问题  
  canvas is not defined  
  小程序中没有 DOM 操作的 API，需要使用 adapter 提供相应的功能  
  在微信开放平台下载 adapter 文件然后使用 build 命令打包后放到根目录下  
  在 game.js 中引入 adapter 提供 canvas 组件  
  调整场景的大小尺寸  

- MVP 版本基本场景搭建  
  在场景中渲染出元素 -> renderer、scene、camera 在 canvas 上渲染出场景  
  视角和相机 camera 的设置  
  Light 和 Shadow 的设置 -> 使用方式和形成原理，如何设置  
  bottle 和 block 物体的设置 -> geometries  
  
- 基本场景渲染  
  1. THREE.WebGLRenderer -> 将场景定义的元素物体渲染到 canvas 上  
  2. THREE.Scene -> 所有要渲染的元素定义在 scene 中，包括形状、光线等  
  3. THREE.Camera -> 坐标视角  
  最终顶点坐标 = 投影矩阵 × 视图矩阵 × 模型矩阵 × 顶点坐标  
  
- 坐标辅助  
  ```js
  var axesHelper = new THREE.AxesHelper(100)
  scene.add(axesHelper)
  ```
  red -> X 轴  green -> Y 轴  blue -> Z 轴  

- shadow 相关类型和需要配置的值  
  类型           | 值
  ------------- | -------------
  渲染器启用阴影  | renderer.shadowMapEnable
  能形成阴影的光源  | DirectionalLight & SpotLight
  能够表现阴影的材质 |　LambertMaterial & PhongMaterial
  光源启用阴影      |  castShadow
  物体投射阴影      |  castShadow
  物体接收阴影      |  receiveShadow  

- Bottle(跳跃的对象) 的绘制  
  四个部分：  
  上方头部：  
  1. OctahedronGeometry  
  下方身体部分：  
  2. 最上方部分：一个 SphereGeometry 构成的半球  
  3. 中间部分：一个 CylinderGeometry 构成的圆柱  
  4. 底部：一个 CylinderGeometry 构成的圆台  

  将各个部分统一放在一个 object 中，方便作为一个整体管理  
  bottle 的各个部分添加到这个 3D 的 object 中，作为子元素管理  

- 小游戏引入图片资源的相对路径踩坑  
  小游戏中要引入图片资源，相对路径必须以 /game 开头  

- 微信小程序中使用 THREE.TextureLoader() 报错  
  `document.createElementNS is not a function`  
  微信小程序不适配 TextureLoader  
  解决方案：改写 Three.js 源码中的 ImageLoader 和 TextureLoader 部分  
  ```js
  function registerTextureLoader(THREE) {

    console.log("注册新的T&I加载器")

    THREE.ImageLoader = (function () {
      function ImageLoader(manager) {
        this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
      }
      Object.assign(ImageLoader.prototype, {
        crossOrigin: 'anonymous',
        load: function (url, onLoad, onProgress, onError) {
          if (url === undefined) url = '';
          if (this.path !== undefined) url = this.path + url;
          url = this.manager.resolveURL(url);
          // console.log(url)
          var scope = this;
          var cached = THREE.Cache.get(url);
          if (cached !== undefined) {
            scope.manager.itemStart(url);
            setTimeout(function () {
              if (onLoad) onLoad(cached);
              scope.manager.itemEnd(url);
            }, 0);
            return cached;
          }
          var image = new Image();

          function onImageLoad() {
            image.onload = function () { };
            image.onerror = function () { };

            console.log("图片加载完毕")
            THREE.Cache.add(url, this);
            if (onLoad) onLoad(this);
            scope.manager.itemEnd(url);
          }

          function onImageError(event) {
            console.log("图片加载失败")
            image.onload = function () { };
            image.onerror = function () { };
            if (onError) onError(event);
            scope.manager.itemEnd(url);
            scope.manager.itemError(url);
          }
          image.onload = onImageLoad;
          image.onerror = onImageError;
          if (url.substr(0, 5) !== 'data:') {
            if (this.crossOrigin !== undefined) image.crossOrigin = this.crossOrigin;

          }
          scope.manager.itemStart(url);
          image.src = url;
          return image;
        },
        setCrossOrigin: function (value) {
          this.crossOrigin = value;
          return this;
        },
        setPath: function (value) {
          this.path = value;
          return this;
        }
      });

      return ImageLoader
    })()

    THREE.TextureLoader = (function () {
      function TextureLoader(manager) {
        this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
      }
      Object.assign(TextureLoader.prototype, {
        crossOrigin: 'anonymous',
        load: function (url, onLoad, onProgress, onError) {
          var texture = new THREE.Texture();
          var loader = new THREE.ImageLoader(this.manager);
          loader.setCrossOrigin(this.crossOrigin);
          loader.setPath(this.path);
          loader.load(url, function (image) {
            texture.image = image;
            var isJPEG = url.search(/\.jpe?g$/i) > 0 || url.search(/^data\:image\/jpeg/) === 0;
            texture.format = isJPEG ? THREE.RGBFormat : THREE.RGBAFormat;
            texture.needsUpdate = true;
            if (onLoad !== undefined) {
              onLoad(texture);
            }
          }, onProgress, onError);
          return texture;
        },
        setCrossOrigin: function (value) {
          this.crossOrigin = value;
          return this;
        },
        setPath: function (value) {
          this.path = value;
          return this;
        }
      });
      return TextureLoader
    })();
  }

  registerTextureLoader(THREE)
  ```
  在 main.js 中新建函数修改，不直接修改源码  
  修改之后依旧报错：  
  ```js
  gameThirdScriptError
  ImageBitmap is not defined
  ReferenceError: ImageBitmap is not define 
  ```
  原因定位到 Three.js 源码中 `makePowerOfTwo` 函数  
  `if ( image instanceof HTMLImageElement || image instanceof HTMLCanvasElement || image instanceof ImageBitmap )`  
  小程序中没有 DOM API，而 Three.js 在创建图片对象的时候会使用 `var image = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'img' );`  
  所以在判断 image 类型的时候会去判断是否是 `ImageBitmap` 类型，要去掉 `image instanceof ImageBitmap` 的判断部分  

- bottle 的斜上抛运动  
  垂直方向：竖直上抛运动(结合重力加速度)  
  水平方向：匀速直线运动  

- 碰撞检测  
  坐标判断  
  判断斜上抛运动位置之后回到 block 平面上的时候是不是在 targetBlock 的位置范围之内，不在的话游戏失败  
  不用等到 bottle 真正跳过的时候进行碰撞检测  
  跳跃的轨迹可以通过数学计算得到，在用户松开手的时候进行碰撞检测，飞行过程中达到一定高度的时候进行判断是出现下一个 block 还是游戏结束  

