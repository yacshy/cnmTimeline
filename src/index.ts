export class CnmTimeline {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private startTime: Date;
  private endTime: Date;
  private currentTime: Date;
  private zoomLevel: number;

  constructor(container: HTMLElement) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.container.appendChild(this.canvas);

    // 初始化时间范围
    this.startTime = new Date();
    this.startTime.setHours(this.startTime.getHours() - 1);
    this.endTime = new Date();
    this.currentTime = new Date();
    this.zoomLevel = 1;

    this.initEventListeners();
    this.resizeCanvas();
    this.render();

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.render();
    });
  }

  private initEventListeners() {
    // 点击事件 - 设置指针位置
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      this.setTimeByX(x);
    });

    // 鼠标滚轮事件 - 缩放时间轴
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      this.zoomLevel *= delta;
      this.zoomLevel = Math.max(0.1, Math.min(10, this.zoomLevel));
      this.render();
    });
  }

  private resizeCanvas() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = 60;
  }

  private setTimeByX(x: number) {
    const totalWidth = this.canvas.width;
    const ratio = x / totalWidth;
    const timeRange = this.endTime.getTime() - this.startTime.getTime();
    const newTime = new Date(this.startTime.getTime() + ratio * timeRange);
    this.currentTime = newTime;
    this.render();
  }

  private render() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // 清空画布
    this.ctx.clearRect(0, 0, width, height);

    // 绘制边框
    this.ctx.strokeStyle = '#ccc';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(0, 0, width, height);

    // 绘制刻度
    this.ctx.strokeStyle = '#666';
    this.ctx.lineWidth = 1;
    this.ctx.font = '10px Arial';
    this.ctx.textAlign = 'center';

    const timeRange = this.endTime.getTime() - this.startTime.getTime();
    const majorInterval = timeRange / 10; // 10个主刻度

    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      const time = new Date(this.startTime.getTime() + i * majorInterval);
      
      // 绘制主刻度线
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();

      // 绘制时间标签
      this.ctx.fillStyle = '#333';
      this.ctx.fillText(time.toLocaleTimeString(), x, height - 5);
    }

    // 绘制当前时间指针
    const currentTimeRatio = (this.currentTime.getTime() - this.startTime.getTime()) / timeRange;
    const pointerX = currentTimeRatio * width;

    this.ctx.strokeStyle = '#ff0000';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(pointerX, 0);
    this.ctx.lineTo(pointerX, height);
    this.ctx.stroke();

    // 绘制指针头部
    this.ctx.fillStyle = '#ff0000';
    this.ctx.beginPath();
    this.ctx.moveTo(pointerX, 0);
    this.ctx.lineTo(pointerX - 5, 10);
    this.ctx.lineTo(pointerX + 5, 10);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // 公共方法：设置时间范围
  public setTimeRange(start: Date, end: Date) {
    this.startTime = start;
    this.endTime = end;
    this.render();
  }

  // 公共方法：设置当前时间
  public setCurrentTime(time: Date) {
    this.currentTime = time;
    this.render();
  }

  // 公共方法：获取当前时间
  public getCurrentTime(): Date {
    return this.currentTime;
  }
}

// 导出默认函数，方便用户直接调用
export default function createTimeline(container: HTMLElement): CnmTimeline {
  return new CnmTimeline(container);
}