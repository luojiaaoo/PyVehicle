import type { ReactNode } from "react";
import { Button, Tooltip } from "antd";

type TitleButtonProps = {
  title: string;
  icon: ReactNode;
  danger?: boolean;
  onClick?: () => void;
};

function TitleButton({ title, icon, danger, onClick }: TitleButtonProps) {
  return (
    <Tooltip title={title}>
      <Button
        type="text"
        aria-label={title}
        className={danger ? "title-button title-button-danger" : "title-button"}
        icon={icon}
        onClick={onClick}
      />
    </Tooltip>
  );
}

export default TitleButton;
