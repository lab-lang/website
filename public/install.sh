#!/bin/sh
# Installs lab, labc, and lab-opt from the latest GitHub release of
# lab-lang/lab.
#
#   curl -sSf https://www.lab-compiler.org/install.sh | sh
#
# Environment overrides:
#   LAB_VERSION        Install a specific tag (e.g. v0.2.0) instead of latest.
#   LAB_INSTALL_DIR    Install directory. Defaults to $HOME/.lab/bin.
#   LAB_NO_MODIFY_PATH Set to skip touching any shell profile.

set -eu

REPO="lab-lang/lab"
INSTALL_DIR="${LAB_INSTALL_DIR:-$HOME/.lab/bin}"
ENV_FILE="$HOME/.lab/env"

say() {
  printf '%s\n' "$1"
}

err() {
  printf 'install.sh: %s\n' "$1" >&2
  exit 1
}

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "need '$1' (command not found)"
  fi
}

need_cmd curl
need_cmd tar

detect_os() {
  case "$(uname -s)" in
    Darwin) echo "apple-darwin" ;;
    Linux) echo "unknown-linux-gnu" ;;
    *)
      err "unsupported OS '$(uname -s)'; download a binary from https://github.com/${REPO}/releases, or use WSL on Windows"
      ;;
  esac
}

detect_arch() {
  case "$(uname -m)" in
    x86_64 | amd64) echo "x86_64" ;;
    arm64 | aarch64) echo "aarch64" ;;
    *)
      err "unsupported architecture '$(uname -m)'"
      ;;
  esac
}

os="$(detect_os)"
arch="$(detect_arch)"
target="${arch}-${os}"
asset="lab-${target}.tar.gz"

if [ -n "${LAB_VERSION:-}" ]; then
  base_url="https://github.com/${REPO}/releases/download/${LAB_VERSION}"
else
  base_url="https://github.com/${REPO}/releases/latest/download"
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT INT TERM

download() {
  curl --proto '=https' --tlsv1.2 -fsSL "${base_url}/$1" -o "${tmp_dir}/$1"
}

say "Downloading ${asset}..."
download "$asset"
download "SHA256SUMS"

checksum_line="$(awk -v f="$asset" '$2 == f { print; found = 1 } END { exit !found }' "${tmp_dir}/SHA256SUMS")" ||
  err "no checksum entry for ${asset} in SHA256SUMS"

if command -v shasum >/dev/null 2>&1; then
  (cd "$tmp_dir" && echo "$checksum_line" | shasum -a 256 -c -) >/dev/null || err "checksum verification failed for ${asset}"
elif command -v sha256sum >/dev/null 2>&1; then
  (cd "$tmp_dir" && echo "$checksum_line" | sha256sum -c -) >/dev/null || err "checksum verification failed for ${asset}"
else
  err "need 'shasum' or 'sha256sum' to verify the download"
fi

tar -xzf "${tmp_dir}/${asset}" -C "$tmp_dir"

mkdir -p "$INSTALL_DIR"
for bin in lab labc lab-opt; do
  mv "${tmp_dir}/${bin}" "${INSTALL_DIR}/${bin}"
  chmod +x "${INSTALL_DIR}/${bin}"
done

say "Installed lab, labc, and lab-opt to ${INSTALL_DIR}"

# A small sourceable file, independent of any one shell's rc syntax, so every
# profile we touch below can just source it instead of duplicating the PATH
# logic. $PATH itself is intentionally left unexpanded here (escaped with
# \$) so it's evaluated when the file is sourced later, not right now.
mkdir -p "$(dirname "$ENV_FILE")"
cat > "$ENV_FILE" <<EOF
case ":\${PATH}:" in
  *":${INSTALL_DIR}:"*) ;;
  *) export PATH="${INSTALL_DIR}:\${PATH}" ;;
esac
EOF

already_on_path() {
  case ":$PATH:" in
    *":${INSTALL_DIR}:"*) return 0 ;;
    *) return 1 ;;
  esac
}

append_once() {
  # $1 = rc file, $2 = line to add if not already present
  rc_file="$1"
  line="$2"
  if [ -f "$rc_file" ] && grep -qF "$line" "$rc_file" 2>/dev/null; then
    say "${INSTALL_DIR} is already configured in ${rc_file}."
    return
  fi
  mkdir -p "$(dirname "$rc_file")"
  printf '\n# Added by the lab installer\n%s\n' "$line" >>"$rc_file"
  say "Added ${INSTALL_DIR} to PATH via ${rc_file}."
}

setup_path() {
  if already_on_path; then
    return
  fi

  if [ -n "${LAB_NO_MODIFY_PATH:-}" ]; then
    say ""
    say "${INSTALL_DIR} is not on your PATH. Add it by sourcing:"
    say "  . \"${ENV_FILE}\""
    return
  fi

  say ""
  case "${SHELL:-}" in
    */fish)
      if command -v fish >/dev/null 2>&1 && fish -c "fish_add_path ${INSTALL_DIR}" >/dev/null 2>&1; then
        say "Added ${INSTALL_DIR} to PATH via fish_add_path."
        return
      fi
      append_once "${XDG_CONFIG_HOME:-$HOME/.config}/fish/config.fish" "fish_add_path ${INSTALL_DIR}"
      ;;
    */zsh)
      append_once "${ZDOTDIR:-$HOME}/.zshrc" ". \"${ENV_FILE}\""
      ;;
    */bash)
      if [ -f "$HOME/.bashrc" ]; then
        append_once "$HOME/.bashrc" ". \"${ENV_FILE}\""
      else
        append_once "$HOME/.bash_profile" ". \"${ENV_FILE}\""
      fi
      ;;
    *)
      append_once "$HOME/.profile" ". \"${ENV_FILE}\""
      ;;
  esac
  say "Start a new shell, or run:  . \"${ENV_FILE}\""
}

setup_path

say ""
say "Run 'lab update' any time to install a newer release."
