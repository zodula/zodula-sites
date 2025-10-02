#!/bin/bash

# Git CLI Check and Installation Script for Ubuntu and RHEL-based systems
# This script checks if git is installed and installs it if not present

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to detect OS and package manager
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        case "$ID" in
            "ubuntu"|"debian")
                echo "apt"
                return 0
                ;;
            "rhel"|"centos"|"fedora"|"rocky"|"almalinux"|"oracle")
                echo "yum"
                return 0
                ;;
            "fedora")
                # Fedora 22+ uses dnf, older versions use yum
                if command -v dnf &> /dev/null; then
                    echo "dnf"
                else
                    echo "yum"
                fi
                return 0
                ;;
            "opensuse"|"sles")
                echo "zypper"
                return 0
                ;;
            "arch")
                echo "pacman"
                return 0
                ;;
            *)
                echo "unknown"
                return 1
                ;;
        esac
    else
        echo "unknown"
        return 1
    fi
}

# Function to check if git is installed
check_git() {
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        print_success "Git is already installed: $GIT_VERSION"
        return 0
    else
        print_warning "Git is not installed"
        return 1
    fi
}

# Function to install git based on package manager
install_git() {
    local package_manager=$1
    
    case "$package_manager" in
        "apt")
            print_status "Installing git using apt (Ubuntu/Debian)..."
            print_status "Updating package list..."
            sudo apt update
            print_status "Installing git..."
            sudo apt install -y git
            ;;
        "yum")
            print_status "Installing git using yum (RHEL/CentOS)..."
            print_status "Installing git..."
            sudo yum install -y git
            ;;
        "dnf")
            print_status "Installing git using dnf (Fedora)..."
            print_status "Installing git..."
            sudo dnf install -y git
            ;;
        "zypper")
            print_status "Installing git using zypper (openSUSE/SLES)..."
            print_status "Installing git..."
            sudo zypper install -y git
            ;;
        "pacman")
            print_status "Installing git using pacman (Arch Linux)..."
            print_status "Installing git..."
            sudo pacman -S --noconfirm git
            ;;
        *)
            print_error "Unsupported package manager: $package_manager"
            return 1
            ;;
    esac
    
    # Verify installation
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        print_success "Git successfully installed: $GIT_VERSION"
        return 0
    else
        print_error "Failed to install git"
        return 1
    fi
}

# Main execution
main() {
    print_status "Starting git CLI check and installation script..."
    
    # Detect OS and package manager
    PACKAGE_MANAGER=$(detect_os)
    
    if [ "$PACKAGE_MANAGER" = "unknown" ]; then
        print_warning "Unsupported operating system detected."
        print_status "Attempting to check for git anyway..."
    else
        print_status "Detected package manager: $PACKAGE_MANAGER"
    fi
    
    # Check if git is already installed
    if check_git; then
        print_success "Git is already available. No installation needed."
        exit 0
    fi
    
    # Install git if not present
    if [ "$PACKAGE_MANAGER" != "unknown" ]; then
        if install_git "$PACKAGE_MANAGER"; then
            print_success "Git installation completed successfully!"
        else
            print_error "Git installation failed!"
            exit 1
        fi
    else
        print_error "Cannot install git automatically on this OS. Please install git manually."
        print_status "Visit: https://git-scm.com/downloads"
        print_status "Supported systems: Ubuntu, Debian, RHEL, CentOS, Fedora, Rocky Linux, AlmaLinux, Oracle Linux, openSUSE, SLES, Arch Linux"
        exit 1
    fi
}

# Run main function
main "$@"
