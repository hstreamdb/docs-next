#!/bin/bash
set -e

timeout=120
container_name=wait_hserver

docker run -td --rm --name $container_name --network host hstreamdb/hstream bash
until (docker exec -t $container_name hstream-kafka-cli --port 9092 node status); do
    >&2 echo "Waiting for 127.0.0.1:9092 ..."
    sleep 1
    timeout=$((timeout - 1))
    [ $timeout -le 0 ] && echo "Timeout!" && docker kill $container_name && exit 1;
done
docker kill $container_name
