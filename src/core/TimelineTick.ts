import { TimelineValid } from '../utils/TimelineValid'

export type TimelineTickOptions = {
  width: number
  height: number
  timeRange: [number, number]
  moment: number
  zoomRank: number
}

export class TimelineTick {
  protected _canvas: HTMLCanvasElement

  protected _width: number
  protected _height: number
  protected _timeRange: [number, number]
  protected _moment: number
  protected _zoomRank: number

  constructor({ width, height, timeRange, moment, zoomRank }: TimelineTickOptions) {
    this._width = width
    this._height = height
    this._timeRange = timeRange
    this._moment = moment
    this._zoomRank = zoomRank

    const canvas: HTMLCanvasElement = document.createElement('canvas')

    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    this._canvas = canvas
  }

  mount(element: HTMLDivElement): void {
    TimelineValid.toContainer(element)
  }
}