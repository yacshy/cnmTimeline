import { TimelineValid } from '@/utils/TimelineValid'
import type { TimelineTickOptions } from './index'

export class TimelineDayTick {
  protected _width: number
  protected _height: number
  protected _timeRange: [number, number]
  protected _moment: number
  protected _zoomRank: number
  protected _canvas: HTMLCanvasElement

  constructor(timelineOptions: TimelineTickOptions) {
    const { width, height, timeRange, moment, zoomRank, canvas } = timelineOptions
    TimelineValid.toCanvas(canvas)

    this._width = width
    this._height = height
    this._timeRange = timeRange
    this._moment = moment
    this._zoomRank = zoomRank
    this._canvas = canvas
  }
}
