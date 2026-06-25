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
      <Header className="flex h-[42px] items-center justify-between border-b border-[#d8dee8] bg-[#f8fafc] py-0 pl-3.5 pr-2 leading-none select-none">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="grid h-7 w-7 flex-none place-items-center rounded-md bg-[#1f6feb] text-white shadow-[inset_0_-1px_0_rgb(0_0_0_/_18%)]"
            aria-label="PyVehicle"
          >
            <CarFront size={18} strokeWidth={2.4} />
          </div>
          <span className="whitespace-nowrap text-[13px] font-semibold text-[#1f2328]">
            PyVehicle
          </span>
          <span className="mx-1 h-[18px] w-px flex-none bg-[#cfd6e2]" aria-hidden="true" />
          <Breadcrumb
            className="titlebar-breadcrumb min-w-[120px] max-w-[360px] whitespace-nowrap max-[1180px]:min-w-[100px] max-[1180px]:max-w-[260px]"
            separator="/"
            items={[
              { title: activeRoute.group },
              { title: activeRoute.label },
            ]}
          />
          <span className="mx-1 h-[18px] w-px flex-none bg-[#cfd6e2]" aria-hidden="true" />
          <Space size={8} className="h-7">
            <Button
              type="text"
              className="inline-flex h-7 items-center gap-1.5 rounded px-2 text-[#485465] hover:!bg-[#e7ecf3] hover:!text-[#1f2328]"
              icon={<Cable size={iconSize} />}
              onClick={() => setDeviceConfigOpen(true)}
            >
              <span>设备配置</span>
              <Tag variant="filled" color="blue" className="!me-0 leading-[18px]">
                {deviceMode}
              </Tag>
            </Button>
            <Badge
              status={connectionStatus === "就绪" ? "success" : "default"}
              text={<span className="text-xs text-[#57606a]">{connectionStatus}</span>}
            />
          </Space>
        </div>

        <div className="flex flex-none items-center gap-1">
          <TitleButton title="设置" icon={<Settings size={iconSize} />} />
          <TitleButton title="关于" icon={<Info size={iconSize} />} />
          <span className="mx-1 h-[18px] w-px flex-none bg-[#cfd6e2]" aria-hidden="true" />
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
