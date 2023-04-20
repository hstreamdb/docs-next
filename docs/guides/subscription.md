# Create and Manage Subscriptions

## Attributes of a Subscription

- ackTimeoutSeconds.

  Specifies the max amount of time for the server to mark the record as
  unacknowledged, after which the record will be sent again.

- maxUnackedRecords.

  The maximum amount of unacknowledged records allowed. After exceeding the size
  set, the server will stop sending records to corresponding consumers.

## Create a subscription

Every subscription has to specify which stream to subscribe to, which means you
have to make sure the stream to be subscribed has already been created.

For the subscription name, please refer to the [guidelines to name a resource](./stream.md/#guidelines-to-name-a-resource)

When creating a subscription, you can provide the attributes mentioned like
this:

::: code-group

```java
// CreateSubscriptionExample.java

package docs.code.examples;

import io.hstream.HStreamClient;
import io.hstream.Subscription;

public class CreateSubscriptionExample {
  public static void main(String[] args) throws Exception {
    // TODO(developer): Replace these variables before running the sample.
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }
    String streamName = "your_h_records_stream_name";
    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();
    createSubscriptionExample(client, streamName);
    client.close();
  }

  public static void createSubscriptionExample(HStreamClient client, String streamName) {
    // TODO(developer): Specify the options while creating the subscription
    String subscriptionId = "your_subscription_id";
    Subscription subscription =
        Subscription.newBuilder().subscription(subscriptionId).stream(streamName)
            .ackTimeoutSeconds(600) // The default setting is 600 seconds
            .maxUnackedRecords(10000) // The default setting is 10000 records
            .build();
    client.createSubscription(subscription);
  }
}

```

```go
// ExampleCreateSubscription.go

package examples

import (
	"github.com/hstreamdb/hstreamdb-go/hstream"
	"log"
)

func ExampleCreateSubscription() error {
	client, err := hstream.NewHStreamClient(YourHStreamServiceUrl)
	if err != nil {
		log.Fatalf("Creating client error: %s", err)
	}
	defer client.Close()

	streamName := "testStream"
	subId0 := "SubscriptionId0"
	subId1 := "SubscriptionId1"

	// Create a new subscription with ack timeout = 60s, max unAcked records num set to 10000 and set
	// subscriptionOffset to Earliest
	if err = client.CreateSubscription(subId0, streamName,
		hstream.WithAckTimeout(60),
		hstream.WithMaxUnackedRecords(10000),
		hstream.WithOffset(hstream.EARLIEST)); err != nil {
		log.Fatalf("Creating subscription error: %s", err)
	}

	if err = client.CreateSubscription(subId1, streamName,
		hstream.WithAckTimeout(600),
		hstream.WithMaxUnackedRecords(5000),
		hstream.WithOffset(hstream.LATEST)); err != nil {
		log.Fatalf("Creating subscription error: %s", err)
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


async def create_subscription(client):
    await client.create_subscription(
        subscription,
        stream_name,
        ack_timeout=600,
        max_unacks=10000,
        offset=hstreamdb.SpecialOffset.EARLIEST,
    )
```

:::

## Delete a subscription

To delete a subscription without the force flag, you need to make sure that
there is no active subscription consumer.

### Delete a subscription with the force flag

If you do want to delete a subscription with running consumers, enable force
deletion. While force deleting a subscription, the subscription will be in
deleting state and closing running consumers, which means you will not be able
to join, delete or create a subscription with the same name. After the deletion
completes, you can create a subscription with the same name. However, this new
subscription will be a brand new subscription. Even if they subscribe to the
same stream, this new subscription will not share the consumption progress with
the deleted subscription.

::: code-group

```java
// DeleteSubscriptionExample.java

package docs.code.examples;

import io.hstream.HStreamClient;

public class DeleteSubscriptionExample {
  public static void main(String[] args) throws Exception {
    // TODO(developer): Replace these variables before running the sample.
    // String serviceUrl = "your-service-url-address";
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }

    String subscriptionId = "your_subscription_id";
    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();
    deleteSubscriptionExample(client, subscriptionId);
    client.close();
  }

  public static void deleteSubscriptionExample(HStreamClient client, String subscriptionId) {
    client.deleteSubscription(subscriptionId);
  }

  public static void deleteSubscriptionForceExample(HStreamClient client, String subscriptionId) {
    client.deleteSubscription(subscriptionId, true);
  }
}

```

```go
// ExampleDeleteSubscription.go

package examples

import (
	"github.com/hstreamdb/hstreamdb-go/hstream"
	"log"
)

func ExampleDeleteSubscription() error {
	client, err := hstream.NewHStreamClient(YourHStreamServiceUrl)
	if err != nil {
		log.Fatalf("Creating client error: %s", err)
	}
	defer client.Close()

	subId0 := "SubscriptionId0"
	subId1 := "SubscriptionId1"

	// force delete subscription
	if err = client.DeleteSubscription(subId0, true); err != nil {
		log.Fatalf("Force deleting subscription error: %s", err)
	}

	// delete subscription
	if err = client.DeleteSubscription(subId1, false); err != nil {
		log.Fatalf("Deleting subscription error: %s", err)
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


async def delete_subscription(client):
    await client.delete_subscription(subscription, force=True)
```

:::

## List subscriptions

To list all subscriptions in HStream

::: code-group

```java
// ListSubscriptionsExample.java

package docs.code.examples;

import io.hstream.HStreamClient;
import io.hstream.Subscription;
import java.util.List;

public class ListSubscriptionsExample {

  public static void main(String[] args) throws Exception {
    // TODO(developer): Replace these variables before running the sample.
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }

    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();
    listSubscriptionExample(client);
    client.close();
  }

  public static void listSubscriptionExample(HStreamClient client) {
    List<Subscription> subscriptions = client.listSubscriptions();
    for (Subscription subscription : subscriptions) {
      System.out.println(subscription.getSubscriptionId());
    }
  }
}

```

```go
// ExampleListSubscriptions.go

package examples

import (
	"fmt"
	"github.com/hstreamdb/hstreamdb-go/hstream"
	"log"
)

func ExampleListSubscriptions() error {
	client, err := hstream.NewHStreamClient(YourHStreamServiceUrl)
	if err != nil {
		log.Fatalf("Creating client error: %s", err)
	}
	defer client.Close()

	subscriptions, err := client.ListSubscriptions()
	if err != nil {
		log.Fatalf("Listing subscriptions error: %s", err)
	}

	for _, sub := range subscriptions {
		fmt.Printf("%+v\n", sub)
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


async def list_subscriptions(client):
    subscriptions = await client.list_subscriptions()
    for s in subscriptions:
        print(s)
```

:::
