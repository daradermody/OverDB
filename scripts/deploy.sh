#!/usr/bin/env sh
set -e

sudo systemctl stop overdb.service
sudo cp build/overdb /usr/local/bin/overdb
rm -f /var/lib/overdb/moviedb_cache.json
sudo systemctl restart overdb.service
