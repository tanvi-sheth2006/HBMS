#!/usr/bin/env bash
set -e
echo "Installing server dependencies..."
cd hospital-server
npm install
echo "Installing client dependencies..."
cd ../hospital-client
npm install
echo "Done. To run backend: cd hospital-server && npm run dev"
echo "To run frontend: cd hospital-client && npm run dev"
