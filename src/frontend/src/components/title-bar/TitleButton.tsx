import type { ReactNode } from "react";
import { Button, Tooltip } from "antd";

type TitleButtonProps = {
  title: string;
  icon: ReactNode;
  danger?: boolean;
  onClick?: () => void;
};

function TitleButton({ title, icon, danger, onClick }: TitleButtonProps) {
  const buttonClassName = danger
    ? "inline-flex h-[30px] w-[30px] items-center justify-center rounded text-[#485465] hover:!bg-[#d1242f] hover:!text-white"
    : "inline-flex h-[30px] w-[30px] items-center justify-center rounded text-[#485465] hover:!bg-[#e7ecf3] hover:!text-[#1f2328]";

  return (
    <Tooltip title={title}>
      <Button
        type="text"
        aria-label={title}
        className={buttonClassName}
        icon={icon}
        onClick={onClick}
      />
    </Tooltip>
  );
}

export default TitleButton;
