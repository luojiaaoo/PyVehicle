import { Alert, Button, Card, Descriptions, Flex, Form, Input, Progress, Select, Space, Tag } from "antd";
import { FileInput, Play, Upload } from "lucide-react";

import LogPanel from "./components/LogPanel";

const iconSize = 16;

function FlashingPage() {
  return (
    <div className="page-grid page-grid-wide">
      <Card title="刷写准备" extra={<Tag color="default">待连接</Tag>}>
        <Form layout="vertical">
          <Form.Item label="烧录文件">
            <Input
              readOnly
              placeholder="通过 Python 文件选择桥接后填充"
              suffix={<FileInput size={iconSize} />}
            />
          </Form.Item>
          <div className="form-row">
            <Form.Item label="目标 ECU">
              <Select
                placeholder="选择目标"
                options={[
                  { value: "engine", label: "发动机控制器" },
                  { value: "body", label: "车身控制器" },
                  { value: "gateway", label: "网关" },
                ]}
              />
            </Form.Item>
            <Form.Item label="刷写模式">
              <Select
                defaultValue="normal"
                options={[
                  { value: "normal", label: "标准刷写" },
                  { value: "verify", label: "校验模式" },
                  { value: "recovery", label: "恢复模式" },
                ]}
              />
            </Form.Item>
          </div>
          <Space>
            <Button type="primary" icon={<Upload size={iconSize} />}>
              选择文件
            </Button>
            <Button icon={<Play size={iconSize} />}>开始刷写</Button>
          </Space>
        </Form>
      </Card>

      <Card title="执行状态">
        <Flex vertical gap={16} className="w-full">
          <Descriptions
            size="small"
            column={2}
            items={[
              { key: "channel", label: "通道", children: "CAN / 500K" },
              { key: "security", label: "安全访问", children: "未请求" },
              { key: "file", label: "文件校验", children: "等待中" },
              { key: "retry", label: "重试策略", children: "失败后允许 1 次" },
            ]}
          />
          <Progress percent={0} status="normal" />
          <Alert
            type="info"
            showIcon
            title="当前只生成 UI 框架，刷写流程将在桥接和服务层接入后执行。"
          />
        </Flex>
      </Card>

      <LogPanel
        title="刷写日志"
        lines={[
          "[09:24:00] 等待选择烧录文件",
          "[09:24:00] 设备通道尚未连接",
          "[09:24:01] 刷写参数等待确认",
        ]}
      />
    </div>
  );
}

export default FlashingPage;
