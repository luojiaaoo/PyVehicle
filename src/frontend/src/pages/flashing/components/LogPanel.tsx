import { Card } from "antd";

type LogPanelProps = {
  title: string;
  lines: string[];
};

function LogPanel({ title, lines }: LogPanelProps) {
  return (
    <Card title={title} className="col-span-full">
      <div className="h-[180px] overflow-auto rounded border border-[#111827] bg-[#20242c] px-3 py-2.5 font-mono text-xs leading-[1.7] text-[#d0d7de]">
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </Card>
  );
}

export default LogPanel;
