#!/bin/bash
# Script Path
SCRIPT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Go to root path of application
cd $SCRIPT && cd ..

echo "================================================="
echo "==== Reset node_modules and bower_components ===="
echo "================================================="
echo ""
echo "=== Delete node_modules"
rm -r ./node_modules
echo "=== finished"
echo ""
echo "=== Delete bower_components"
rm -r ./app/bower_components
echo "=== finished"
echo ""
echo "=== Clean cache npm"
npm cache clean
echo "=== finished"
echo ""
echo "=== Clean cache bower"
bower cache clean
echo "=== finished"
echo ""
echo "=== Install node_modules"
npm install
echo "=== finished"
echo ""
echo "=== Install bower_components"
bower install
echo "=== finished"
echo ""
