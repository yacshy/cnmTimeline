import { TimelineValid } from '@/utils/TimelineValid'
import { TimelineYearTick } from './TimelineYearTick'
import { TimelineMonthTick } from './TimelineMonthTick'
import { TimelineDayTick } from './TimelineDayTick'
import { TimelineHourTick } from './TimelineHourTick'
import { TimelineMinuteTick } from './TimelineMinuteTick'
import { TimelineSecondTick } from './TimelineSecondTick'

export type TimelineTickOptions = {
  width: number
  height: number
  timeRange: [number, number]
  moment: number
  zoomRank: number
  canvas: HTMLCanvasElement
}

export class TimelineTick {
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

    this._yearTick = new TimelineYearTick(timelineOptions)
    this._monthTick = new TimelineMonthTick(timelineOptions)
    this._dayTick = new TimelineDayTick(timelineOptions)
    this._hourTick = new TimelineHourTick(timelineOptions)
    this._minuteTick = new TimelineMinuteTick(timelineOptions)
    this._secondTick = new TimelineSecondTick(timelineOptions)

    this.render()
  }

  render(): void {
    const ctx = this._canvas.getContext('2d')!
  }
}
