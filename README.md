# cnm-timeline

一个交互式时间轴组件，支持缩放、平移、时间选择和事件绑定功能。

## 功能特性

- 📅 自定义时间范围显示
- ⏰ 时间指针标记当前时刻
- 🔍 支持鼠标滚轮缩放
- 🖱️ 支持拖拽平移
- 🎯 时间点选择功能
- 📱 响应式设计
- 🛠️ 完整的 TypeScript 类型支持

## 技术栈

- TypeScript
- Konva.js (2D Canvas 库)
- dayjs (日期处理)
- Vite (构建工具)

## 安装

### 直接引入

```html
<script src="dist/assets/index-Bw2Mz8FM.js"></script>
```

### NPM 安装

```bash
npm install cnm-timeline
```

## 基本使用

```typescript
import { Timeline } from 'cnm-timeline';

// 创建时间轴实例
const timeline = new Timeline({
  container: document.getElementById('timeline-container')!,
  timeRange: [Date.now() - 3600000, Date.now()], // 过去1小时到现在
  moment: Date.now() // 当前时刻
});

// 渲染时间轴
timeline.render();

// 监听缩放事件
timeline.onZoom((event) => {
  console.log('Zoom event:', event);
});

// 监听平移事件
timeline.onPan((event) => {
  console.log('Pan event:', event);
});

// 监听选择事件
timeline.onSelect((event) => {
  console.log('Select event:', event);
});

// 更新时间范围
timeline.updateTimeRange([Date.now() - 7200000, Date.now()]);

// 更新当前时刻
timeline.updateMoment(Date.now() - 1800000);
```

## API 文档

### Timeline 类

#### 构造函数

```typescript
new Timeline(options: CnmTimelineOptions)
```

**参数**:
- `options`: 配置选项
  - `container`: HTML 容器元素
  - `timeRange`: 时间范围 [开始时间戳, 结束时间戳]
  - `moment`: 当前时刻时间戳

#### 方法

##### render()

渲染时间轴组件。

```typescript
timeline.render();
```

##### updateTimeRange(timeRange: [number, number])

更新时间范围，自动重新定位时间刻度并重新渲染。

**参数**:
- `timeRange`: 新的时间范围 [开始时间戳, 结束时间戳]

```typescript
timeline.updateTimeRange([Date.now() - 7200000, Date.now()]);
```

##### updateMoment(moment: number)

更新当前时刻，自动重新定位时间指针并重新渲染。

**参数**:
- `moment`: 新的当前时刻时间戳

```typescript
timeline.updateMoment(Date.now() - 1800000);
```

##### onZoom(callback: (event: ZoomEvent) => void)

监听缩放事件。

**参数**:
- `callback`: 缩放事件回调函数

```typescript
timeline.onZoom((event) => {
  console.log('Zoom event:', event);
});
```

##### onPan(callback: (event: PanEvent) => void)

监听平移事件。

**参数**:
- `callback`: 平移事件回调函数

```typescript
timeline.onPan((event) => {
  console.log('Pan event:', event);
});
```

##### onSelect(callback: (event: SelectEvent) => void)

监听选择事件。

**参数**:
- `callback`: 选择事件回调函数

```typescript
timeline.onSelect((event) => {
  console.log('Select event:', event);
});
```

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
cnm-timeline/
├── dist/             # 构建输出目录
├── public/           # 静态资源
├── src/              # 源代码
│   ├── config/       # 配置文件
│   ├── core/         # 核心实现
│   │   ├── Timeline.ts        # 主时间轴类
│   │   ├── TimelineHand.ts    # 时间指针
│   │   ├── TimelineState.ts   # 状态管理
│   │   └── TimelineTicks.ts   # 时间刻度
│   ├── utils/        # 工具函数
│   │   └── TimelineValid.ts   # 验证工具
│   └── index.ts      # 入口文件
├── .gitignore        # Git 忽略文件
├── .prettierrc.json  # Prettier 配置
├── index.html        # HTML 模板
├── package.json      # 项目配置
├── tsconfig.json     # TypeScript 配置
└── vite.config.js    # Vite 配置
```

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 联系方式

如有问题或建议，请通过以下方式联系：

- GitHub Issues: [https://github.com/yourusername/cnm-timeline/issues](https://github.com/yourusername/cnm-timeline/issues)
