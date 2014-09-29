#!/bin/sh
# Script Path
SCRIPT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Go to root path of application
cd $SCRIPT && cd ..

# Set environment
export DEBUG=baboon
export NODE_ENV=development
export HOST=127.0.0.1
export PORT=9000

# Start application
node ./server/bin/www.js
