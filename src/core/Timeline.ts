import { TimelineValid } from '../utils/TimelineValid.ts'
import { TimelineTick } from './TimelineTick.ts'

/**
 * @prop {HTMLDivElement} container  timeline's container
 * @prop {[number, number]} timeRange  timeline's time range
 */
export type CnmTimelineOptions = {
  container: HTMLDivElement
  timeRange: [number, number],
  moment: number
}

/**
 * @prop {number} width container's clientWidth
 * @prop {number} height container's clientHeight
 */
export type CnmTimelineContainerSpecification = {
  width: number
  height: number
}

export type ZoomEvent = {}

export type SlideEvent = {}

export class Timeline {
  protected _container: HTMLDivElement
  protected _timeRange: [number, number]
  protected _containerSpecification: CnmTimelineContainerSpecification
  protected _moment: number
  protected _zoomRank: number

  protected _timeTick: TimelineTick

  constructor({ container, timeRange, moment }: CnmTimelineOptions) {
    TimelineValid.toContainer(container)
    TimelineValid.toTimeRange(timeRange)
    TimelineValid.toMoment(moment, timeRange)

    this._container = container
    this._timeRange = timeRange
    this._moment = moment
    this._zoomRank = 1

    const width = this._container.clientWidth, height = this._container.clientHeight
    this._containerSpecification = { width, height }
    this._container.innerHTML = ''

    this._timeTick = new TimelineTick({
      width,
      height,
      timeRange: [timeRange[0], timeRange[1]],
      moment: moment,
      zoomRank: 1
    })
    this._timeTick.mount(this._container)
  }

  protected _zoom(): void {
  }

  protected _pan(): void {
  }

  protected _select(): void {
  }

  public onZoom(callback: (event: ZoomEvent) => void): void {
    callback({})
  }

  public onPan(callback: (event: SlideEvent) => void): void {
    callback({})
  }

  public onSelect(callback: (event: SlideEvent) => void): void {
    callback({})
  }

  /**
   * update time range，and then will auto rerender component
   * @param timeRange {[number, number]}
   */
  public updateTimeRange(timeRange: [number, number]): void {
    TimelineValid.toTimeRange(timeRange)

    this._timeRange = timeRange
  }

  /**
   * update moment, then it will automatically reposition marker's position and rerender timeline range
   * @param moment
   */
  public updateMoment(moment: number): void {
    TimelineValid.toMoment(moment, this._timeRange)
  }

  /**
   * render timeline component
   */
  public render(): void {
    const width = this._container.clientWidth, height = this._container.clientHeight
    this._containerSpecification = { width, height }


  }
}