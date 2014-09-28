#!/bin/bash
# Script Path
SCRIPT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Go to root path of application
cd $SCRIPT && cd ..

echo "=================================================="
echo "==== Update node_modules and bower_components ===="
echo "=================================================="
echo ""
echo "=== Update node_modules"
npm update
echo "=== finished"
echo ""
echo "=== Update bower_components"
bower update
echo "=== finished"
echo ""
