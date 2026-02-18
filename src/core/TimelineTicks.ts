import { TimelineState } from './TimelineState'
import {
  TIMELINE_YEAR_TICK_WIDTH,
  TIMELINE_YEAR_TICK_FILL,
  TIMELINE_MONTH_TICK_WIDTH,
  TIMELINE_MONTH_TICK_FILL,
  TIMELINE_DAY_TICK_WIDTH,
  TIMELINE_DAY_TICK_FILL,
  TIMELINE_HOUR_TICK_WIDTH,
  TIMELINE_HOUR_TICK_FILL,
  TIMELINE_MINUTE_TICK_WIDTH,
  TIMELINE_MINUTE_TICK_FILL,
  TIMELINE_SECOND_TICK_WIDTH,
  TIMELINE_SECOND_TICK_FILL,
  TIMELINE_YEAR_TICK_HEIGHT_PERCENTAGE,
  TIMELINE_MONTH_TICK_HEIGHT_PERCENTAGE,
  TIMELINE_DAY_TICK_HEIGHT_PERCENTAGE,
  TIMELINE_HOUR_TICK_HEIGH_PERCENTAGET,
  TIMELINE_MINUTE_TICK_HEIGHT_PERCENTAGE,
  TIMELINE_SECOND_TICK_HEIGHT_PERCENTAGE
} from '@/config/timelineTicks'
import Konva from 'konva'

/**
 * 查找在正整数范围[int1, int2]之间所有模正整数num后结果为0的正整数
 * @param range 范围 [int1, int2]
 * @param num 模数
 * @returns 所有符合条件的正整数数组
 */
function findModuloZeros(range: [number, number], num: number): number[] {
  const [int1, int2] = range
  // 边界检查：范围无效时返回空数组
  if (int1 > int2) return []

  // 计算第一个能被num整除且>=int1的数
  const start = Math.ceil(int1 / num) * num

  // 若起始点超过上限，返回空数组
  if (start > int2) return []

  // 生成结果数组
  const result = []
  for (let current = start; current <= int2; current += num) {
    result.push(current)
  }
  return result
}

export type TimelineTicksOptions = {
  width: number
  height: number
  moment: number
  zoomRank: number
  canvasLayer: Konva.Layer
}

export class TimelineTicks {
  protected _timelineState: TimelineState

  constructor(timelineState: TimelineState) {
    this._timelineState = timelineState
  }

