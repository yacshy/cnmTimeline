import { TIMELINE_HAND_WIDTH, TIMELINE_HAND_FILL } from '@/config/timelineHand'
import { TimelineState } from './TimelineState'
import Konva from 'konva'

export class TimelineHand {
  protected _timelineState: TimelineState

  constructor(timelineState: TimelineState) {
    this._timelineState = timelineState
  }

  public render(): void {
    const { _handKonvaLayer, _moment, _zoomRank, _width, _timeRange } = this._timelineState

    const rect = new Konva.Rect({
      x: (_width / _zoomRank) * (_moment - _timeRange[0]),
      y: 0,
      width: TIMELINE_HAND_WIDTH,
      fill: TIMELINE_HAND_FILL,
      height: _handKonvaLayer.height(),
      strokeWidth: 0
    })
    _handKonvaLayer.add(rect)
  }
}
