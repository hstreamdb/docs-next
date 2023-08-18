#!/bin/bash
set -e

docker-compose -f assets/quick-start.yaml up -d

export timeout=40
until ( \
    docker-compose -f assets/quick-start.yaml run --no-deps --rm hserver \
        bash -c 'set -e; \
        hstream --host hserver --port 6570 node check-running -n 1 && \
        hadmin server --host hserver --port 6570 status'
); do
  >&2 echo "Waiting for cluster..."
  sleep 10
  timeout=$((timeout - 10))
  if [ $timeout -le 0 ]; then
    echo "Timeout!"
    docker-compose -f assets/quick-start.yaml logs
    exit 1
  fi
done
