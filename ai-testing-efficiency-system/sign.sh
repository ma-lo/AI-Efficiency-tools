#!/usr/bin/env bash
# 作者发布前在本地运行一次：生成哈希清单并用 GPG 私钥签名
# 用法：bash sign.sh
set -e
cd "$(dirname "$0")"

find . -type f ! -name "MANIFEST.sha256" ! -name "MANIFEST.sha256.sig" \
  ! -path "./.git/*" -print0 | sort -z | xargs -0 sha256sum > MANIFEST.sha256

gpg --detach-sign --armor MANIFEST.sha256
echo "已生成 MANIFEST.sha256 与 MANIFEST.sha256.sig，提交推送即可"
