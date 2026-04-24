#!/bin/bash
#
# Nephs Workshop Installer
# One script to set up everything a kid needs to build with AI.
#
# Run with:
#   bash <(curl -fsSL https://raw.githubusercontent.com/jon-kloss/nephs/main/install.sh)
#

set -e

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
fail()    { echo -e "  ${RED} ✗ ${NC} $1"; exit 1; }

WORKSHOP_DIR="$HOME/workshop"

# --- Welcome ---
clear
echo ""
echo -e "  ${BOLD}Welcome to the Nephs Workshop Installer${NC}"
echo -e "  ${DIM}========================================${NC}"
echo ""
echo "  This will install everything you need to build"
echo "  games, stories, and characters with AI."
echo ""
echo "  What gets installed:"
echo "    - Xcode Command Line Tools (developer tools + git)"
echo "    - Homebrew (package manager)"
echo "    - Node.js (runtime for Claude Code)"
echo "    - Claude Code (AI assistant)"
echo "    - Ghostty (a fast, pretty terminal)"
echo "    - Your workshop project files"
echo ""
echo -e "  ${YELLOW}You may need to enter your Mac password during setup.${NC}"
echo -e "  ${YELLOW}That's totally normal — it won't show as you type.${NC}"
echo ""
read -p "  Ready? Press Enter to start... " < /dev/tty
echo ""

# =========================================================
# Step 1: Xcode Command Line Tools (includes git)
# =========================================================
info "Checking developer tools..."

if xcode-select -p &>/dev/null; then
    success "Developer tools already installed"
else
    info "Installing developer tools..."
    echo ""
    echo "    A popup will appear — click 'Install' and wait."
    echo "    This can take 5-10 minutes."
    echo ""

    xcode-select --install 2>/dev/null || true

    read -p "    Press Enter when the install finishes... " < /dev/tty
    echo ""

    if ! xcode-select -p &>/dev/null; then
        fail "Developer tools didn't install. Try running this script again."
    fi

    success "Developer tools installed"
fi

# =========================================================
# Step 2: Homebrew
# =========================================================
info "Checking Homebrew..."

if command -v brew &>/dev/null; then
    success "Homebrew already installed"
else
    info "Installing Homebrew..."
    echo ""

    # NONINTERACTIVE skips the "press Enter" confirmation.
    # Sudo password prompt still works since it reads from /dev/tty.
    NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Apple Silicon Macs install to /opt/homebrew — add to PATH
    if [[ -f /opt/homebrew/bin/brew ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"

        # Persist for future terminal sessions
        if ! grep -q 'brew shellenv' ~/.zprofile 2>/dev/null; then
            echo >> ~/.zprofile
            echo '# Homebrew' >> ~/.zprofile
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        fi
    fi

    if ! command -v brew &>/dev/null; then
        fail "Homebrew didn't install correctly. Try running this script again."
    fi

    success "Homebrew installed"
fi

# =========================================================
# Step 3: Node.js
# =========================================================
info "Checking Node.js..."

if command -v node &>/dev/null; then
    success "Node.js already installed ($(node --version))"
else
    info "Installing Node.js..."
    brew install node

    if ! command -v node &>/dev/null; then
        fail "Node.js didn't install correctly."
    fi

    success "Node.js installed ($(node --version))"
fi

# =========================================================
# Step 4: Claude Code
# =========================================================
info "Checking Claude Code..."

if command -v claude &>/dev/null; then
    success "Claude Code already installed"
else
    info "Installing Claude Code..."
    npm install -g @anthropic-ai/claude-code 2>&1

    if ! command -v claude &>/dev/null; then
        fail "Claude Code didn't install correctly."
    fi

    success "Claude Code installed"
fi

# =========================================================
# Step 5: Ghostty
# =========================================================
info "Checking Ghostty terminal..."

if [[ -d "/Applications/Ghostty.app" ]]; then
    success "Ghostty already installed"
else
    info "Installing Ghostty..."
    brew install --cask ghostty

    success "Ghostty installed"
fi

# Set up a kid-friendly Ghostty config (larger font)
GHOSTTY_CONFIG_DIR="$HOME/.config/ghostty"
mkdir -p "$GHOSTTY_CONFIG_DIR"

if [[ ! -f "$GHOSTTY_CONFIG_DIR/config" ]]; then
    cat > "$GHOSTTY_CONFIG_DIR/config" << 'GHOSTTYCONF'
# Nephs Workshop — kid-friendly defaults
font-size = 15
window-padding-x = 8
window-padding-y = 8
copy-on-select = clipboard
GHOSTTYCONF
    success "Ghostty configured (font size 15)"
else
    success "Ghostty config already exists — keeping yours"
fi

# =========================================================
# Step 6: Clone the workshop
# =========================================================
info "Setting up your workshop..."

if [[ -d "$WORKSHOP_DIR/.git" ]]; then
    # Already cloned — pull latest
    git -C "$WORKSHOP_DIR" pull --ff-only 2>/dev/null || true
    success "Workshop updated at ~/workshop"
elif [[ -d "$WORKSHOP_DIR" ]]; then
    warn "~/workshop exists but isn't the workshop repo — skipping clone"
    warn "Delete it and re-run this script if that's wrong"
else
    git clone https://github.com/jon-kloss/nephs.git "$WORKSHOP_DIR"
    success "Workshop cloned to ~/workshop"
fi

# =========================================================
# Step 7: API Key
# =========================================================
echo ""
info "Almost done — just need your API key!"
echo ""
echo "    Paste the API key (starts with sk-ant-)"
echo "    Ask your uncle if you don't have it yet."
echo ""
echo -e "    ${DIM}Tip: Cmd+V to paste, then press Enter${NC}"
echo ""

read -p "    API Key: " api_key < /dev/tty

if [[ -z "$api_key" ]]; then
    echo ""
    warn "No key entered — skipping for now."
    warn "You can set it later by running:"
    echo ""
    echo '    echo '\''export ANTHROPIC_API_KEY="your-key-here"'\'' >> ~/.zshrc'
    echo ""
else
    # Make sure .zshrc exists
    touch ~/.zshrc

    # Remove any old key line so we don't duplicate
    sed -i '' '/ANTHROPIC_API_KEY/d' ~/.zshrc 2>/dev/null || true

    # Append the new key
    echo "" >> ~/.zshrc
    echo "# Nephs Workshop — Claude Code API Key" >> ~/.zshrc
    echo "export ANTHROPIC_API_KEY=\"$api_key\"" >> ~/.zshrc

    # Export for current session too
    export ANTHROPIC_API_KEY="$api_key"

    success "API key saved"
fi

# =========================================================
# Done!
# =========================================================
echo ""
echo -e "  ${GREEN}${BOLD}All done! You're ready to build!${NC}"
echo ""
echo "  ┌─────────────────────────────────────────┐"
echo "  │  Getting started:                        │"
echo "  │                                          │"
echo -e "  │  1. Open ${BOLD}Ghostty${NC} from Applications       │"
echo -e "  │  2. Type: ${BOLD}cd ~/workshop${NC}                  │"
echo -e "  │  3. Type: ${BOLD}claude${NC}                         │"
echo -e "  │  4. Type: ${BOLD}/intro${NC}                         │"
echo -e "  │  5. Then try ${BOLD}/game${NC} to build a game!      │"
echo "  │                                          │"
echo "  └─────────────────────────────────────────┘"
echo ""
