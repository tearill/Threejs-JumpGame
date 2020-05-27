// 控制层 控制所有的活动
// UI 相关的交给 view
// 数据相关的交给 model
import gameView from './view'
import gameModel from './model'

class GameController {
  constructor() {
    this.gameView = gameView
    this.gameModel = gameModel
    this.gameModel.stageChanged.attach((sender, args) => {
      const stageName = args.stage
      switch (stageName) {
        case 'game-over':
          this.gameView.showGameOverPage()
          break
        case 'game':
          this.gameView.showGamePage()
          break
        default:
          // break
      }
    })
  }

  initPages() {
    // 初始化页面
    // 调用
    const gamePageCallbacks = {
      showGameOverPage: () => {
        // debugger
        this.gameModel.setStage('game-over') // 驱动 model 改变
      }
    }

    const gameOverPageCallbacks = {
      gameRestart: () => {
        this.gameModel.setStage('game')
      }
    }

    this.gameView.initGamePage(gamePageCallbacks)
    this.gameView.initGameOverPage(gameOverPageCallbacks)
    // this.gameModel.setStage('game')
  }

}

export default new GameController()
