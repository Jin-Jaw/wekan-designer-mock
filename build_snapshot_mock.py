#!/usr/bin/env python3
from __future__ import annotations

import mimetypes
import re
import sys
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup


ROOT_URL = "http://127.0.0.1:8080"
DEFAULT_SNAPSHOT = Path("/home/oem/Desktop/test.html")
HERE = Path(__file__).resolve().parent
VENDOR_DIR = HERE / "vendor"
ASSETS_DIR = HERE / "assets"


def fetch(url: str) -> tuple[bytes, str]:
    request = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(request) as response:
        content_type = response.headers.get_content_type()
        return response.read(), content_type


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def relative_path(path: Path) -> str:
    return f"./{path.relative_to(HERE).as_posix()}"


def vendor_target_for_url(url: str) -> Path:
    split = urlsplit(url)
    return VENDOR_DIR / split.path.lstrip("/")


def asset_target_for_url(url: str, content_type: str) -> Path:
    split = urlsplit(url)
    name = Path(split.path).name or "asset"
    if "." not in name:
        extension = mimetypes.guess_extension(content_type) or ""
        if extension == ".jpe":
            extension = ".jpg"
        name = f"{name}{extension}"

    if split.path.startswith("/cdn/storage/attachments/"):
        return ASSETS_DIR / "attachments" / name
    return ASSETS_DIR / name


def find_local_attachment(url: str) -> Path | None:
    split = urlsplit(url)
    attachment_id = Path(split.path).name
    for candidate in sorted(ASSETS_DIR.glob(f"{attachment_id}.*")):
        if candidate.is_file():
            return candidate
    for candidate in sorted((ASSETS_DIR / "attachments").glob(f"{attachment_id}.*")):
        if candidate.is_file():
            return candidate
    return None


def download_binary(url: str, target: Path) -> None:
    if target.exists():
        return
    data, _ = fetch(url)
    ensure_parent(target)
    target.write_bytes(data)


def download_css_and_assets(url: str, target: Path) -> None:
    if target.exists():
        css = target.read_text(encoding="utf-8")
    else:
        data, _ = fetch(url)
        css = data.decode("utf-8")
        ensure_parent(target)
        target.write_text(css, encoding="utf-8")

    for match in re.finditer(r"url\(([^)]+)\)", css):
        raw_ref = match.group(1).strip().strip("\"'")
        if not raw_ref or raw_ref.startswith("data:"):
            continue
        asset_url = urljoin(url, raw_ref)
        asset_target = vendor_target_for_url(asset_url)
        download_binary(asset_url, asset_target)


def build(snapshot_path: Path) -> None:
    html = snapshot_path.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")
    asset_map: dict[str, str] = {}

    for script in list(soup.find_all("script")):
        script.decompose()

    for overlay in list(soup.select(".board-conversion-overlay")):
        overlay.decompose()

    if soup.body:
        soup.body.attrs.pop("style", None)
        classes = list(soup.body.get("class", []))
        if "mock-standalone" not in classes:
            classes.append("mock-standalone")
        soup.body["class"] = classes

    head = soup.head
    if head is None:
        raise RuntimeError("Snapshot has no <head> element")

    if not head.find("meta", attrs={"charset": True}):
        meta = soup.new_tag("meta", charset="utf-8")
        head.insert(0, meta)
    if not head.find("meta", attrs={"name": "viewport"}):
        viewport = soup.new_tag("meta")
        viewport["name"] = "viewport"
        viewport["content"] = "width=device-width, initial-scale=1"
        head.insert(1, viewport)

    for link in soup.find_all("link", href=True):
        href = link["href"]
        if not href.startswith("/"):
            continue
        url = urljoin(ROOT_URL, href)
        target = vendor_target_for_url(url)
        download_css_and_assets(url, target)
        link["href"] = relative_path(target)

    for tag in soup.find_all(src=True):
        src = tag["src"]
        if not src.startswith("/"):
            continue
        url = urljoin(ROOT_URL, src)
        try:
            data, content_type = fetch(url)
            target = asset_target_for_url(url, content_type)
            ensure_parent(target)
            target.write_bytes(data)
        except Exception:
            fallback = find_local_attachment(url)
            if fallback is None:
                raise
            target = ASSETS_DIR / "attachments" / fallback.name
            ensure_parent(target)
            target.write_bytes(fallback.read_bytes())
        local_src = relative_path(target)
        asset_map[src] = local_src
        tag["src"] = local_src

    for tag in soup.find_all(style=True):
        style = tag["style"]
        for remote, local in asset_map.items():
            style = style.replace(remote, local)
        tag["style"] = style

    for anchor in soup.find_all("a", href=True):
        href = anchor["href"]
        if href.startswith("/"):
            anchor["data-original-href"] = href
            anchor["href"] = "#"

    mock_css = soup.new_tag("link", rel="stylesheet", href="./mock.css")
    head.append(mock_css)

    mock_js = soup.new_tag("script", src="./app.js", defer=True)
    soup.body.append(mock_js)

    output = "<!doctype html>\n" + str(soup)
    (HERE / "index.html").write_text(output, encoding="utf-8")


def main() -> int:
    snapshot_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SNAPSHOT
    if not snapshot_path.exists():
        raise SystemExit(f"Snapshot not found: {snapshot_path}")
    build(snapshot_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
