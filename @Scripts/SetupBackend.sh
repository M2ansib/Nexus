#!/bin/bash

# General variables:
dqt='"' # Double-quote character, for echo-ing.

# Change working directory to that of the script:
cd "$(dirname "${BASH_SOURCE[0]}")"

# Back out into the root directory of the project:
cd ..

mkdir -p .venv
virtualenv -p python3 .venv/LEAP
. .venv/LEAP/bin/activate
pip install -r requirements.txt