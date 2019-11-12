#!/bin/bash

set -eox pipefail

# Install latest LHCI
npm install -g @lhci/cli@0.3.x

lhci autorun --config=./tools/lhci/.lighthouserc --upload.token=d96145f6-c3d2-4b22-9e53-6913cdd2df03
