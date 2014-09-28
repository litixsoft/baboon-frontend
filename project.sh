#!/bin/bash

if [ -z "$1" ]
  then
    echo "No argument supplied"
    echo "Usage: ./project.sh scriptname whitout .sh"
    echo "Example: ./project.sh install"
    echo "Available scripts:"
    ls -la ./scripts
fi

if [ "$1" ]
  then
    ./scripts/$1'.sh'
fi


