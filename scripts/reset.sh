#!/bin/bash
# Script Path
SCRIPT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Go to root path of application
cd $SCRIPT && cd ..

echo "==========================================="
echo "==== Reset node_modules and components ===="
echo "==========================================="
echo ""
echo "=== Delete node_modules"
rm package-lock.json
rm -r ./node_modules
echo "=== finished"
echo ""
echo "=== Delete components"
rm -r ./app/components
echo "=== finished"
echo ""
echo "=== Clean cache npm"
npm cache clean --force
echo "=== finished"
echo ""
echo "=== Install node_modules"
npm install
echo "=== finished"
echo ""
