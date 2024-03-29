# Kafka Compatibility

## Overview

HStream also supports Kafka API since 0.19.0, so users can connect to HStream
using Kafka clients. HStream implements
[Kafka protocol](https://kafka.apache.org/protocol.html) underly, so you do not
need to change any code in your current Kafka applications; just update the
Kafka URLs in your configurations to point to an HStream cluster, and that is it;
then you can start streaming from your Kafka applications to an HStream cluster.

::: tip

Refer to [Get Started with Kafka API](../start/get-started-with-kafka-api.md) to
learn how to enable HStream'support of Kafka API.

:::

## Compatibility with Apache Kafka

HStream supports Apache Kafka version 0.11 and later, and most Kafka clients
should be able to auto-negotiate protocol versions.

Currently, the clients below are tested by HStream.

| Language | Kafka Client                                                |
| -------- | ----------------------------------------------------------- |
| Java     | [Apache Kafka Java Client](https://github.com/apache/kafka) |
| Python   | [kafka-python], [confluent-kafka-python]                    |
| Go       | [kafka-go](https://github.com/segmentio/kafka-go)           |
| C/C++    | [librdkafka](https://github.com/confluentinc/librdkafka)    |

::: tip

Recommand using the latest version of each Kafka client

:::

## Features not supported in Apache Kafka

HStream does not support below Kafka features now(we plan to support them in the
later version):

- Kafka transactions
- Quotas in Kafka

::: tip

The configuration of Kafka brokers does not apply to HStream, as HStream is an
entirely different implementation.

:::

[kafka-python]: https://github.com/dpkp/kafka-python
[confluent-kafka-python]: https://github.com/confluentinc/confluent-kafka-python
