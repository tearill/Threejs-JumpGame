// 操作 view 页面相关
import GamePage from '../pages/game-page'
import GameOverPage from '../pages/game-over-page'

class GameView {
  constructor() {
    
  }

  showGameOverPage() {
    this.gamePage.hide()
    this.gameOverPage.show()
  }

  showGamePage() {
    this.gameOverPage.hide()
    this.gamePage.restart()
    this.gamePage.show()
  }

  restartGame() {
    this.gamePage.restart() // 重启页面
  }

  initGameOverPage(callbacks) {
    this.gameOverPage = new GameOverPage(callbacks)
    this.gameOverPage.init({
      camera: this.gamePage.scene.camera.instance,
      scene: this.gamePage.scene
    })
  }

  initGamePage(callbacks) {
    this.gamePage = new GamePage(callbacks)
    this.gamePage.init()
  }
}

export default new GameView()
