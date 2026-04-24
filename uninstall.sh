#!/bin/bash
#
# Nephs Workshop Uninstaller
# Removes everything the install script set up.
#
# Run with:
#   bash <(curl -fsSL https://raw.githubusercontent.com/jon-kloss/nephs/main/uninstall.sh)
#

# --- Colors ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

info()    { echo -e "  ${BLUE}==>${NC} ${BOLD}$1${NC}"; }
success() { echo -e "  ${GREEN} ✓ ${NC} $1"; }
warn()    { echo -e "  ${YELLOW} ! ${NC} $1"; }
skip()    { echo -e "  ${DIM} -  $1${NC}"; }

WORKSHOP_DIR="$HOME/workshop"

# --- Welcome ---
clear
echo ""
echo -e "  ${BOLD}Nephs Workshop Uninstaller${NC}"
echo -e "  ${DIM}==========================${NC}"
echo ""
echo "  This will remove:"
echo ""
echo "    - ~/workshop (your creations and project files)"
echo "    - Claude Code"
echo "    - Ghostty terminal + config"
echo "    - API key from ~/.zshrc"
echo ""
echo "  It will ask before removing shared tools"
echo "  (Node.js, Homebrew) since other apps may use them."
echo ""
echo -e "  ${RED}${BOLD}Your creations (games, stories, characters) will be deleted.${NC}"
echo ""

read -p "  Continue with uninstall? (y/N) " confirm < /dev/tty
echo ""

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "  Cancelled. Nothing was removed."
    echo ""
    exit 0
fi

# =========================================================
# Step 1: Remove API key from .zshrc
# =========================================================
info "Removing API key..."

if grep -q 'ANTHROPIC_API_KEY' ~/.zshrc 2>/dev/null; then
    sed -i '' '/# Nephs Workshop.*Claude Code API Key/d' ~/.zshrc 2>/dev/null || true
    sed -i '' '/ANTHROPIC_API_KEY/d' ~/.zshrc 2>/dev/null || true
    # Clean up any leftover blank lines at end of file
    sed -i '' -e :a -e '/^\n*$/{$d;N;ba' -e '}' ~/.zshrc 2>/dev/null || true
    unset ANTHROPIC_API_KEY 2>/dev/null || true
    success "API key removed from ~/.zshrc"
else
    skip "No API key found in ~/.zshrc"
fi

# =========================================================
# Step 2: Remove workshop directory
# =========================================================
info "Removing workshop..."

if [[ -d "$WORKSHOP_DIR" ]]; then
    rm -rf "$WORKSHOP_DIR"
    success "Removed ~/workshop"
else
    skip "~/workshop not found"
fi

# =========================================================
# Step 3: Remove Claude Code
# =========================================================
info "Removing Claude Code..."

if command -v claude &>/dev/null; then
    npm uninstall -g @anthropic-ai/claude-code 2>/dev/null || true
    success "Claude Code removed"
else
    skip "Claude Code not installed"
fi

# Also clean up Claude Code config/cache
if [[ -d "$HOME/.claude" ]]; then
    rm -rf "$HOME/.claude"
    success "Removed Claude Code config (~/.claude)"
fi

if [[ -d "$HOME/.config/claude" ]]; then
    rm -rf "$HOME/.config/claude"
    success "Removed Claude Code data (~/.config/claude)"
fi

# =========================================================
# Step 4: Remove Ghostty
# =========================================================
info "Removing Ghostty..."

if [[ -d "/Applications/Ghostty.app" ]]; then
    brew uninstall --cask ghostty 2>/dev/null || true
    success "Ghostty app removed"
else
    skip "Ghostty not installed"
fi

if [[ -d "$HOME/.config/ghostty" ]]; then
    rm -rf "$HOME/.config/ghostty"
    success "Removed Ghostty config"
fi

# =========================================================
# Step 5: Remove Node.js (ask first)
# =========================================================
echo ""
info "Node.js is installed."
echo ""
echo "    Other apps on this Mac might use Node.js."
echo "    Only remove it if you installed it just for the workshop."
echo ""

read -p "    Remove Node.js? (y/N) " remove_node < /dev/tty
echo ""

if [[ "$remove_node" =~ ^[Yy]$ ]]; then
    if command -v brew &>/dev/null; then
        brew uninstall node 2>/dev/null || true
        success "Node.js removed"
    else
        warn "Can't remove Node.js without Homebrew — remove it manually"
    fi
else
    skip "Keeping Node.js"
fi

# =========================================================
# Step 6: Remove Homebrew (ask first)
# =========================================================
if command -v brew &>/dev/null; then
    echo ""
    info "Homebrew is installed."
    echo ""
    echo "    Homebrew is a general-purpose tool. Removing it also"
    echo "    removes every package installed through it."
    echo "    Only remove if you installed it just for the workshop."
    echo ""

    read -p "    Remove Homebrew? (y/N) " remove_brew < /dev/tty
    echo ""

    if [[ "$remove_brew" =~ ^[Yy]$ ]]; then
        NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"

        # Clean up shellenv from .zprofile
        if [[ -f ~/.zprofile ]]; then
            sed -i '' '/# Homebrew/d' ~/.zprofile 2>/dev/null || true
            sed -i '' '/brew shellenv/d' ~/.zprofile 2>/dev/null || true
        fi

        success "Homebrew removed"
    else
        skip "Keeping Homebrew"
    fi
fi

# =========================================================
# Done
# =========================================================
echo ""
echo -e "  ${GREEN}${BOLD}Uninstall complete.${NC}"
echo ""
echo "  What was removed:"
echo "    - Workshop files and creations"
echo "    - Claude Code + config"
echo "    - Ghostty + config"
echo "    - API key"
if [[ "$remove_node" =~ ^[Yy]$ ]]; then
    echo "    - Node.js"
fi
if [[ "${remove_brew:-}" =~ ^[Yy]$ ]]; then
    echo "    - Homebrew"
fi
echo ""
echo -e "  ${DIM}Xcode Command Line Tools were left in place.${NC}"
echo -e "  ${DIM}To remove: sudo rm -rf /Library/Developer/CommandLineTools${NC}"
echo ""
