import { Form, Input, Modal, Radio, Select } from "antd";

import type { DeviceMode } from "../../types/device";

type DeviceConfigModalProps = {
  open: boolean;
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onClose: () => void;
};

function DeviceConfigModal({
  open,
  deviceMode,
  onDeviceModeChange,
  onClose,
}: DeviceConfigModalProps) {
  return (
    <Modal
      title="设备配置"
      open={open}
      width={560}
      okText="保存"
      cancelText="取消"
      destroyOnHidden
      onOk={onClose}
      onCancel={onClose}
    >
      <Form layout="vertical" className="device-config-form">
        <Form.Item label="连接方式">
          <Radio.Group
            value={deviceMode}
            onChange={(event) => onDeviceModeChange(event.target.value)}
            optionType="button"
            buttonStyle="solid"
            options={["CAN", "网口"]}
          />
        </Form.Item>

        {deviceMode === "CAN" ? (
          <div className="form-row">
            <Form.Item label="CAN 通道">
              <Select
                defaultValue="can0"
                options={[
                  { value: "can0", label: "CAN 0" },
                  { value: "can1", label: "CAN 1" },
                  { value: "virtual", label: "Virtual CAN" },
                ]}
              />
            </Form.Item>
            <Form.Item label="波特率">
              <Select
                defaultValue="500k"
                options={[
                  { value: "250k", label: "250 Kbps" },
                  { value: "500k", label: "500 Kbps" },
                  { value: "1m", label: "1 Mbps" },
                ]}
              />
            </Form.Item>
          </div>
        ) : (
          <div className="form-row">
            <Form.Item label="网口地址">
              <Input defaultValue="192.168.0.10" />
            </Form.Item>
            <Form.Item label="端口">
              <Input defaultValue="13400" />
            </Form.Item>
          </div>
        )}
      </Form>
    </Modal>
  );
}

export default DeviceConfigModal;
