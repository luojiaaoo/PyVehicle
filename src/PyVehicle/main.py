from __future__ import annotations

import os
from pathlib import Path

import webview


def _frontend_url() -> str:
    dev_url = os.environ.get("PYVEHICLE_FRONTEND_URL")
    if dev_url:
        return dev_url

    dist_index = Path(__file__).resolve().parents[1] / "frontend" / "dist" / "index.html"
    return str(dist_index)


def main() -> None:
    webview.create_window(
        title="PyVehicle",
        url=_frontend_url(),
        width=1280,
        height=800,
        min_size=(1100, 680),
        frameless=True,
        easy_drag=False,
    )
    webview.start()


if __name__ == "__main__":
    main()
