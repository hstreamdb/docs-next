# Develop with Python Kafka client

This guide will show you how to use Python Kafka client to interact with
HStream. Currenty, we support [kafka-python] and [confluent-kafka].

## Installation

```sh
# If you want to use kafka-python
pip install kafka-python

# Or if you want to use confluent-kafka
pip install confluent-kafka
```

::: tip

Prefer to use a virtual environment? Check out Python's built-in
[venv](https://docs.python.org/3/library/venv.html).

:::

## Create a Topic

::: code-group

<!-- prettier-ignore -->
@snippet_group kafka-examples/python/snippets/kafka_python.py [kafka-python] common create-topic

<!-- prettier-ignore -->
@snippet_group kafka-examples/python/snippets/confluent_kafka_python.py [confluent-kafka] common create-topic

:::

## Produce Records

::: code-group

<!-- prettier-ignore -->
@snippet_group kafka-examples/python/snippets/kafka_python.py [kafka-python] common produce

<!-- prettier-ignore -->
@snippet_group kafka-examples/python/snippets/confluent_kafka_python.py [confluent-kafka] common produce

:::

## Consume Records

::: code-group

<!-- prettier-ignore -->
@snippet_group kafka-examples/python/snippets/kafka_python.py [kafka-python] common consume

<!-- prettier-ignore -->
@snippet_group kafka-examples/python/snippets/confluent_kafka_python.py [confluent-kafka] common consume

:::

[kafka-python]: https://github.com/dpkp/kafka-python
[confluent-kafka]: https://github.com/confluentinc/confluent-kafka-python
