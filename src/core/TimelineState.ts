import Konva from 'konva'
import { TimelineValid } from '@/utils/TimelineValid'
import { BASE_ZOOM_FACTOR } from '@/config/timelineState'

/**
 * @prop {HTMLDivElement} container  timeline's container
 * @prop {[number, number]} timeRange  timeline's time range
 */
export type CnmTimelineOptions = {
  container: HTMLDivElement
  timeRange: [number, number]
  moment: number
}

export type ZoomEvent = {
  state: TimelineState
  event: MouseEvent
}
export type PanEvent = ZoomEvent
export type SelectEvent = ZoomEvent
export type SlideEvent = ZoomEvent

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
  public _selectCallbacks: Set<(event: SelectEvent) => void>
  public _slideCallbacks: Set<(event: SelectEvent) => void>

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

    this._bindZoomEventOnStage()
    this._bindSelectEventOnStage()
    this._bindPanEventOnStage()
    this._bindSlideEventOnStage()
    this._bindContextMenuEventOnStage()

    this._handKonvaLayer = handLayer
    this._ticksKonvaLayer = ticksLayer

    this._zoomCallbacks = new Set()
    this._panCallbacks = new Set()
    this._selectCallbacks = new Set()
    this._slideCallbacks = new Set()
  }

  public get _msPerPixel(): number {
    return this._zoomRank / this._width
  }

  protected _bindZoomEventOnStage(): void {
    this._konvaStage.on('wheel', (event) => {
      event.evt.preventDefault()
      const zoomFactor = event.evt.deltaY > 0 ? 1 / BASE_ZOOM_FACTOR : BASE_ZOOM_FACTOR

      const currentMousePos = this._konvaStage.getPointerPosition()!
      const currentMousePosMappingToTimeStamp = this._timeRange[0] + currentMousePos.x * this._msPerPixel

      this._zoomRank *= zoomFactor
      this._timeRange = [
        currentMousePosMappingToTimeStamp - currentMousePos.x * this._msPerPixel,
        currentMousePosMappingToTimeStamp + (this._width - currentMousePos.x) * this._msPerPixel
      ]
      this._zoom(event.evt)
    })
  }

  protected _bindSelectEventOnStage(): void {
    const mousedonwListener = (event: Konva.KonvaEventObject<MouseEvent>) => {
      if (event.evt.button !== 0) {
        return
      }
      const currentMousePos = this._konvaStage.getPointerPosition()!
      this._moment = this._timeRange[0] + currentMousePos.x * this._msPerPixel
      this._select(event.evt)
    }
    this._konvaStage.on('mousedown', mousedonwListener)
  }

  protected _bindPanEventOnStage(): void {
    const OFFSET_X_STEP = 1

    let timer: number | undefined = undefined
    let xPosRecord = 0
    let autoPanning = false

    const mousemoveListener = (event: Konva.KonvaEventObject<MouseEvent>) => {
      const currentMousePos = this._konvaStage.getPointerPosition()!
      const offsetXPos = currentMousePos.x - xPosRecord
      xPosRecord = currentMousePos.x

      if (20 < currentMousePos.x && currentMousePos.x < this._width - 20) {
        clearInterval(timer)
        autoPanning = false
        this._moment = this._timeRange[0] + currentMousePos.x * this._msPerPixel
        this._pan(event.evt)
        return
      }

      if (autoPanning) {
        return
      }
      autoPanning = true
      clearInterval(timer)
      this._moment = this._timeRange[0] + currentMousePos.x * this._msPerPixel

      // when this._moment follow mouse move to the left of the timeline, the time range should be shifted to the left
      if (currentMousePos.x <= 20 && offsetXPos < 0) {
        timer = setInterval(() => {
          this._timeRange = [
            this._timeRange[0] - OFFSET_X_STEP * this._msPerPixel,
            this._timeRange[1] - OFFSET_X_STEP * this._msPerPixel
          ]
          this._moment -= OFFSET_X_STEP * this._msPerPixel
          this._pan(event.evt)
        }, 0.01 * 1000)
      }
      // when this._moment follow mouse move to the right of the timeline, the time range should be shifted to the right
      else if (currentMousePos.x >= this._width - 20 && offsetXPos > 0) {
        timer = setInterval(() => {
          this._timeRange = [
            this._timeRange[0] + OFFSET_X_STEP * this._msPerPixel,
            this._timeRange[1] + OFFSET_X_STEP * this._msPerPixel
          ]
          this._moment += OFFSET_X_STEP * this._msPerPixel
          this._pan(event.evt)
        }, 0.01 * 1000)
      }
    }

    const mouseupListener = (event?: Konva.KonvaEventObject<MouseEvent>) => {
      // const currentMousePos = this._konvaStage.getPointerPosition()!
      // console.log('mouseup: ', currentMousePos.x)
      clearInterval(timer)
      this._konvaStage.off('mousemove', mousemoveListener)
      this._konvaStage.off('mouseup', mouseupListener)
      this._konvaStage.off('mouseleave', mouseupListener)
    }

    this._konvaStage.on('mousedown', (event) => {
      if (event.evt.button !== 0) {
        return
      }
      this._konvaStage.on('mousemove', mousemoveListener)
      this._konvaStage.on('mouseup', mouseupListener)
      this._konvaStage.on('mouseleave', mouseupListener)
    })
  }

  protected _bindSlideEventOnStage(): void {
    let xPosRecord = 0
    let timeRangeRecord: [number, number] = [...this._timeRange]

    const mousemoveListener = (event: MouseEvent) => {
      const currentMousePos = this._konvaStage.getPointerPosition()!
      const offsetXPos = currentMousePos.x - xPosRecord

      this._timeRange = [
        timeRangeRecord[0] - offsetXPos * this._msPerPixel,
        timeRangeRecord[1] - offsetXPos * this._msPerPixel
      ]

      this._slide(event)
    }

    const mouseupListener = (event?: MouseEvent) => {
      document.removeEventListener('mousemove', mousemoveListener)
      document.removeEventListener('mouseup', mouseupListener)
      document.removeEventListener('mouseleave', mouseupListener)
    }

    this._konvaStage.on('mousedown', (event) => {
      if (event.evt.button !== 2) {
        return
      }
      const currentMousePos = this._konvaStage.getPointerPosition()!
      xPosRecord = currentMousePos.x
      timeRangeRecord = [...this._timeRange]
      mouseupListener()
      document.addEventListener('mousemove', mousemoveListener)
      document.addEventListener('mouseup', mouseupListener)
      document.addEventListener('mouseleave', mouseupListener)
    })
  }

  protected _bindContextMenuEventOnStage(): void {
    const contextmenuListener = (event: MouseEvent) => {
      event.preventDefault()
    }

    this._konvaStage.on('mouseenter', (event) => {
      document.addEventListener('contextmenu', contextmenuListener)
    })
    this._konvaStage.on('mouseleave', (event) => {
      document.removeEventListener('contextmenu', contextmenuListener)
    })
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
    this._zoomCallbacks.forEach((callback) => callback({
      state: this,
      event
    }))
  }

  protected _pan(event: MouseEvent): void {
    this._panCallbacks.forEach((callback) => callback({
      state: this,
      event
    }))
  }

  protected _select(event: MouseEvent): void {
    this._selectCallbacks.forEach((callback) => callback({
      state: this,
      event
    }))
  }

  protected _slide(event: MouseEvent): void {
    this._slideCallbacks.forEach((callback) => callback({
      state: this,
      event
    }))
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

  public onSlide(callback: (event: SlideEvent) => void): void {
    this._slideCallbacks.add(callback)
  }

  public cleanStage(): void {
    this._handKonvaLayer.removeChildren()
    this._ticksKonvaLayer.removeChildren()
  }
}
