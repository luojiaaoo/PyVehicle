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
    <div className="app-menu-popup">{originNode}</div>
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
      <Layout className="app-shell">
        <AppTitleBar
          activeRoute={activeRoute}
          deviceMode={deviceMode}
          connectionStatus={connectionStatus}
          isMaximized={isMaximized}
          onDeviceModeChange={setDeviceMode}
          onMaximizedChange={setIsMaximized}
        />

        <Header className="app-menubar">
          <Menu
            mode="horizontal"
            items={menuItems}
            selectedKeys={selectedKeys}
            onClick={handleMenuClick}
            popupRender={popupRender}
          />
        </Header>

        <Content className="app-content">
          {activeKey === "flashing" && <FlashingPage />}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
