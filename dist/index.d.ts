export declare class CnmTimeline {
    private container;
    private canvas;
    private ctx;
    private startTime;
    private endTime;
    private currentTime;
    private zoomLevel;
    constructor(container: HTMLElement);
    private initEventListeners;
    private resizeCanvas;
    private setTimeByX;
    private render;
    setTimeRange(start: Date, end: Date): void;
    setCurrentTime(time: Date): void;
    getCurrentTime(): Date;
}
export default function createTimeline(container: HTMLElement): CnmTimeline;
