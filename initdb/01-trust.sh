#!/bin/bash
# This runs after postgres init, before accepting connections
echo "host all all all trust" >> /var/lib/postgresql/data/pg_hba.conf
