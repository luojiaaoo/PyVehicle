import { useMemo, useState } from "react";
import { ConfigProvider, Layout, Menu, theme, type MenuProps } from "antd";
import zhCN from "antd/locale/zh_CN";

import AppTitleBar from "./components/title-bar/AppTitleBar";
import FlashingPage from "./pages/flashing/FlashingPage";
import { getRoute, menuItems, type PageKey } from "./routes/menu";
import type { ConnectionStatus, DeviceMode } from "./types/device";

const { Content, Header } = Layout;

function App() {
  const [activeKey, setActiveKey] = useState<PageKey>("flashing");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("CAN");
  const [connectionStatus] = useState<ConnectionStatus>("未连接");
  const [isMaximized, setIsMaximized] = useState(false);

  const activeRoute = getRoute(activeKey);
  const selectedKeys = useMemo(() => [activeKey], [activeKey]);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    setActiveKey(key as PageKey);
  };

  const popupRender: MenuProps["popupRender"] = (originNode) => (
    <div className="app-menu-popup min-w-[220px] rounded-md border border-[#d8dee8] bg-white p-1.5 shadow-[0_8px_24px_rgb(31_35_40_/_12%)]">
      {originNode}
    </div>
  );

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1f6feb",
          colorSuccess: "#2da44e",
          colorWarning: "#b7791f",
          colorError: "#d1242f",
          borderRadius: 6,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        components: {
          Card: {
            borderRadiusLG: 6,
          },
          Menu: {
            itemBorderRadius: 4,
            horizontalItemSelectedColor: "#1f6feb",
          },
        },
      }}
    >
      <Layout className="h-screen min-w-[1040px] bg-[#e9edf3]">
        <AppTitleBar
          activeRoute={activeRoute}
          deviceMode={deviceMode}
          connectionStatus={connectionStatus}
          isMaximized={isMaximized}
          onDeviceModeChange={setDeviceMode}
          onMaximizedChange={setIsMaximized}
        />

        <Header className="h-[42px] border-b border-[#d8dee8] bg-white px-4 leading-[42px]">
          <Menu
            mode="horizontal"
            items={menuItems}
            selectedKeys={selectedKeys}
            onClick={handleMenuClick}
            popupRender={popupRender}
          />
        </Header>

        <Content className="h-[calc(100vh-84px)] overflow-auto bg-[#e9edf3] px-3 pb-3 pt-2.5">
          {activeKey === "flashing" && <FlashingPage />}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
