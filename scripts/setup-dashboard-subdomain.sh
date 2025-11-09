#!/bin/bash
# Script to add dashboard.localhost to /etc/hosts for local subdomain testing

# Check if running on macOS/Linux
if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Backup original hosts file
    sudo cp /etc/hosts /etc/hosts.backup.$(date +%Y%m%d_%H%M%S)
    
    # Check if dashboard.localhost already exists
    if ! grep -q "dashboard.localhost" /etc/hosts; then
        # Add dashboard.localhost to hosts file
        echo "127.0.0.1 dashboard.localhost" | sudo tee -a /etc/hosts > /dev/null
        echo "✓ Added dashboard.localhost to /etc/hosts"
        echo ""
        echo "You can now access the dashboard at: http://dashboard.localhost:3000"
    else
        echo "✓ dashboard.localhost already exists in /etc/hosts"
    fi
else
    echo "This script supports macOS and Linux only."
    echo ""
    echo "For Windows, add the following line to C:\\Windows\\System32\\drivers\\etc\\hosts:"
    echo "127.0.0.1 dashboard.localhost"
fi
