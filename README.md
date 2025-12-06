# VersionBodyDemoWeb 详细技术与功能文档

## 项目概述

VersionBodyDemoWeb 是一款基于 AI 人体关键点关键点识别技术的智能跟练系统，通过摄像头捕捉用户动作并实时分析，提供精准的动作指导，帮助用户规范运动姿势，提升训练效果与安全性。系统采用现代化前端技术栈构建，支持多设备适配，提供流畅的用户体验。

## 技术架构

### 核心技术栈
- **前端框架**: React 19
- **编程语言**: TypeScript
- **构建工具**: Vite (基于 Rolldown 优化)
- **样式解决方案**: Styled Components
- **路由管理**: React Router v7
- **AI 人体识别**: TensorFlow.js + PoseNet 模型
- **包管理**: pnpm

### 关键依赖
- `styled-components`: 组件化样式管理，版本 6.1.19
- `@tensorflow/tfjs`: 机器学习框架
- `@tensorflow-models/posenet`: 人体姿态关键点识别模型
- React Router v7: 页面路由管理

## 项目结构

```
VersionBodyDemoWeb/
├── client/                     # 前端应用目录
│   ├── src/
│   │   ├── components/         # 可复用组件
│   │   │   ├── Camera/         # 摄像头与人体识别组件
│   │   │   └── Countdown/      # 倒计时组件
│   │   ├── constant/           # 常量定义
│   │   ├── pages/              # 页面组件
│   │   │   ├── index/          # 首页
│   │   │   └── version/        # 跟练页面
│   │   ├── router/             # 路由配置
│   │   ├── styles/             # 全局样式
│   │   ├── App.tsx             # 应用入口组件
│   │   └── main.tsx            # 应用渲染入口
│   ├── index.html              # HTML 入口
│   ├── package.json            # 项目依赖配置
│   └── vite.config.ts          # Vite 配置
└── package.json                # 根项目配置
```

## 核心功能模块

### 1. 人体关键点识别模块

基于 TensorFlow.js 和 PoseNet 模型实现实时人体关键点检测，主要包含:

- **摄像头控制**: 负责设备摄像头权限获取、视频流处理
- **模型加载**: 加载 PoseNet 模型并根据设备性能选择合适配置
- **关键点检测**: 实时分析视频流，提取人体关键节点坐标
- **可视化渲染**: 将识别到的关键点绘制到画布上

关键代码实现:
```typescript
// 摄像头视频流处理
video.oncanplaythrough = () => {
    console.log("start detect");
    window.addEventListener("resize", windowReSize)
    initRender();
    windowReSize()
    startDetect()
};

// 关键点渲染
renderFrame(points: any[]) {
    this.clean()
    for (let point of points) {
        if (point.score < this.scoreLine) continue
        const { x, y } = point.position
        const { x: dx, y: dy } = this.getDrawXY(x, y)
        this.renderDot(dx, dy)
    }
}
```

### 2. 跟练流程管理

通过状态机模式管理完整的跟练流程，主要状态包括:

```typescript
// 跟练状态定义
CV_CHECK_WRONG = 0       // 姿势错误
CV_CHECK_RIGHT = 1       // 姿势正确
CV_CHECK_FINISH = 2      // 姿势检查完成
START = 3                // 开始
SHOW_INFO = 4            // 显示信息
COUNTDOWN = 5            // 倒计时
DETECT = 6               // 检测中
FINISH = 7               // 完成
```

状态流转通过 `VersionStatus` 类实现，每个状态对应不同的用户引导文本:

```typescript
export const blackBoardSubTitle = {
    [VersionStatus.CV_CHECK_WRONG]: "Stand up and start moving backwards",
    [VersionStatus.CV_CHECK_RIGHT]: "Great! That's the spot!",
    [VersionStatus.CV_CHECK_FINISH]: "Let's start!",
}
```

### 3. 页面与路由

- **首页**: 展示系统介绍、课程列表和统计数据
- **跟练页**: 实时显示摄像头画面、人体关键点和动作指导

路由配置:
```typescript
const routes = [
  { path: "/", Component: Index },
  { path: "/version", Component: Version }
]
```

## UI 与样式设计

### 样式解决方案

项目采用 Styled Components 进行样式管理，主要特点:

- 全局样式标准化: 通过 `NormalizeStyles.ts` 统一浏览器默认样式
- 主题变量: 定义基础颜色、阴影等设计变量，保证风格一致性
- 组件化样式: 样式与组件紧密结合，提高可维护性
- 响应式设计: 适配不同设备屏幕尺寸

核心样式变量:
```typescript
:root {
  --primary: #3B82F6;
  --primary-dark: #2563EB;
  --secondary: #10B981;
  --accent: #F59E0B;
  --dark: #1E293B;
  --light: #F8FAFC;
  --gray: #94A3B8;
  --gray-dark: #64748B;
  --bg: #F8FAFC;
  --text: #1E293B;
  --card: #FFFFFF;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

### 动画效果

实现了多种动画效果增强用户体验:
- 渐入动画 (`fadeIn`): 元素加载时的平滑过渡
- 脉冲动画 (`pulse`): 按钮交互反馈
- 浮动动画 (`float`): 图片悬浮效果

## 课程体系

系统包含多种类型的训练课程，按难度分级:
- 入门级 (beginner): 适合初学者的基础课程
- 进阶级 (intermediate): 针对有一定基础的用户
- 专家级 (advanced): 高强度训练课程

课程数据结构:
```typescript
interface ClassType {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  difficulty: number;
  instructor: string;
  image: string;
}
```

## 快速开始

### 环境要求
- Node.js (v14+)
- pnpm (v10+)

### 运行步骤
1. 克隆项目代码库
```bash
git clone https://github.com/wangchen2021/VersionBodyDemoWeb.git
```

2. 安装依赖
```bash
cd VersionBodyDemoWeb/client
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 在浏览器中访问 `http://localhost:5173` 即可使用系统

## 注意事项

1. 摄像头功能需要在 HTTPS 环境或 localhost 下使用
2. 首次使用需用户授权摄像头权限
3. 识别精度受光线、背景等环境因素影响
4. 移动端性能可能受限，建议使用高性能设备获得更佳体验

## 功能扩展方向

1. 动作比对评分系统: 实现用户动作与标准动作的量化比对
2. 训练数据统计: 记录用户训练历史并生成分析报告
3. 个性化训练计划: 根据用户水平和目标自动生成训练方案
4. 多模型支持: 集成更多人体识别模型，提升复杂动作识别能力
5. 社交功能: 支持用户分享训练成果，增加互动性