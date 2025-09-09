#!/usr/bin/env bash
set -euo pipefail

# Setup helper for putting the VS Code `code` CLI on PATH (macOS primary).
# - Default: creates symlinks under ~/.local/bin and ensures it's on PATH for zsh.
# - Optional: pass --sudo to link into /usr/local/bin (prompts for password).
# - Also sets up `code-insiders` if Insiders app is found.

USE_SUDO=0
DEST_DIR="$HOME/.local/bin"

for arg in "$@"; do
  case "$arg" in
    --sudo)
      USE_SUDO=1
      ;;
    --dest=*)
      DEST_DIR="${arg#*=}"
      ;;
    --help|-h)
      cat <<EOF
Usage: $0 [--sudo] [--dest=DIR]

Ensures the VS Code CLI `code` is available on PATH.
Defaults to non-sudo symlinks in ~/.local/bin and zsh PATH update.

Options:
  --sudo       Place symlinks in /usr/local/bin (uses sudo)
  --dest=DIR   Place symlinks in DIR instead of ~/.local/bin
  -h, --help   Show this help
EOF
      exit 0
      ;;
  esac
done

if command -v code >/dev/null 2>&1; then
  echo "'code' is already on PATH: $(command -v code)"
  code -v || true
  exit 0
fi

OS=$(uname -s)
if [[ "$OS" != "Darwin" && "$OS" != "Linux" ]]; then
  echo "OS '$OS' is not handled by this script."
  exit 1
fi

if [[ "$OS" == "Darwin" ]]; then
  # Look for VS Code app bundle(s)
  CANDIDATES=(
    "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
    "$HOME/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
  )
  INSIDERS_CANDIDATES=(
    "/Applications/Visual Studio Code - Insiders.app/Contents/Resources/app/bin/code-insiders"
    "$HOME/Applications/Visual Studio Code - Insiders.app/Contents/Resources/app/bin/code-insiders"
  )

  CODE_SRC=""
  for p in "${CANDIDATES[@]}"; do
    if [[ -x "$p" ]]; then CODE_SRC="$p"; break; fi
  done

  INSIDERS_SRC=""
  for p in "${INSIDERS_CANDIDATES[@]}"; do
    if [[ -x "$p" ]]; then INSIDERS_SRC="$p"; break; fi
  done

  if [[ -z "$CODE_SRC" && -z "$INSIDERS_SRC" ]]; then
    cat <<EOF
Could not find the VS Code app bundle.
Checked:
  - /Applications/Visual Studio Code.app
  - $HOME/Applications/Visual Studio Code.app
  - /Applications/Visual Studio Code - Insiders.app
  - $HOME/Applications/Visual Studio Code - Insiders.app

Install VS Code from https://code.visualstudio.com/ then re-run this script.
Alternatively, in VS Code: Command Palette → "Shell Command: Install 'code' command in PATH".
EOF
    exit 1
  fi

  if [[ $USE_SUDO -eq 1 ]]; then
    DEST_DIR="/usr/local/bin"
    echo "Using sudo to link into $DEST_DIR"
    sudo mkdir -p "$DEST_DIR"
    if [[ -n "$CODE_SRC" ]]; then
      sudo ln -sf "$CODE_SRC" "$DEST_DIR/code"
      echo "Linked: $DEST_DIR/code -> $CODE_SRC"
    fi
    if [[ -n "$INSIDERS_SRC" ]]; then
      sudo ln -sf "$INSIDERS_SRC" "$DEST_DIR/code-insiders"
      echo "Linked: $DEST_DIR/code-insiders -> $INSIDERS_SRC"
    fi
  else
    mkdir -p "$DEST_DIR"
    if [[ -n "$CODE_SRC" ]]; then
      ln -sf "$CODE_SRC" "$DEST_DIR/code"
      echo "Linked: $DEST_DIR/code -> $CODE_SRC"
    fi
    if [[ -n "$INSIDERS_SRC" ]]; then
      ln -sf "$INSIDERS_SRC" "$DEST_DIR/code-insiders"
      echo "Linked: $DEST_DIR/code-insiders -> $INSIDERS_SRC"
    fi

    # Ensure ~/.local/bin on PATH for zsh
    if [[ "$DEST_DIR" == "$HOME/.local/bin" ]]; then
      ZSHRC="$HOME/.zshrc"
      LINE='export PATH="$HOME/.local/bin:$PATH"'
      if ! grep -Fq "$LINE" "$ZSHRC" 2>/dev/null; then
        echo "$LINE" >> "$ZSHRC"
        echo "Added to $ZSHRC: $LINE"
        ADDED_PATH=1
      else
        ADDED_PATH=0
      fi
      # Make available in current shell session (if zsh)
      export PATH="$HOME/.local/bin:$PATH"
    fi
  fi

  if command -v code >/dev/null 2>&1; then
    echo "'code' now on PATH: $(command -v code)"
    code -v || true
    exit 0
  else
    echo "'code' is not visible in this shell yet."
    if [[ "${ADDED_PATH-0}" -eq 1 ]]; then
      echo "Open a new terminal or run: exec zsh"
    else
      echo "Ensure $DEST_DIR is on your PATH, then open a new terminal."
    fi
    exit 0
  fi
fi

# Linux helper (best-effort)
if [[ "$OS" == "Linux" ]]; then
  if command -v code >/dev/null 2>&1; then
    echo "'code' already available: $(command -v code)"
    exit 0
  fi
  echo "On Linux, install VS Code and the 'code' CLI via your package manager."
  echo "If you have the code binary path, symlink it into $DEST_DIR and add that to PATH."
  exit 1
fi

