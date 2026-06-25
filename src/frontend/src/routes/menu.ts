import type { MenuProps } from "antd";

export type PageKey = "flashing";

export type PageRoute = {
  key: PageKey;
  label: string;
  group: string;
  description: string;
};

export const pageRoutes: PageRoute[] = [
  {
    key: "flashing",
    label: "刷写",
    group: "诊断",
    description: "控制器刷写流程、进度和执行日志",
  },
];

export const menuItems: MenuProps["items"] = [
  {
    key: "diagnostic-group",
    label: "诊断",
    children: [
      { key: "flashing", label: "刷写" },
    ],
  },
];

export function getRoute(key: string): PageRoute {
  return pageRoutes.find((route) => route.key === key) ?? pageRoutes[0];
}
