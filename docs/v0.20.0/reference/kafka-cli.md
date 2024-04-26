# HStream Kafka CLI

To start an interactive shell with the HStream Kafka CLI, which is included in the `hstreamdb/hstream` image, you can use the following command:

```sh-vue
docker run -it --rm --name cli-demo --network host hstreamdb/hstream:{{ $version() }} bash
```

```shell
hstream-kafka --help
```

```shell
Usage: hstream-kafka [--host HOST] [--port PORT] COMMAND

Available options:
  --host HOST              Server host
  --port PORT              Server port
  -h,--help                Show this help text

Available commands:
  topic                    topic command
  group                    group command
  node                     node command
  produce                  Produce messages to topics
  consume                  Consume messages from topics

Alias:
  p                        Alias for the command 'produce'
  c                        Alias for the command 'consume'
```

## Connection

### Connection parameters

| Option | Description |
|-|-|
| `--host` | The server host to connect to. This can be the address of any node in the cluster.  Default: `127.0.0.1` |
| `--port` | The server port to connect to. Default: `9092` |

## Check Cluster Status

```shell
hstream-kafka node --help
```
```shell
Usage: hstream-kafka node COMMAND
  node command

Available options:
  -h,--help                Show this help text

Available commands:
  list                     List all alive brokers.
  init                     Init cluster.
  status                   Cluster status.
```

`list` subcommand is used to list all nodes in the cluster

```shell
hstream-kafka node list
```
```shell
+----+---------------------+------------+
| ID |       Address       | Controller |
+----+---------------------+------------+
| 1  | 172.20.236.177:9092 | True       |
| 2  | 172.20.236.174:9092 | False      |
| 3  | 172.20.236.175:9092 | False      |
+----+---------------------+------------+
```

`status`  subcommand is used to retrieve the status of each node in the cluster.

```shell
hstream-kafka node status
```
```shell
+---------+---------+---------------------+
| Node ID |  State  |       Address       |
+---------+---------+---------------------+
| 1       | Running | 172.20.236.177:9092 |
| 2       | Running | 172.20.236.174:9092 |
| 3       | Running | 172.20.236.175:9092 |
+---------+---------+---------------------+
```

## Manage Topics

We can also manage kafka topics through the command line tool.

```shell
hstream-kafka topic --help
```
```shell
Usage: hstream-kafka topic COMMAND
  topic command

Available options:
  -h,--help                Show this help text

Available commands:
  list                     Get all topics
  describe                 List details of given topic
  create                   Create a topic
  delete                   Delete a topic
```

### Create a topic

```sh
Usage: hstream-kafka topic create TopicName [-p|--num-partitions Int32]
                                      [-r|--replication-factor Int16]
                                      [-t|--timeout Int32]
  Create a topic

Available options:
  TopicName                Topic name
  -p,--num-partitions      Int32
                           Number of partitions (default: 1)
  -r,--replication-factor  Int16
                           Topic replication factor (default: 1)
  -t,--timeout Int32       Request timeout in milliseconds (default: 5000)
  -h,--help                Show this help text
```

Example: Create a demo topic with 3 partitions

```shell
hstream-kafka topic create test-topic -p 3
```
```shell
hstream-kafka topic create test-topic -p 3
+------------+------------+--------------------+
|    Name    | Partitions | Replication-factor |
+------------+------------+--------------------+
| test-topic | 3          | 1                  |
+------------+------------+--------------------+
```

### List topics

```shell
hstream-kafka topic list
```
```shell
+-------------------------+------------+
|          Name           | IsInternal |
+-------------------------+------------+
| test-topic              | False      |
+-------------------------+------------+
```

### Describe a topic

```shell
hstream-kafka topic describe test-topic
```

```shell
+------------+------------+-----------+----------+
|    Name    | IsInternal | Partition | LeaderId |
+------------+------------+-----------+----------+
| test-topic | False      | 0         | 3        |
| test-topic | False      | 1         | 2        |
| test-topic | False      | 2         | 2        |
+------------+------------+-----------+----------+
```

### Delete a topic

```shell
Usage: hstream-kafka topic delete (TopicName | --all) [-y|--yes]
  Delete a topic

Available options:
  TopicName                Topic name
  --all                    All topics
  -y,--yes                 Delete without prompt
  -h,--help                Show this help text
```
Example: Delete a topic

