# Get Started with Kafka API

## Requirement

For optimal performance, we suggest utilizing a Linux kernel version of 4.14 or
higher when initializing an HStream Kafka Cluster.

::: tip
In the case it is not possible for the user to use a Linux kernel version of
4.14 or above, we recommend adding the option `--enable-dscp-reflection=false`
to HStore while starting the HStream Kafka Cluster.
:::

## Installation

### Install docker

::: tip
If you have already installed docker, you can skip this step.
:::

See [Install Docker Engine](https://docs.docker.com/engine/install/), and
install it for your operating system. Please carefully check that you have met
all prerequisites.

Confirm that the Docker daemon is running:

```sh
docker version
```

::: tip
On Linux, Docker needs root privileges. You can also run Docker as a
non-root user, see [Post-installation steps for Linux][non-root-docker].
:::

### Install docker compose

::: tip
If you have already installed docker compose, you can skip this step.
:::

See [Install Docker Compose](https://docs.docker.com/compose/install/), and
install it for your operating system. Please carefully check that you met all
prerequisites.

```sh
docker-compose version
```

## Start HStreamDB Services

::: warning
Do NOT use this configuration in your production environment!
:::

Create a docker-compose.yaml file for docker compose, you can
[download][kafka-quick-start.yaml] or paste the following contents:

<<< @/../assets/kafka-quick-start.yaml.template{yaml-vue}

then run:

```sh
docker-compose -f kafka-quick-start.yaml up
```

If you see some thing like this, then you have a running hstream kafka cluster:

```txt
hserver_1    |[INFO][2024-01-12T02:15:08+0000][app/lib/KafkaServer.hs:193:11][thread#30]Cluster is ready!
```

::: tip
You can also run in background:
```sh
docker-compose -f kafka-quick-start.yaml up -d
```
:::

::: tip
If you want to show logs of server, run:
```sh
docker-compose -f kafka-quick-start.yaml logs -f hserver
```
:::

## Connect HStream Kafka with CLI

You can use `hstream-kafka` command-line interface (CLI), which is included in the `hstreamdb/hstream` image, to interactive with hstream kafka cluster

Start an instance of `hstreamdb/hstream` using Docker:

```sh-vue
docker run -it --rm --name kafka-cli --network host hstreamdb/hstream:{{ $version() }} bash
```

## Create a topic

To create a topic, you can use `hstream-kafka topic create` command. Now we will create a topic with 3 partitions

```sh
hstream-kafka topic create demo --partitions 3
```

```sh
+------+------------+--------------------+
| Name | Partitions | Replication-factor |
+------+------------+--------------------+
| demo | 3          | 1                  |
+------+------------+--------------------+
```

## Produce data to a topic

The `hstream-kafka produce` command can be used to produce data to a topic in a interactive shell.
```sh
hstream-kafka produce demo --separator "@" -i
```
- With the `--separator` option, you can specify the separator for key. The default separator is "@". Using the separator, you can assign a key to each record. Record with same key will be append into same partition of the topic.
- Using `-i` option to enter the interactive mode.

```sh
info@This is a info level log.
warn@This is a warn level log.
hello hstream!
```
Here we have written three pieces of data. The first two are associated with specified key. The last one does not specify a key.

For additional information, you can use `hstream-kafka produce -h`.

## Consume data from a topic

To consume data from a particular topic, the `hstream-kafka consume` command is used.

```sh
hstream-kafka consume --group-id test-group --topic demo --earliest --verbose --eof
```
- Using the `--verbose` option will print the creation timestamp and the key of the record. The `--eof` option will tell the consumer to exit after receiving the last message in the partition.

```sh
CreateTimestamp: 1705026820718   Key: info                 This is a info level log.
CreateTimestamp: 1705026912306   Key:                      hello hstream!
CreateTimestamp: 1705026833287   Key: warn                 This is a warn level log.
EOF reached for all 3 partition(s)
Consumed 3 messages (62 bytes)
```

For additional information, you can use `hstream-kafka consume -h`.

[non-root-docker]: https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user
[kafka-quick-start.yaml]: https://raw.githubusercontent.com/hstreamdb/docs-next/main/assets/kafka-quick-start.yaml
