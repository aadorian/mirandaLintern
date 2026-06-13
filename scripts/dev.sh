#!/usr/bin/env bash
# Instala dependencias, ejecuta pruebas, compila y abre VS Code/Cursor
# con la extensión Miranda en modo desarrollo.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SKIP_TESTS=false
SKIP_LAUNCH=false
INSTALL_VSIX=false
EXAMPLE_FILE="${ROOT}/examples/fib.m"

usage() {
  cat <<'EOF'
Uso: ./scripts/dev.sh [opciones]

Opciones:
  --skip-tests      Omite npm run test:all
  --skip-launch     Solo instala, compila y prueba (no abre el editor)
  --install-vsix    Empaqueta e instala la extensión (.vsix) además del modo dev
  --example <path>  Archivo .m a abrir (por defecto: examples/fib.m)
  -h, --help        Muestra esta ayuda

Ejemplos:
  ./scripts/dev.sh
  ./scripts/dev.sh --example examples/quicksort.m
  ./scripts/dev.sh --skip-tests
  npm run dev
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-tests) SKIP_TESTS=true ;;
    --skip-launch) SKIP_LAUNCH=true ;;
    --install-vsix) INSTALL_VSIX=true ;;
    --example)
      shift
      EXAMPLE_FILE="${1:?Falta ruta tras --example}"
      [[ "$EXAMPLE_FILE" != /* ]] && EXAMPLE_FILE="${ROOT}/${EXAMPLE_FILE}"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Opción desconocida: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

log() { printf '\n▶ %s\n' "$1"; }

find_editor_cli() {
  if command -v cursor >/dev/null 2>&1; then
    echo "cursor"
  elif command -v code >/dev/null 2>&1; then
    echo "code"
  else
    return 1
  fi
}

log "Instalando dependencias (npm install)"
npm install

if [[ "$SKIP_TESTS" == false ]]; then
  log "Ejecutando pruebas (npm run test:all)"
  npm run test:all
else
  log "Compilando extensión (npm run compile)"
  npm run compile
fi

if [[ "$INSTALL_VSIX" == true ]]; then
  log "Empaquetando extensión con vsce"
  npx --yes @vscode/vsce package --no-dependencies
  VSIX_FILE="$(ls -t "${ROOT}"/miranda-*.vsix 2>/dev/null | head -1)"
  if [[ -z "$VSIX_FILE" ]]; then
    echo "No se encontró el archivo .vsix generado." >&2
    exit 1
  fi
  EDITOR_CLI="$(find_editor_cli)" || {
    echo "No se encontró 'code' ni 'cursor' en PATH para instalar el .vsix." >&2
    exit 1
  }
  log "Instalando extensión: ${VSIX_FILE}"
  "$EDITOR_CLI" --install-extension "$VSIX_FILE" --force
fi

if [[ "$SKIP_LAUNCH" == true ]]; then
  log "Listo. Lanzamiento omitido (--skip-launch)."
  exit 0
fi

EDITOR_CLI="$(find_editor_cli)" || {
  echo "No se encontró 'code' ni 'cursor' en PATH." >&2
  echo "Instala VS Code CLI: Command Palette → 'Shell Command: Install code command in PATH'" >&2
  exit 1
}

if [[ ! -f "$EXAMPLE_FILE" ]]; then
  echo "Archivo de ejemplo no encontrado: $EXAMPLE_FILE" >&2
  exit 1
fi

log "Abriendo ${EDITOR_CLI} en modo Extension Development Host"
log "Extensión: ${ROOT}"
log "Archivo: ${EXAMPLE_FILE}"

"$EDITOR_CLI" --extensionDevelopmentPath="$ROOT" "$EXAMPLE_FILE" >/dev/null 2>&1 &

log "Ventana de desarrollo iniciada."
log "Verifica syntax highlighting y diagnósticos del linter en el archivo abierto."
