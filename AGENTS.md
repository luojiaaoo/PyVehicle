# PyVehicle

PyVehicle 是一个基于 `pywebview` 的桌面端车辆诊断与工具应用。项目目标是将 Python 的本地能力、设备访问能力和文件处理能力，与 TypeScript 前端界面结合，形成一个可扩展、可维护的车辆工具平台。

当前 README 作为项目启动阶段的工程规范与开发指南使用，描述推荐架构、通信约束、页面规划和后续实现约定。

## 技术栈

| 层级 | 技术 | 说明 |
| --- | --- | --- |
| 桌面容器 | `pywebview` | 使用 Python 创建桌面窗口并加载前端页面 |
| 后端运行时 | Python | 负责设备通信、文件访问、格式转换、刷写流程等本地能力 |
| 前端语言 | TypeScript | 负责界面状态、类型约束和页面逻辑 |
| 前端组件 | Ant Design | 作为主要 UI 组件库 |
| 样式系统 | Tailwind CSS | 负责布局、间距、响应式和局部样式控制 |
| 通信方式 | py-js 桥 | 前后端通过 `pywebview` 暴露的 Python-JavaScript 桥通信 |

## 核心架构原则

PyVehicle 必须遵守以下架构边界：

1. 前端与 Python 端只允许通过 `pywebview` 的 py-js 桥通信。
2. 不允许为了本地通信额外引入 HTTP API、WebSocket、轮询本地端口或其他旁路通信机制。
3. Python 端负责系统能力和业务执行，包括文件选择、文件读写、设备连接、刷写、诊断协议调用和转换任务。
4. 前端负责界面渲染、用户输入、状态展示和调用桥接方法，不直接访问本地文件系统或设备。
5. 所有桥接方法必须有明确的输入、输出和错误结构，避免在页面中分散处理异常分支。

推荐的窗口创建方式：

```python
import webview


class Api:
    pass


if __name__ == "__main__":
    window = webview.create_window(
        title="PyVehicle",
        url="frontend/dist/index.html",
        js_api=Api(),
        width=1280,
        height=800,
    )
    webview.start()
```

前端调用方式：

```ts
const result = await window.pywebview.api.system.getAppInfo()
```

## 通信约定

所有 py-js 桥方法建议统一返回以下结构：

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
| `diagnostic.*` | 设备连接、诊断服务调用、刷写流程、DTC、数据流 |
| `converter.*` | 日志转换、烧录文件转换、转换任务状态 |

示例：

```ts
type AppInfo = {
  name: string
  version: string
}

const response: BridgeResult<AppInfo> =
  await window.pywebview.api.system.getAppInfo()

if (!response.success) {
  throw new Error(response.error ?? "未知错误")
}
```

Python 端应捕获业务异常并转换为统一返回值：

```python
def ok(data=None):
    return {"success": True, "data": data}


def fail(error: str):
    return {"success": False, "error": error}
```

## 页面布局

应用主界面采用左右结构：

- 左侧为二级菜单导航。
- 右侧为内容页面。
- 内容区根据当前菜单项渲染对应功能页面。
- 菜单配置应集中维护，页面组件只处理自身业务逻辑。

菜单结构：

```text
诊断
  - 刷写
  - 诊断

格式转换
  - 日志转换
  - 烧录文件转换
```

推荐使用 Ant Design 的 `Layout`、`Menu`、`Tabs`、`Card`、`Form`、`Button`、`Upload`、`Progress`、`Table`、`Alert`、`Descriptions` 等组件组织页面。Tailwind CSS 用于补充页面布局、间距、宽高、滚动区域和局部状态样式。

## 功能页面规划

### 刷写

用于执行车辆控制器或相关设备的刷写流程。

页面应包含：

- 烧录文件选择。
- 目标设备或通道状态展示。
- 刷写参数展示与确认。
- 刷写进度条。
- 执行日志与结果状态。
- 失败原因展示和可重试入口。

Python 端职责：

- 校验烧录文件。
- 管理设备连接。
- 执行刷写流程。
- 返回进度、状态和错误信息。

前端职责：

- 收集用户选择。
- 展示刷写状态。
- 调用受控桥接方法。
- 禁止在刷写过程中触发冲突操作。

### 诊断

用于执行车辆诊断能力，后续可扩展为诊断服务、DTC、数据流和会话管理。

页面应包含：

- 设备连接状态。
- 诊断服务选择或输入。
- 请求参数编辑。
- 响应结果展示。
- 诊断日志。
- DTC、数据流等扩展区域。

Python 端职责：

- 封装诊断协议和设备通信。
- 管理诊断会话。
- 执行请求并返回结构化响应。

前端职责：

- 提供参数输入和结果展示。
- 不直接拼接底层设备访问逻辑。
- 对高风险诊断操作进行确认。

### 日志转换

用于将原始日志转换为目标格式，便于分析、归档或导入其他工具。

页面应包含：

- 日志文件导入。
- 输入格式识别或手动选择。
- 目标格式选择。
- 转换进度。
- 输出路径展示。
- 转换结果下载或打开入口。

Python 端职责：

- 读取和解析日志文件。
- 执行格式转换。
- 写入转换结果。
- 返回转换状态和错误信息。

前端职责：

- 提供转换配置界面。
- 展示转换状态。
- 调用文件选择和转换桥接方法。

### 烧录文件转换

用于在不同烧录文件格式之间转换，服务于刷写流程或外部工具兼容。

页面应包含：

- 烧录文件导入。
- 源格式识别或选择。
- 目标格式选择。
- 转换参数设置。
- 转换结果展示。
- 输出文件路径或保存入口。

