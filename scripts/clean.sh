#!/bin/bash
# Script Path
SCRIPT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Go to root path of application
cd $SCRIPT && cd ..
clear
echo "==============================================="
echo "=== Clean node_modules and bower_components"
echo "==============================================="
echo ""
echo "=== Clean cache npm"
npm cache clean
echo "=== finished"
echo ""
echo "=== Clean cache bower"
bower cache clean
echo "=== finished"
echo ""
