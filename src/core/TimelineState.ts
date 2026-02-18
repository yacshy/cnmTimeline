import Konva from 'konva'
import { TimelineValid } from '@/utils/TimelineValid'

/**
 * @prop {HTMLDivElement} container  timeline's container
 * @prop {[number, number]} timeRange  timeline's time range
 */
export type CnmTimelineOptions = {
  container: HTMLDivElement
  timeRange: [number, number]
  moment: number
}

export type ZoomEvent = {}

export type PanEvent = {}

export type SelectEvent = {}

export class TimelineState {
  public _container: HTMLDivElement
  public _width: number
  public _height: number
  public _moment: number
  public _zoomRank: number
  public _timeRange: [number, number]

  public _konvaStage: Konva.Stage
  public _handKonvaLayer: Konva.Layer
  public _ticksKonvaLayer: Konva.Layer

  public _zoomCallbacks: Set<(event: ZoomEvent) => void>
  public _panCallbacks: Set<(event: PanEvent) => void>
  public _selectCallbacks: Set<(event: PanEvent) => void>

  constructor({ container, moment, timeRange }: CnmTimelineOptions) {
    TimelineValid.toContainer(container)
    TimelineValid.toTimeRange(timeRange)
    TimelineValid.toMoment(moment, timeRange)

    this._container = container
    this._moment = moment
    this._timeRange = timeRange
    this._zoomRank = timeRange[1] - timeRange[0]

    const width = this._container.clientWidth
    const height = this._container.clientHeight

    this._width = width
    this._height = height

    const stage = new Konva.Stage({
      container: this._container,
      width,
      height
    })
    this._konvaStage = stage

    const ticksLayer = new Konva.Layer()
    stage.add(ticksLayer)

    const handLayer = new Konva.Layer()
    stage.add(handLayer)

    stage.on('wheel', (event) => {
      event.evt.preventDefault()
      const zoomFactor = event.evt.deltaY > 0 ? 0.9 : (1 / 0.9)

      const currentMousePos = stage.getPointerPosition()!
      const currentMousePosMappingToTimeStamp = this._timeRange[0] + currentMousePos.x * this._msPerPixel

      this._zoomRank *= zoomFactor
      this._timeRange = [
        currentMousePosMappingToTimeStamp - currentMousePos.x * this._msPerPixel,
        currentMousePosMappingToTimeStamp + (this._width - currentMousePos.x) * this._msPerPixel
      ]
      this._zoom(event.evt)
    })

    this._handKonvaLayer = handLayer
    this._ticksKonvaLayer = ticksLayer

    this._zoomCallbacks = new Set()
    this._panCallbacks = new Set()
    this._selectCallbacks = new Set()
  }

  public get _msPerPixel(): number {
    return this._zoomRank / this._width
  }

  public updateTimeRange(timeRange: [number, number]): void {
    TimelineValid.toTimeRange(timeRange)
    this._timeRange = timeRange
  }

  public updateMoment(moment: number): void {
    TimelineValid.toMoment(moment, this._timeRange)
    this._moment = moment
  }

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

  public clearStage(): void {
    this._handKonvaLayer.removeChildren()
    this._ticksKonvaLayer.removeChildren()
  }
}
