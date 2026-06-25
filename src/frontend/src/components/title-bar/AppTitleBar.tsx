import { useState } from "react";
import { Badge, Breadcrumb, Button, Layout, Space, Tag } from "antd";
import {
  Cable,
  CarFront,
  Copy,
  Info,
  Minus,
  Settings,
  Square,
  X,
} from "lucide-react";

import type { PageRoute } from "../../routes/menu";
import type { ConnectionStatus, DeviceMode } from "../../types/device";
import DeviceConfigModal from "../device-config/DeviceConfigModal";
import TitleButton from "./TitleButton";

const { Header } = Layout;

const iconSize = 16;

type AppTitleBarProps = {
  activeRoute: PageRoute;
  deviceMode: DeviceMode;
  connectionStatus: ConnectionStatus;
  isMaximized: boolean;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onMaximizedChange: (value: boolean) => void;
};

function AppTitleBar({
  activeRoute,
  deviceMode,
  connectionStatus,
  isMaximized,
  onDeviceModeChange,
  onMaximizedChange,
}: AppTitleBarProps) {
  const [deviceConfigOpen, setDeviceConfigOpen] = useState(false);

  return (
    <>
      <Header className="app-titlebar">
        <div className="titlebar-left">
          <div className="app-logo" aria-label="PyVehicle">
            <CarFront size={18} strokeWidth={2.4} />
          </div>
          <span className="titlebar-system-name">PyVehicle</span>
          <span className="titlebar-divider" aria-hidden="true" />
          <Breadcrumb
            className="titlebar-breadcrumb"
            separator="/"
            items={[
              { title: activeRoute.group },
              { title: activeRoute.label },
            ]}
          />
          <span className="titlebar-divider" aria-hidden="true" />
          <Space size={8} className="device-area">
            <Button
              type="text"
              className="device-config-trigger"
              icon={<Cable size={iconSize} />}
              onClick={() => setDeviceConfigOpen(true)}
            >
              <span>设备配置</span>
              <Tag variant="filled" color="blue" className="device-mode-tag">
                {deviceMode}
              </Tag>
            </Button>
            <Badge
              status={connectionStatus === "就绪" ? "success" : "default"}
              text={<span className="device-status">{connectionStatus}</span>}
            />
          </Space>
        </div>

        <div className="window-actions">
          <TitleButton title="设置" icon={<Settings size={iconSize} />} />
          <TitleButton title="关于" icon={<Info size={iconSize} />} />
          <span className="titlebar-divider" aria-hidden="true" />
          <TitleButton title="最小化" icon={<Minus size={iconSize} strokeWidth={1.8} />} />
          <TitleButton
            title={isMaximized ? "还原" : "最大化"}
            icon={
              isMaximized ? (
                <Copy size={14} strokeWidth={1.7} />
              ) : (
                <Square size={13} strokeWidth={1.8} />
              )
            }
            onClick={() => onMaximizedChange(!isMaximized)}
          />
          <TitleButton title="关闭" icon={<X size={iconSize} />} danger />
        </div>
      </Header>

      <DeviceConfigModal
        open={deviceConfigOpen}
        deviceMode={deviceMode}
        onDeviceModeChange={onDeviceModeChange}
        onClose={() => setDeviceConfigOpen(false)}
      />
    </>
  );
}

export default AppTitleBar;
