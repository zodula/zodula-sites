#!/bin/bash

# Git CLI Check and Installation Script for Ubuntu
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

# Function to check if running on Ubuntu
check_ubuntu() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        if [[ "$ID" == "ubuntu" ]]; then
            return 0
        fi
    fi
    return 1
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

# Function to install git on Ubuntu
install_git_ubuntu() {
    print_status "Installing git on Ubuntu..."
    
    # Update package list
    print_status "Updating package list..."
    sudo apt update
    
    # Install git
    print_status "Installing git..."
    sudo apt install -y git
    
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
    
    # Check if running on Ubuntu
    if ! check_ubuntu; then
        print_warning "This script is designed for Ubuntu. Current OS may not be supported."
        print_status "Attempting to check for git anyway..."
    fi
    
    # Check if git is already installed
    if check_git; then
        print_success "Git is already available. No installation needed."
        exit 0
    fi
    
    # Install git if not present
    if check_ubuntu; then
        if install_git_ubuntu; then
            print_success "Git installation completed successfully!"
        else
            print_error "Git installation failed!"
            exit 1
        fi
    else
        print_error "Cannot install git automatically on this OS. Please install git manually."
        print_status "Visit: https://git-scm.com/downloads"
        exit 1
    fi
}

# Run main function
main "$@"
