#!/bin/bash

set -eox pipefail

# Install latest LHCI
npm install -g @lhci/cli@0.3.x

lhci autorun --config=./tools/lhci/.lighthouserc
