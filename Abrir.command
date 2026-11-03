#!/bin/zsh
set -eu
APP_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
open "$APP_DIR/vista-previa.html"
