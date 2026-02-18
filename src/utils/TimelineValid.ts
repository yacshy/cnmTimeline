import Konva from 'konva'

export class TimelineValid {
  constructor() {
  }

  /**
   * check is param is Array
   * @param param {any}
   * @protected
   */
  protected static isArray(param: any): boolean {
    return param && param.constructor.name === 'Array'
  }

  /**
   * check if param is number
   * @param param
   * @protected
   */
  protected static isNumber(param: any): boolean {
    return param && param.constructor.name === 'Number'
  }

  /**
   * check if container is a valid HTMLDivElement
   * @param container
   */
  static toContainer(container: any): void {
    if (container && container.constructor.name !== 'HTMLDivElement') {
      throw Error('container must be a valid HTMLDivElement')
    }
  }

  /**
   * check if timeRange is an Array of length 2 with all number item
   * @param timeRange
   */
  static toTimeRange(timeRange: any): void {
    if (!this.isArray(timeRange) || timeRange.length !== 2 || !this.isNumber(timeRange[0]) || !this.isNumber(timeRange[1])) {
      throw Error('timeRange must be a Array of length 2 with all number item')
    }
    if (timeRange[1]  - 10  <= timeRange[0]) {
      throw Error('timeRange[0] must be less than timeRange[1] minus 10ms')
    }
  }

  /**
   * check if moment is a number within timeRange
   * @param moment {any}
   * @param timeRange {[number, number]}
   */
  static toMoment(moment: any, timeRange: [number, number]): void {
    if (!this.isNumber(moment)) {
      throw Error('moment must be a number')
    }
    if (moment < timeRange[0] || moment > timeRange[1]) {
      throw Error('moment must be within timeRange')
    }
  }

  /**
   * check if canvas is a valid HTMLCanvasElement
   * @param canvas
   */
  static toCanvasLayer(canvasLayer: any): void {
    if (canvasLayer && canvasLayer.constructor.name !== 'Layer') {
      throw Error('canvasLayer must be a valid Konva.Layer')
    }
  }
}