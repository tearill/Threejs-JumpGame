import audioConf from '../../config/audio-config'
import gameView from '../game/view'

class AudioManager {
  constructor() {
    this.init()
  }

  init() {
    for (let key in audioConf.audioSources) {
      this[key] = wx.createInnerAudioContext() // 注册所有音频
      this[key].src = audioConf.audioSources[key]
    }
    // 下压音乐
    this.shrink_end.loop = true // 持续播放
    this.shrink.onEnded(() => {
      if (gameView.gamePage.bottle.status === 'shrink') {
        this.shrink_end.play() // 播放
      }
    })
  }
}

export default new AudioManager()