  protected renderYearTicks(): void {
    const { _ticksKonvaLayer, _zoomRank, _width, _height, _timeRange } = this._timelineState
    const rate = 365 * 30 * 24 * 60 * 60 * 1000
    const tickDistance = _width / (_zoomRank / rate)
    const tickHeight = _height * TIMELINE_YEAR_TICK_HEIGHT_PERCENTAGE
    if (tickDistance >= 10) {
      findModuloZeros(_timeRange, rate).forEach((ms) => {
        const tick = new Konva.Rect({
          x: (ms - _timeRange[0]) * (_width / _zoomRank),
          y: _height - tickHeight,
          width: TIMELINE_YEAR_TICK_WIDTH,
          strokeWidth: 0,
          fill: TIMELINE_YEAR_TICK_FILL,
          height: tickHeight
        })
        _ticksKonvaLayer.add(tick)
      })
    }
  }
  protected renderMonthTicks(): void {
    const { _ticksKonvaLayer, _zoomRank, _width, _height, _timeRange } = this._timelineState
    const rate = 30 * 24 * 60 * 60 * 1000
    const tickDistance = _width / (_zoomRank / rate)
    const tickHeight = _height * TIMELINE_MONTH_TICK_HEIGHT_PERCENTAGE
    if (tickDistance >= 10) {
      findModuloZeros(_timeRange, rate).forEach((ms) => {
        const tick = new Konva.Rect({
          x: (ms - _timeRange[0]) * (_width / _zoomRank),
          y: _height - tickHeight,
          width: TIMELINE_MONTH_TICK_WIDTH,
          strokeWidth: 0,
          fill: TIMELINE_MONTH_TICK_FILL,
          height: tickHeight
        })
        _ticksKonvaLayer.add(tick)
      })
    }
  }
  protected renderDayTicks(): void {
    const { _ticksKonvaLayer, _zoomRank, _width, _height, _timeRange } = this._timelineState
    const rate = 24 * 60 * 60 * 1000

    const tickDistance = _width / (_zoomRank / rate)
    const tickHeight = _height * TIMELINE_DAY_TICK_HEIGHT_PERCENTAGE
    if (tickDistance >= 10) {
      findModuloZeros(_timeRange, rate).forEach((ms) => {
        const tick = new Konva.Rect({
          x: (ms - _timeRange[0]) * (_width / _zoomRank),
          y: _height - tickHeight,
          width: TIMELINE_DAY_TICK_WIDTH,
          strokeWidth: 0,
          fill: TIMELINE_DAY_TICK_FILL,
          height: tickHeight
        })
        _ticksKonvaLayer.add(tick)
      })
    }
  }
  protected renderHourTicks(): void {
    const { _ticksKonvaLayer, _zoomRank, _width, _height, _timeRange } = this._timelineState
    const rate = 60 * 60 * 1000

    const tickDistance = _width / (_zoomRank / rate)
    const tickHeight = _height * TIMELINE_HOUR_TICK_HEIGH_PERCENTAGET
    if (tickDistance >= 10) {
      findModuloZeros(_timeRange, rate).forEach((ms) => {
        const tick = new Konva.Rect({
          x: (ms - _timeRange[0]) * (_width / _zoomRank),
          y: _height - tickHeight,
          width: TIMELINE_HOUR_TICK_WIDTH,
          strokeWidth: 0,
          fill: TIMELINE_HOUR_TICK_FILL,
          height: tickHeight
        })
        _ticksKonvaLayer.add(tick)
      })
    }
  }
  protected renderMinuteTicks(): void {
    const { _ticksKonvaLayer, _zoomRank, _width, _height, _timeRange } = this._timelineState
    const rate = 60 * 1000
    const tickDistance = _width / (_zoomRank / rate)
    const tickHeight = _height * TIMELINE_MINUTE_TICK_HEIGHT_PERCENTAGE
    if (tickDistance >= 10) {
      findModuloZeros(_timeRange, rate).forEach((ms) => {
        const tick = new Konva.Rect({
          x: (ms - _timeRange[0]) * (_width / _zoomRank),
          y: _height - tickHeight,
          width: TIMELINE_MINUTE_TICK_WIDTH,
          strokeWidth: 0,
          fill: TIMELINE_MINUTE_TICK_FILL,
          height: tickHeight
        })
        _ticksKonvaLayer.add(tick)
      })
    }
  }
  protected renderSecondTicks(): void {
    const { _ticksKonvaLayer, _zoomRank, _width, _height, _timeRange } = this._timelineState
    const rate = 1000
    const tickDistance = _width / (_zoomRank / rate)
    const tickHeight = _height * TIMELINE_SECOND_TICK_HEIGHT_PERCENTAGE
    if (tickDistance >= 10) {
      findModuloZeros(_timeRange, rate).forEach((ms) => {
        const tick = new Konva.Rect({
          x: (ms - _timeRange[0]) * (_width / _zoomRank),
          y: _height - tickHeight,
          width: TIMELINE_SECOND_TICK_WIDTH,
          strokeWidth: 0,
          fill: TIMELINE_SECOND_TICK_FILL,
          height: tickHeight
        })
        _ticksKonvaLayer.add(tick)
      })
    }
  }

  public render(): void {
    this.renderSecondTicks()
    this.renderMinuteTicks()
    this.renderHourTicks()
    this.renderDayTicks()
    this.renderMonthTicks()
    this.renderYearTicks()
  }
}