Python 端职责：

- 校验文件格式。
- 解析源文件。
- 生成目标格式文件。
- 返回转换摘要和错误信息。

前端职责：

- 提供参数输入。
- 展示格式信息。
- 调用转换桥接方法。

## 建议目录结构

当前项目尚未初始化完整代码，建议后续按以下结构组织：

```text
PyVehicle/
  README.md
  pyproject.toml
  package.json
  src/
    PyVehicle/
      __init__.py
      main.py
      bridge/
        __init__.py
        api.py
        system.py
        diagnostic.py
        converter.py
      services/
        diagnostic/
        converter/
      utils/
    frontend/
      index.html
      src/
        main.tsx
        App.tsx
        routes/
          menu.ts
        pages/
          flashing/
          diagnostic/
          log-converter/
          flash-file-converter/
        bridge/
          client.ts
          types.ts
        styles/
          index.css
      tailwind.config.ts
      tsconfig.json
      vite.config.ts
  docs/
    architecture.md
    bridge-api.md
```

目录职责：

| 路径 | 职责 |
| --- | --- |
| `src/PyVehicle/main.py` | 应用入口，创建 pywebview 窗口 |
| `src/PyVehicle/bridge/` | Python 暴露给前端的桥接 API |
| `src/PyVehicle/services/` | 诊断、刷写、转换等业务实现 |
| `src/frontend/src/pages/` | 前端功能页面 |
| `src/frontend/src/routes/menu.ts` | 左侧二级菜单配置 |
| `src/frontend/src/bridge/` | 前端桥接调用封装和类型定义 |
| `docs/` | 架构、接口和业务说明文档 |

## 开发规范

### Python 端

- 桥接层只负责参数接收、结果包装和调用服务层。
- 业务逻辑应放在 `services` 中，避免堆积在 `Api` 类中。
- 所有文件系统、设备、进程和高风险操作必须由 Python 端统一封装。
- 对外暴露给前端的方法应保持小而明确。
- 捕获异常后返回 `BridgeResult`，不要把 Python 异常对象直接暴露给前端。

### 前端

- 使用 TypeScript 编写所有页面和桥接调用。
- antd 作为基础组件库，避免重复实现已有成熟组件。
- Tailwind CSS 只负责布局、间距、尺寸和局部样式补充。
- 页面不直接调用 `window.pywebview.api`，应通过 `bridge/client.ts` 统一封装。
- 所有桥接返回值都必须处理 `success === false` 的情况。
- 菜单配置集中维护，新增页面时同步补充路由、菜单和页面组件。

### 样式

- 页面主布局保持稳定，左侧菜单宽度固定或使用统一设计变量。
- 内容区应支持滚动，避免长日志或表格撑破窗口。
- 刷写进度、转换进度、错误提示等状态必须有明确视觉反馈。
- 优先使用 antd 组件状态和 Tailwind 工具类，不建议编写大量零散 CSS。

## 开发与运行

以下命令为推荐方案，实际脚本可在项目初始化后补齐。

### 安装 Python 依赖

```bash
uv sync
```

### 安装前端依赖

```bash
npm install
```

### 启动前端开发服务

```bash
npm run dev
```

开发阶段可以让 `pywebview` 加载前端开发服务地址，但通信仍必须通过 py-js 桥完成，不应新增 HTTP 业务接口。

### 构建前端资源

```bash
npm run build
```

### 启动桌面应用

```bash
uv run PyVehicle
```

或在入口脚本明确后使用：

```bash
uv run python -m PyVehicle.main
```

### 打包发布

后续可根据目标平台选择 `PyInstaller`、`Nuitka` 或其他 Python 桌面应用打包方案。打包时需要确保前端构建产物被包含在应用资源中，并由 `pywebview` 正确加载。

## 新增页面流程

新增功能页面时，按以下顺序处理：

1. 在前端 `pages` 目录新增页面组件。
2. 在菜单配置中新增二级菜单项。
3. 在桥接类型文件中定义需要的请求和响应类型。
4. 在 Python 桥接层新增受控方法。
5. 在服务层实现业务逻辑。
6. 在 README 或 `docs/bridge-api.md` 中补充接口说明。
7. 补充必要的单元测试、集成测试或手动验证记录。

## 安全与边界

- 前端不得直接读取、写入或删除本地文件。
- 前端不得直接访问设备、串口、CAN、DoIP 或其他通信通道。
- 刷写、诊断、安全访问等高风险动作必须由 Python 端集中校验。
- 涉及覆盖文件、擦写设备、执行刷写前，应在前端提供确认交互，并由 Python 端再次校验参数。
- 错误信息应可读，但不应泄露不必要的系统路径、密钥或敏感环境信息。

## 测试建议

### Python

- 桥接方法返回结构测试。
- 文件格式校验测试。
- 转换服务单元测试。
- 诊断与刷写服务的模拟设备测试。

### 前端

- 菜单渲染测试。
- 页面切换测试。
- 桥接调用封装测试。
- 错误状态展示测试。
- 长日志、长表格和进度状态的界面验证。

### 集成验证

- 应用窗口可以正常启动。
- 左侧菜单可以切换四个功能页面。
- 前端可以通过 py-js 桥调用 Python 方法。
- 无 HTTP API、WebSocket 或本地端口业务通信。
- 前端构建产物可以被 `pywebview` 加载。

## 当前状态

项目当前处于初始化阶段。README 中的目录结构、脚本命令和接口分组是推荐落地规范，后续实现代码时应优先保持与本文档一致。
