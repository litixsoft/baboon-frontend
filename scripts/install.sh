#!/bin/bash
# Script Path
SCRIPT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Go to root path of application
cd $SCRIPT && cd ..
clear
echo "================================================="
echo "=== Install node_modules and bower_components ==="
echo "================================================="
echo ""
echo "=== Install node_modules"
npm install
echo "=== finished"
echo ""
echo "=== Install bower_components"
bower install
echo "=== finished"
echo ""
