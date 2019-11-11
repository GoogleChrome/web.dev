#!/bin/bash

set -eox pipefail

export LHCI_TOKEN=d96145f6-c3d2-4b22-9e53-6913cdd2df03
export LHCI_RC_FILE=./tools/lhci/.lighthouserc

# Install latest LHCI
npm install -g @lhci/cli@next

lhci healthcheck --fatal

# Start up a local webserver and wait for it to get going
npm start &
sleep 2

lhci collect
lhci upload

# Kill the webserver process
kill $!
