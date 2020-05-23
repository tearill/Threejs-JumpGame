import blockConf from '../../config/block-config'

export default class BaseBlock {
  constructor(type) {
    this.type = type // cuboid | cylinder
    this.height = blockConf.height
    this.width = blockConf.width
  }
}