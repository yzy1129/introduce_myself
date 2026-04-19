# 数字宇宙

杨子煜的沉浸式个人数字空间作品集。  
这个项目不是传统的信息罗列型主页，而是一套围绕“空间、动效、交互、信息揭示”组织起来的前端表达系统。

## 当前实现

- 首页章节星图：以章节导航代替普通首屏堆叠
- 宇宙背景系统：Three.js 粒子层、引力核心、滚动位移与鼠标扰动
- 能量场交互：自定义能量光标、拖尾、Overlay 态增强
- Reveal 机制：基础信息与增强信息切换展示
- About 章节：增强后的 3D 抽象形象，支持随鼠标轻微转向
- Skills 章节：可自动旋转、可拖拽的技能轨道系统，支持关系连线与技能面板
- Projects 章节：项目总览、独立详情页、全屏沉浸卷宗
- Timeline 章节：滚动驱动路径绘制与成长节点展示
- Contact 章节：CLI 风格终端，支持 `帮助 / 联系 / 仓库 / 项目`
- 声音系统：Web Audio 环境氛围音、悬停反馈音、点击脉冲音、路由切换提示音
- 可访问性增强：Skip Link、主内容聚焦、弹层焦点锁定、Escape 关闭、键盘可操作
- favicon：已根据站点主视觉接入自定义标签图

## 技术栈

- React 19
- TypeScript
- Vite
- Three.js / React Three Fiber
- GSAP / ScrollTrigger
- Lenis

## 目录结构

```text
src/
  app/          应用入口、路由与全局状态
  components/   通用 UI、弹层、路由转场、声音开关等
  content/      页面文案、项目、技能与联系信息
  hooks/        通用 hooks
  pages/        首页、章节页、项目详情页、404
  scene/        3D 场景
  sections/     页面章节
  styles/       全局样式
  systems/      能量场、Reveal 等全局交互系统
  types/        类型定义
public/
  favicon.svg   站点标签图
scripts/
  build.mjs     自定义构建脚本
  serve.mjs     本地静态预览服务
```

## 本地运行

标准方式：

```bash
npm install
npm run dev
```

如果 PowerShell 执行策略拦住了 `npm.ps1`，在当前环境建议直接用：

```bash
npm.cmd install
npm.cmd run dev
```

默认开发地址：

```text
http://localhost:5173
```

## 构建与预览

```bash
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

默认预览地址：

```text
http://localhost:4173
```

其中：

- `npm.cmd run build`
  先执行 TypeScript 构建检查，再通过 `scripts/build.mjs` 生成 `dist/`
- `npm.cmd run preview`
  使用 `scripts/serve.mjs` 启动本地静态服务

## 内容修改入口

如果你只想修改个人信息、项目内容、仓库地址或联系信息，优先改这里：

```text
src/content/siteContent.ts
```

这里集中维护：

- 首页核心文案
- 关于我叙事内容
- 技能节点
- 项目条目
- 成长轨迹
- 联系终端命令

## 静态资源入口

静态资源统一放在：

```text
public/
```

当前构建脚本会把 `public/` 下的内容原样复制到 `dist/`。  
如果后续想手动补更真实的音效素材，建议放到：

```text
public/audio/
```

推荐准备这几类短音效：

- `ambient-space.*`
  低频、持续、无明显鼓点的环境氛围音
- `hover-soft.*`
  50ms 到 150ms 的轻微提示音，偏空灵或玻璃质感
- `click-pulse.*`
  100ms 到 300ms 的点击能量脉冲音
- `route-warp.*`
  页面切换时的短促推进音或低频扫频音

## 构建产物

执行：

```bash
npm.cmd run build
```

会生成：

```text
dist/
  index.html
  favicon.svg
  assets/
```

可直接部署到静态托管平台，例如：

- Vercel
- Netlify
- Nginx 静态站点

## 当前验证

当前仓库已验证通过：

```bash
npm.cmd run lint
npm.cmd run build
```
