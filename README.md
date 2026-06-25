# PyVehicle

PyVehicle 是一个基于 `pywebview` 的桌面端车辆诊断与工具应用。项目通过 Python 提供本地文件、设备访问、诊断通信和格式转换能力，通过 TypeScript 前端提供清晰的操作界面，目标是构建一个可扩展、可维护的车辆工具平台。

## 技术栈

| 层级 | 技术 | 说明 |
| --- | --- | --- |
| 桌面容器 | `pywebview` | 创建桌面窗口并加载前端页面 |
| 后端运行时 | Python | 负责设备通信、文件访问、刷写和转换等本地能力 |
| 前端语言 | TypeScript | 负责界面状态、类型约束和页面逻辑 |
| 前端组件 | Ant Design | 作为主要 UI 组件库 |
| 样式系统 | Tailwind CSS | 补充布局、间距和局部样式 |
| 通信方式 | py-js 桥 | 前后端通过 `pywebview` 暴露的桥接 API 通信 |

## 架构原则

- 前端与 Python 端只通过 `pywebview` 的 py-js 桥通信。
- 不引入 HTTP API、WebSocket、本地端口轮询等旁路通信机制。
- Python 端负责文件系统、设备通信、刷写、诊断协议和转换任务。
- 前端负责界面渲染、用户输入、状态展示和桥接方法调用。
- 桥接方法统一返回明确的成功、数据和错误结构。

推荐桥接返回结构：

```ts
export type BridgeResult<T> = {
  success: boolean
  data?: T
  error?: string
}
```

推荐接口分组：

| 分组 | 职责 |
| --- | --- |
| `system.*` | 应用信息、文件选择、路径处理、环境信息 |
| `diagnostic.*` | 设备连接、诊断服务、刷写流程、DTC、数据流 |
| `converter.*` | 日志转换、烧录文件转换、转换任务状态 |

## 功能规划

### 诊断

- 刷写：选择烧录文件、展示设备状态、确认刷写参数、显示进度、日志和结果。
- 诊断：管理设备连接，执行诊断服务请求，展示响应结果、诊断日志、DTC 和数据流扩展区域。

### 格式转换

- 日志转换：导入原始日志，选择输入和目标格式，展示转换进度与输出路径。
- 烧录文件转换：导入烧录文件，识别或选择格式，设置转换参数并生成目标文件。

## 推荐目录结构

```text
PyVehicle/
  README.md
  pyproject.toml
  package.json
  src/
    PyVehicle/
      main.py
      bridge/
      services/
      utils/
    frontend/
      index.html
      src/
        App.tsx
        main.tsx
        routes/
        pages/
        bridge/
        styles/
  docs/
    architecture.md
    bridge-api.md
```

## 开发与运行

安装 Python 依赖：

```bash
uv sync
```

安装前端依赖：

```bash
npm install
```

启动前端开发服务：

```bash
npm run dev
```

构建前端资源：

```bash
npm run build
```

启动桌面应用：

```bash
uv run PyVehicle
```

或：

```bash
uv run python -m PyVehicle.main
```

## 开发约定

- 桥接层只负责参数接收、结果包装和调用服务层。
- 业务逻辑放在 `services` 中，避免堆积在 `Api` 类中。
- 前端页面不直接调用 `window.pywebview.api`，应通过 `bridge/client.ts` 统一封装。
- 所有桥接返回值都必须处理 `success === false` 的情况。
- 菜单配置集中维护，新增页面时同步补充路由、菜单和页面组件。
- 高风险操作如刷写、覆盖文件和安全访问必须由前端确认，并由 Python 端再次校验。

## 当前状态

项目当前处于初始化阶段。本文档作为项目简介和开发入口，详细工程规范以 `AGENTS.md` 为准。
