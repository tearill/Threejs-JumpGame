import Event from '../utils/event'

class GameModel {
  constructor() {
    this.stage = '' // 当前处于的场景
    this.stageChanged = new Event(this)
  }

  getStage() {
    return this.stage
  }

  setStage(stage) {
    this.stage = stage
    // 动态触发 view 改变更新
    this.stageChanged.notify({
      stage: stage
    })
  }
}

export default new GameModel()
