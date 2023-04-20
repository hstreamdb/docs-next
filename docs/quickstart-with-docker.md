# Quickstart with Docker-Compose

## Requirement

For optimal performance, we suggest utilizing a Linux kernel version of 4.14 or
higher when initializing an HStreamDB Cluster.

::: tip
In the case it is not possible for the user to use a Linux kernel version of
4.14 or above, we recommend adding the option `--enable-dscp-reflection=false`
to HStore while starting the HStreamDB Cluster.
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
[download][quick-start.yaml] or paste the following contents:

```yaml
# quick-start.yaml

version: "3.5"

services:
  hserver:
    image: hstreamdb/hstream:latest
    depends_on:
      - zookeeper
      - hstore
    ports:
      - "127.0.0.1:6570:6570"
    expose:
      - 6570
    networks:
      - hstream-quickstart
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp:/tmp
      - data_store:/data/store
    command:
      - bash
      - "-c"
      - |
        set -e
        /usr/local/script/wait-for-storage.sh hstore 6440 zookeeper 2181 600 \
        /usr/local/bin/hstream-server \
        --bind-address 0.0.0.0 --port 6570 \
        --internal-port 6571 \
        --server-id 100 \
        --seed-nodes "$$(hostname -I | awk '{print $$1}'):6571" \
        --advertised-address $$(hostname -I | awk '{print $$1}') \
        --metastore-uri zk://zookeeper:2181 \
        --store-config /data/store/logdevice.conf \
        --store-admin-host hstore --store-admin-port 6440 \
        --store-log-level warning \
        --io-tasks-path /tmp/io/tasks \
        --io-tasks-network hstream-quickstart

  hstore:
    image: hstreamdb/hstream:latest
    networks:
      - hstream-quickstart
    volumes:
      - data_store:/data/store
    command:
      - bash
      - "-c"
      - |
        set -ex
        # N.B. "enable-dscp-reflection=false" is required for linux kernel which
        # doesn't support dscp reflection, e.g. centos7.
        /usr/local/bin/ld-dev-cluster --root /data/store \
        --use-tcp --tcp-host $$(hostname -I | awk '{print $$1}') \
        --user-admin-port 6440 \
        --param enable-dscp-reflection=false \
        --no-interactive \

  zookeeper:
    image: zookeeper
    expose:
      - 2181
    networks:
      - hstream-quickstart
    volumes:
      - data_zk_data:/data
      - data_zk_datalog:/datalog

networks:
  hstream-quickstart:
    name: hstream-quickstart

volumes:
  data_store:
    name: quickstart_data_store
  data_zk_data:
    name: quickstart_data_zk_data
  data_zk_datalog:
    name: quickstart_data_zk_datalog

```

then run:

```sh
docker-compose -f quick-start.yaml up
```

If you see some thing like this, then you have a running hstream:

```
hserver_1    | [INFO][2021-11-22T09:15:18+0000][app/server.hs:137:3][thread#67]************************
hserver_1    | [INFO][2021-11-22T09:15:18+0000][app/server.hs:145:3][thread#67]Server started on port 6570
hserver_1    | [INFO][2021-11-22T09:15:18+0000][app/server.hs:146:3][thread#67]*************************
```

::: tip
You can also run in background.
:::

```sh
docker-compose -f quick-start.yaml up -d
```

And if you want to show logs of server, run:

```sh
docker-compose -f quick-start.yaml logs -f hserver
```

## Start HStreamDB's interactive SQL CLI

```sh
docker run -it --rm --name some-hstream-cli --network host hstreamdb/hstream:latest hstream --port 6570 sql
```

If everything works fine, you will enter an interactive CLI and see help
information like

```
      __  _________________  _________    __  ___
     / / / / ___/_  __/ __ \/ ____/   |  /  |/  /
    / /_/ /\__ \ / / / /_/ / __/ / /| | / /|_/ /
   / __  /___/ // / / _, _/ /___/ ___ |/ /  / /
  /_/ /_//____//_/ /_/ |_/_____/_/  |_/_/  /_/

Command
  :h                           To show these help info
  :q                           To exit command line interface
  :help [sql_operation]        To show full usage of sql statement

SQL STATEMENTS:
  To create a simplest stream:
    CREATE STREAM stream_name;

  To create a query select all fields from a stream:
    SELECT * FROM stream_name EMIT CHANGES;

  To insert values to a stream:
    INSERT INTO stream_name (field1, field2) VALUES (1, 2);

>
```

## Create a stream

What we are going to do first is create a stream by `CREATE STREAM` statement.

```sql
CREATE STREAM demo;
```

## Run a continuous query over the stream

Now we can run a continuous query over the stream we just created by `SELECT`
query.

The query will output all records from the `demo` stream whose humidity is above
70 percent.

```sql
SELECT * FROM demo WHERE humidity > 70 EMIT CHANGES;
```

It seems that nothing happened. But do not worry because there is no data in the
stream now. Next, we will fill the stream with some data so the query can
produce output we want.

## Start another CLI session

Start another CLI session, this CLI will be used for inserting data into the
stream.

```sh
docker exec -it some-hstream-cli hstream --port 6570 sql
```

## Insert data into the stream

Run each of the given `INSERT` statement in the new CLI session and keep an eye
on the CLI session created in (2).

```sql
INSERT INTO demo (temperature, humidity) VALUES (22, 80);
INSERT INTO demo (temperature, humidity) VALUES (15, 20);
INSERT INTO demo (temperature, humidity) VALUES (31, 76);
INSERT INTO demo (temperature, humidity) VALUES ( 5, 45);
INSERT INTO demo (temperature, humidity) VALUES (27, 82);
INSERT INTO demo (temperature, humidity) VALUES (28, 86);
```

If everything works fine, the continuous query will output matching records in
real time:

```json
{"temperature":22,"humidity":80}
{"temperature":31,"humidity":76}
{"temperature":27,"humidity":82}
{"temperature":28,"humidity":86}
```

[non-root-docker]:
  https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user
[quick-start.yaml]:
  https://raw.githubusercontent.com/hstreamdb/docs/main/assets/quick-start.yaml
