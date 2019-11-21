#!/bin/bash

set -eox pipefail

# Install latest LHCI
npm install -g @lhci/cli@0.3.x

# Run healthcheck, collect, and upload
lhci autorun --config=./tools/lhci/.lighthouserc
