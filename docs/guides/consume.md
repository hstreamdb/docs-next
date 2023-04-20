# Consume Records with Subscriptions

## What is a Subscription?

To consume data from a stream, you must create a subscription to the stream.
When initiated, every subscription will retrieve the data from the beginning.
Consumers which receive and process records connect to a stream through a
subscription. A stream can have multiple subscriptions, but a given subscription
belongs to a single stream. Similarly, a subscription corresponds to one
consumer group with multiple consumers. However, every consumer belongs to only
a single subscription.

Please refer to [this page](./subscription.md) for detailed information about
creating and managing your subscriptions.

## How to consume data with a subscription

To consume data appended to a stream, HStreamDB Clients libraries have provided
asynchronous consumer API, which will initiate requests to join the consumer
group of the subscription specified.

### Two HStream Record types and corresponding receivers

As we [explained](./write.md#hstream-record), there are two types of records in
HStreamDB, HRecord and RawRecord. When initiating a consumer, corresponding
receivers are required. In the case where only HRecord Receiver is set, when the
consumer received a raw record, the consumer will ignore it and consume the next
record. Therefore, in principle, we do not recommend writing both HRecord and
RawRecord in the same stream. However, this is not strictly forbidden in
implementation, and you can provide both receivers to process both types of
records.

## Simple Consumer Example

To get higher throughput for your application, we provide asynchronous fetching
that does not require your application to block for new messages. Messages can
be received in your application using a long-running message receiver and
acknowledged one at a time, as shown in the example below.

::: code-group

```java
// ConsumeDataSimpleExample.java

package docs.code.examples;

import static java.util.concurrent.TimeUnit.SECONDS;

import io.hstream.Consumer;
import io.hstream.HRecordReceiver;
import io.hstream.HStreamClient;
import java.util.concurrent.TimeoutException;

public class ConsumeDataSimpleExample {
  public static void main(String[] args) throws Exception {
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }

    String subscriptionId = "your_subscription_id";
    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();
    consumeDataFromSubscriptionExample(client, subscriptionId);
    client.close();
  }

  public static void consumeDataFromSubscriptionExample(
      HStreamClient client, String subscriptionId) {
    HRecordReceiver receiver =
        ((hRecord, responder) -> {
          System.out.println("Received a record :" + hRecord.getHRecord());
          responder.ack();
        });
    // Consumer is a Service(ref:
    // https://guava.dev/releases/19.0/api/docs/com/google/common/util/concurrent/Service.html)
    Consumer consumer =
        client
            .newConsumer()
            .subscription(subscriptionId)
            // optional, if it is not set, client will generate a unique id.
            .name("consumer_1")
            .hRecordReceiver(receiver)
            .build();
    // start Consumer as a background service and return
    consumer.startAsync().awaitRunning();
    try {
      // sleep 5s for consuming records
      consumer.awaitTerminated(5, SECONDS);
    } catch (TimeoutException e) {
      // stop consumer
      consumer.stopAsync().awaitTerminated();
    }
  }
}

```

```go
// ExampleConsumer.go

package examples

import (
	"github.com/hstreamdb/hstreamdb-go/hstream"
	"log"
	"time"
)

func ExampleConsumer() error {
	client, err := hstream.NewHStreamClient(YourHStreamServiceUrl)
	if err != nil {
		log.Fatalf("Creating client error: %s", err)
	}
	defer client.Close()

	subId := "SubscriptionId0"
	consumer := client.NewConsumer("consumer-1", subId)
	defer consumer.Stop()

	dataChan := consumer.StartFetch()
	timer := time.NewTimer(3 * time.Second)
	defer timer.Stop()

	for {
		select {
		case <-timer.C:
			log.Println("[consumer]: Streaming fetch stopped")
			return nil
		case recordMsg := <-dataChan:
			if recordMsg.Err != nil {
				log.Printf("[consumer]: Streaming fetch error: %s", err)
				continue
			}

			for _, record := range recordMsg.Result {
				log.Printf("[consumer]: Receive %s record: record id = %s, payload = %+v",
					record.GetRecordType(), record.GetRecordId().String(), record.GetPayload())
				record.Ack()
			}
		}
	}

	return nil
}

```

```python
# https://github.com/hstreamdb/hstreamdb-py/blob/main/examples/snippets/guides.py
import asyncio
import hstreamdb
import os

# NOTE: Replace with your own host and port
host = os.getenv("GUIDE_HOST", "127.0.0.1")
port = os.getenv("GUIDE_PORT", 6570)
stream_name = "your_stream"
subscription = "your_subscription"


# Run: asyncio.run(main(your_async_function))
async def main(*funcs):
    async with await hstreamdb.insecure_client(host=host, port=port) as client:
        for f in funcs:
            await f(client)


class Processing:
    count = 0
    max_count: int

    def __init__(self, max_count):
        self.max_count = max_count

    async def __call__(self, ack_fun, stop_fun, rs_iter):
        print("max_count", self.max_count)
        rs = list(rs_iter)
        for r in rs:
            self.count += 1
            print(f"[{self.count}] Receive: {r}")
            if self.max_count > 0 and self.count >= self.max_count:
                await stop_fun()
                break

        await ack_fun(r.id for r in rs)


async def subscribe_records(client):
    consumer = client.new_consumer("new_consumer", subscription, Processing(10))
    await consumer.start()
```

:::

For better performance, Batched Ack is enabled by default with settings
`ackBufferSize` = 100 and `ackAgeLimit` = 100, which you can change when
initiating your consumers.

::: code-group

```java
Consumer consumer =
    client
        .newConsumer()
        .subscription("you_subscription_id")
        .name("your_consumer_name")
        .hRecordReceiver(your_receiver)
        // When ack() is called, the consumer will not send it to servers immediately,
        // the ack request will be buffered until the ack count reaches ackBufferSize
        // or the consumer is stopping or reached ackAgelimit
        .ackBufferSize(100)
        .ackAgeLimit(100)
        .build();
```

:::

## Multiple consumers and shared consumption progress

In HStream, a subscription is consumed by a consumer group. In this consumer
group, there could be multiple consumers which share the subscription's
progress. To increase the rate of consuming data from a subscription, we could
have a new consumer join the existing subscription. The code is for
demonstration of how consumers can join the consumer group. Usually, the case is
that users would have consumers from different clients.

::: code-group

```java
// ConsumeDataSharedExample.java

package docs.code.examples;

import static java.util.concurrent.TimeUnit.SECONDS;

import io.hstream.Consumer;
import io.hstream.HRecordReceiver;
import io.hstream.HStreamClient;
import java.util.concurrent.TimeoutException;

public class ConsumeDataSharedExample {
  public static void main(String[] args) throws Exception {
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }

    String subscription = "your_subscription_id";
    String consumer1 = "your_consumer1_name";
    String consumer2 = "your_consumer2-name";
    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();

    // create two consumers to consume records with several partition keys.
    Thread t1 =
        new Thread(() -> consumeDataFromSubscriptionSharedExample(client, subscription, consumer1));
    Thread t2 =
        new Thread(() -> consumeDataFromSubscriptionSharedExample(client, subscription, consumer2));
    t1.start();
    t2.start();
    t1.join();
    t2.join();
    client.close();
  }

  public static void consumeDataFromSubscriptionSharedExample(
      HStreamClient client, String subscription, String consumerName) {
    HRecordReceiver receiver =
        ((hRecord, responder) -> {
          System.out.println("Received a record :" + hRecord.getHRecord());
          responder.ack();
        });
    Consumer consumer =
        client
            .newConsumer()
            .subscription(subscription)
            .name(consumerName)
            .hRecordReceiver(receiver)
            .build();
    try {
      // sleep 5s for consuming records
      consumer.startAsync().awaitRunning();
      consumer.awaitTerminated(5, SECONDS);
    } catch (TimeoutException e) {
      // stop consumer
      consumer.stopAsync().awaitTerminated();
    }
  }
}

```

```go
// ExampleConsumerGroup.go

package examples

import (
	"github.com/hstreamdb/hstreamdb-go/hstream"
	"log"
	"sync"
	"time"
)

func ExampleConsumerGroup() error {
	client, err := hstream.NewHStreamClient(YourHStreamServiceUrl)
	if err != nil {
		log.Fatalf("Creating client error: %s", err)
	}
	defer client.Close()

	subId1 := "SubscriptionId1"

	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		consumer := client.NewConsumer("consumer-1", subId1)
		defer consumer.Stop()
		timer := time.NewTimer(5 * time.Second)
		defer timer.Stop()
		defer wg.Done()

		dataChan := consumer.StartFetch()
		for {
			select {
			case <-timer.C:
				log.Println("[consumer-1]: Stream fetching stopped")
				return
			case recordMsg := <-dataChan:
				if recordMsg.Err != nil {
					log.Printf("[consumer-1]: Stream fetching error: %s", err)
					continue
				}

				for _, record := range recordMsg.Result {
					log.Printf("[consumer-1]: Receive %s record: record id = %s, payload = %+v",
						record.GetRecordType(), record.GetRecordId().String(), record.GetPayload())
					record.Ack()
				}
			}
		}
	}()

	go func() {
		consumer := client.NewConsumer("consumer-2", subId1)
		defer consumer.Stop()
		timer := time.NewTimer(5 * time.Second)
		defer timer.Stop()
		defer wg.Done()

		dataChan := consumer.StartFetch()
		for {
			select {
			case <-timer.C:
				log.Println("[consumer-2]: Stream fetching stopped")
				return
			case recordMsg := <-dataChan:
				if recordMsg.Err != nil {
					log.Printf("[consumer-2]: Stream fetching error: %s", err)
					continue
				}

				for _, record := range recordMsg.Result {
					log.Printf("[consumer-2]: Receive %s record: record id = %s, payload = %+v",
						record.GetRecordType(), record.GetRecordId().String(), record.GetPayload())
					record.Ack()
				}
			}
		}
	}()

	wg.Wait()

	return nil
}

```

:::

## Flow Control with `maxUnackedRecords`

A common scenario is that your consumers may not process and acknowledge data as
fast as the server sends, or some unexpected problems causing the consumer
client to be unable to acknowledge the data received, which could cause problems
as such:

The server would have to keep resending unacknowledged messages, and maintain
the information about unacknowledged messages, which would consume resources of
the server, and cause the server to face the issue of resource exhaustion.

To mitigate the issue above, use the `maxUnackedRecords` setting of the
subscription to control the maximum number of allowed un-acknowledged records
when the consumers receive messages. Once the number exceeds the
`maxUnackedRecords`, the server will stop sending messages to consumers of the
current subscription.

## Receiving messages in order

Note: the order described below is just for a single consumer. If a subscription
has multiple consumers, the order can still be guaranteed in each, but the order
is no longer preserved if we see the consumer group as an entity.

Consumers will receive messages with the same partition key in the order that
the HStream server receives them. Since HStream delivers hstream records with
at-least-once semantics, in some cases, when HServer does not receive the ack
for some record in the middle, it might deliver the record more than once. In
these cases, we can not guarantee the order either.

## Handling errors

When a consumer is running, and failure happens at the receiver, the default
behaviour is that the consumer will catch the exception, print an error log, and
continue consuming the next record instead of failing.

Consumers could fail in other scenarios, such as network, deleted subscriptions,
etc. However, as a service, you may want the consumer to keep running, so you
can register a listener to handle a failed consumer:

::: code-group

```java
// add Listener for handling failed consumer
var threadPool = new ScheduledThreadPoolExecutor(1);
consumer.addListener(
    new Service.Listener() {
      public void failed(Service.State from, Throwable failure) {
        System.out.println("consumer failed, with error: " + failure.getMessage());
      }
    },
    threadPool);
```

:::