```shell
hstream-kafka topic delete test-topic
```

```shell
Are you sure you want to delete topics ["test-topic"] [y/N]? y
DONE
```
## Manage Consumer Group

We can also manage consumer group through the command line tool.

```shell
hstream-kafka group --help
```
```shell
Usage: hstream-kafka group COMMAND
  group command

Available options:
  -h,--help                Show this help text

Available commands:
  list                     Get all consumer groups
  show                     Show topic info
```

### List consumer groups

```shell
hstream-kafka group list
```
```shell
+-------------+-----------+--------------+
|     ID      |   Host    | ProtocolType |
+-------------+-----------+--------------+
| test-group  | 127.0.0.1 | consumer     |
| test-group1 | 127.0.0.1 | consumer     |
| sub-000-w6  | 127.0.0.1 | consumer     |
+-------------+-----------+--------------+
```

### Show topic info of specific group

```sh
hstream-kafka group show sub-000-w6
```
```shell
◎ sub-000-w6
  GroupState: Stable
  ProtocolType: consumer
  ProtocolData: range
  Members:
    ◎ consumer-sub-000-w6-4-550965a0-37c7-4359-a416-477b01ace20d
      ClientId: consumer-sub-000-w6-4
      ClientHost: 172.20.236.178
    ◎ consumer-sub-000-w6-31-6c65e861-e84c-44ed-b3ed-962e13ac983b
      ClientId: consumer-sub-000-w6-31
      ClientHost: 172.20.236.178
    ◎ consumer-sub-000-w6-7-0cfd67dd-e12f-4025-9cd8-2c8e8ccf2180
      ClientId: consumer-sub-000-w6-7
      ClientHost: 172.20.236.178
    ◎ consumer-sub-000-w6-3-1f251616-895d-441a-be4c-3dd1d671656d
      ClientId: consumer-sub-000-w6-3
      ClientHost: 172.20.236.178
```

## Produce

Use `produce` subcommand to write data to HStream Kafka server

```shell
hstream-kafka produce --help
```
```shell
Usage: hstream-kafka produce TopicName [-p|--partition Int32]
                                 [--timeout Int32] [-s|--separator String]
                                 ((-d|--data Text) | (-i|--interactive))
  Produce messages to topics

Available options:
  TopicName                Topic name
  -p,--partition Int32     Partition index
  --timeout Int32          Timeout in milliseconds
  -s,--separator String    Separator of key. e.g. key1@value (default: "@")
  -d,--data Text           Data
  -i,--interactive         Interactive mode
  -h,--help                Show this help text
```

Example: write data in interactive mode

```shell
hstream-kafka produce test-topic -i
```

```shell
> k1@v1
Message delivered to topic test-topic [1] at offset 0
> k2@v2
Message delivered to topic test-topic [0] at offset 0
> no key records
Message delivered to topic test-topic [0] at offset 1
> @"" key records
Message delivered to topic test-topic [0] at offset 2
```

## Consume

Use `consume` subcommand to consume data from HStream Kafka server

```shell
hstream-kafka consume -h
```

```shell
Up to date
Usage: hstream-kafka consume [-g|--group-id Text] (-t|--topic Text)
                                 [--earliest | --latest] [-e|--eof]
                                 [--no-auto-commit] [-v|--verbose]
  Consume messages from topics

Available options:
  -g,--group-id Text       Group id
  -t,--topic Text          Topic name
  --earliest               Reset offset to earliest
  --latest                 Reset offset to latest, default
  -e,--eof                 Exit consumer when last message in partition has been
                           received.
  --no-auto-commit         disable auto commit
  -v,--verbose             print record key and create timestamp.
  -h,--help                Show this help text
```

Example: consume data from `test-topic`

```shell
hstream-kafka --port 9092 consume -g test-consume-group -t test-topic --earliest -e -v
```

```shell
CreateTimestamp: 1704873507325   Key: k1                   v1
CreateTimestamp: 1704873516583   Key: k2                   v2
CreateTimestamp: 1704873523403   Key:                      no key records
CreateTimestamp: 1704873536329   Key:                      "" key records
EOF reached for all 3 partition(s)
Consumed 4 messages (32 bytes)
```
