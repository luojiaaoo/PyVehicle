import { Card } from "antd";

type LogPanelProps = {
  title: string;
  lines: string[];
};

function LogPanel({ title, lines }: LogPanelProps) {
  return (
    <Card title={title} className="log-panel-card">
      <div className="log-panel">
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </Card>
  );
}

export default LogPanel;
