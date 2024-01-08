# Kafka Compatibility

## Overview

HStream also supports Kafka API since 0.19.0, so users can connect to HStream using Kafka clients. HStream implements [Kafka protocol](https://kafka.apache.org/protocol.html) underly, so you do not need to change any code in your current Kafka applications, just updating the Kafka URLs in your configurations to point to a HStream cluster, and that is it, then you can start streaming from your Kafka applications to a HStream cluster.


> [!NOTE]
>
> Refer to [get started with Kafka API](../start/get-started-with-kafka-api.md) to learn how to enable HStream'support of Kafka API.


## Compatibility with Apache Kafka

HStream supports Apache Kafka version 0.11 and later, and most Kafka clients should be able to auto-negotiate protocol versions.

Currenty, the clients below are tested by HStream.

| Language | Kafka Client |
| -------- | ------------ |
| Java     | [Apache Kafka Java Client](https://github.com/apache/kafka) |
| Python   | [kafka-python](https://github.com/dpkp/kafka-python) |
| Go       | [franz-go](https://github.com/twmb/franz-go) |
| C/C++    | [librdkafka](https://github.com/confluentinc/librdkafka) |


> [!NOTE]
>
> Recommand using the latest version of each Kafka client
>

## Features not supported in Apache Kafka


HStream do not support below Kafka features now(we plan to support them in the later version):
- Kafka transactions
- Quotas in Kafka

> [!NOTE]
>
> The configuration of Kafka brokers is not applicable to HStream, as HStream is a completely different implementation.
>
