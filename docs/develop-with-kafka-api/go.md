# Develop with Go Kafka client

This page shows how to use [Sarama Go Client](https://github.com/IBM/sarama) to interact with HStream.


::: warning

Currently only support kafka version between v0.11.0 to v1.0.2

:::

## Create a Topic


::: code-group

<<< @/../kafka-examples/go/examples/create_topics.go [Go]

:::

## Produce a Record


::: code-group

<<< @/../kafka-examples/go/examples/produce.go [Go]

:::

## Consume Records


::: code-group

<<< @/../kafka-examples/go/examples/consume.go [Go]

:::
