import { TimelineValid } from '../utils/TimelineValid.ts'
import { TimelineTick } from './TimelineTick'

/**
 * @prop {HTMLDivElement} container  timeline's container
 * @prop {[number, number]} timeRange  timeline's time range
 */
export type CnmTimelineOptions = {
  container: HTMLDivElement
  timeRange: [number, number]
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

export type PanEvent = {}

export type SelectEvent = {}

const DEFAULT_ZOOM_RANK = 1

let raf: number | undefined = undefined

export class Timeline {
  protected _container: HTMLDivElement
  protected _timeRange: [number, number]
  protected _containerSpecification: CnmTimelineContainerSpecification
  protected _moment: number
  protected _zoomRank: number

  protected _canvas: HTMLCanvasElement
  protected _timeTick: TimelineTick

  protected _zoomCallbacks: Set<(event: ZoomEvent) => void>
  protected _panCallbacks: Set<(event: PanEvent) => void>
  protected _selectCallbacks: Set<(event: PanEvent) => void>

  constructor({ container, timeRange, moment }: CnmTimelineOptions) {
    TimelineValid.toContainer(container)
    TimelineValid.toTimeRange(timeRange)
    TimelineValid.toMoment(moment, timeRange)

    this._container = container
    this._timeRange = timeRange
    this._moment = moment
    this._zoomRank = DEFAULT_ZOOM_RANK

    const width = this._container.clientWidth
    const height = this._container.clientHeight

    this._containerSpecification = { width, height }
    this._container.innerHTML = ''

    const canvas: HTMLCanvasElement = document.createElement('canvas')
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    this._canvas = canvas

    this._bindEventListeners()

    this._timeTick = new TimelineTick({
      width,
      height,
      timeRange: [timeRange[0], timeRange[1]],
      moment: moment,
      zoomRank: DEFAULT_ZOOM_RANK,
      canvas: this._canvas
    })

    this._zoomCallbacks = new Set()
    this._panCallbacks = new Set()
    this._selectCallbacks = new Set()
  }

  protected _bindEventListeners(): void {
    this._canvas.addEventListener('wheel', (event: WheelEvent) => {
      this._zoom(event)
    })

    const onMousemove = (event: MouseEvent) => {
      this._zoom(event)
    }
    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('mouseup', onMouseup)
    }
    this._canvas.addEventListener('mousedown', () => {
      raf = requestAnimationFrame(() => {
        this._rerender()
      })
      document.addEventListener('mousemove', onMousemove)
      document.addEventListener('mouseup', onMouseup)
    })
  }

  protected _unbindEventListeners(): void {}

  protected _zoom(event: MouseEvent): void {
    this._zoomCallbacks.forEach((callback) => callback(event))
  }

  protected _pan(event: MouseEvent): void {
    this._panCallbacks.forEach((callback) => callback(event))
  }

  protected _select(event: MouseEvent): void {
    this._selectCallbacks.forEach((callback) => callback(event))
  }

  public onZoom(callback: (event: ZoomEvent) => void): void {
    this._zoomCallbacks.add(callback)
  }

  public onPan(callback: (event: PanEvent) => void): void {
    this._panCallbacks.add(callback)
  }

  public onSelect(callback: (event: SelectEvent) => void): void {
    this._selectCallbacks.add(callback)
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
    const width = this._container.clientWidth
    const height = this._container.clientHeight
    this._containerSpecification = { width, height }
  }

  protected _rerender(): void { 
  }
}
