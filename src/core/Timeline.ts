import { TimelineValid } from '../utils/TimelineValid'
import { TimelineTicks } from './TimelineTicks'
import { TimelineHand } from './TimelineHand'
import { TimelineState } from './TimelineState'
import type { ZoomEvent, PanEvent, SelectEvent } from './TimelineState'

/**
 * @prop {HTMLDivElement} container  timeline's container
 * @prop {[number, number]} timeRange  timeline's time range
 */
export type CnmTimelineOptions = {
  container: HTMLDivElement
  timeRange: [number, number]
  moment: number
}

let raf: number | undefined = undefined

export class Timeline {
  protected _timeTicks: TimelineTicks
  protected _timeHand: TimelineHand

  protected _timelieState: TimelineState

  constructor(options: CnmTimelineOptions) {
    TimelineValid.toContainer(options.container)
    options.container.innerHTML = ''

    this._timelieState = new TimelineState(options)

    this._timeTicks = new TimelineTicks(this._timelieState)
    this._timeHand = new TimelineHand(this._timelieState)

    this.onZoom((event) => {
      this.render()
    })
  }

  protected _unbindEventListeners(): void {}

  public onZoom(callback: (event: ZoomEvent) => void): void {
    this._timelieState.onZoom(callback)
  }

  public onPan(callback: (event: PanEvent) => void): void {
    this._timelieState.onPan(callback)
  }

  public onSelect(callback: (event: SelectEvent) => void): void {
    this._timelieState.onSelect(callback)
  }

  /**
   * update time range, then it will automatically reposition timeline ticks and rerender timeline range
   * @param timeRange
   */
  public updateTimeRange(timeRange: [number, number]): void {
    this._timelieState.updateTimeRange(timeRange)
  }

  /**
   * update moment, then it will automatically reposition marker's position and rerender timeline range
   * @param moment
   */
  public updateMoment(moment: number): void {
    this._timelieState.updateMoment(moment)
  }

  /**
   * render timeline component
   */
  public render(): void {
    this._timelieState.clearStage()
    this._timeHand.render()
    this._timeTicks.render()
  }

  protected _rerender(): void {}
}
