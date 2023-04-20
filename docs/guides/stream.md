# Create and Manage Streams

## Guidelines to name a resource

An HStream resource name uniquely identifies an HStream resource, such as a
stream, a subscription or a reader. The resource name must fit the following
requirements:

- Start with a letter
- Length must be no longer than 255 characters
- Contain only the following characters: Letters `[A-Za-z]`, numbers `[0-9]`,
  dashes `-`, underscores `_`

\*For the cases where the resource name is used as a part of a SQL statement,
  such as in [HStream SQL Shell](../reference/cli.md#hstream-sql-shell), there
  will be situations where the resource name cannot be parsed properly (such as
  conflicts with Keywords etc.), enclose the resource name with backticks `` ` ``.
  With the enhancements of the SQL parser, the constriction may be removed in the future.

## Attributes of a Stream

- Replication factor

  For fault tolerance and higher availability, every stream can be replicated
  across nodes in the cluster. A typical production setting is a replication
  factor of 3, i.e., there will always be three copies of your data, which is
  helpful just in case things go wrong or you want to do maintenance on the
  brokers. This replication is performed at the level of the stream.

- Backlog retention

  The configuration controls how long streams of HStreamDB retain records after
  being appended. HStreamDB will discard the message regardless of whether it is
  consumed when it exceeds the backlog retention duration.

  + Default = 7 days
  + Minimum value = 1 seconds
  + Maximum value = 21 days

- Shard Count

  The number of shards that a stream will have.

## Create a Stream

Create a stream before you write records or create a subscription.

::: code-group

```java
// CreateStreamExample.java

package docs.code.examples;

import io.hstream.HStreamClient;

public class CreateStreamExample {
  public static void main(String[] args) throws Exception {
    // TODO(developer): Replace these variables before running the sample.
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }

    String streamName1 = "your_h_records_stream_name";
    String streamName2 = "your_raw_records_stream_name";

    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();
    createStreamExample(client, streamName1);
    createStreamWithAttrsExample(client, streamName2);
    client.close();
  }

  public static void createStreamExample(HStreamClient client, String streamName) {
    client.createStream(streamName);
  }

  public static void createStreamWithAttrsExample(HStreamClient client, String streamName) {
    client.createStream(
        streamName,
        (short) 1 // replication factor
        ,
        10 // Number of shards
        ,
        7 * 24 * 3600 // backlog retention time in seconds
        );
  }
}

```

```go
// ExampleCreateStream.go

package examples

import (
	"log"

	"github.com/hstreamdb/hstreamdb-go/hstream"
)

func ExampleCreateStream() error {
	client, err := hstream.NewHStreamClient(YourHStreamServiceUrl)
	if err != nil {
		log.Fatalf("Creating client error: %s", err)
	}
	defer client.Close()

	// Create a stream, only specific streamName
	if err = client.CreateStream("testDefaultStream"); err != nil {
		log.Fatalf("Creating stream error: %s", err)
	}

	// Create a new stream with 1 replica, 5 shards, set the data retention to 1800s.
	err = client.CreateStream("testStream",
		hstream.WithReplicationFactor(1),
		hstream.EnableBacklog(1800),
		hstream.WithShardCount(5))
	if err != nil {
		log.Fatalf("Creating stream error: %s", err)
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


async def create_stream(client):
    await client.create_stream(
        stream_name, replication_factor=1, backlog=24 * 60 * 60, shard_count=1
    )
```

:::

## Delete a Stream

Deletion is only allowed when a stream has no subsequent subscriptions unless
the force flag is set.

### Delete a stream with the force flag

If you need to delete a stream with subscriptions, enable force deletion.
Existing stream subscriptions can still read from the backlog after deleting a
stream with the force flag enabled. However, these subscriptions will have
stream name `__deleted_stream__`, no new subscription creation on the deleted
stream would be allowed, nor new records would be allowed to be written to the
stream.

::: code-group

```java
// DeleteStreamExample.java

package docs.code.examples;

import io.hstream.HStreamClient;

public class DeleteStreamExample {
  public static void main(String[] args) throws Exception {
    // TODO(developer): Replace these variables before running the sample.
    // String serviceUrl = "your-service-url-address";
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }

    String streamName1 = "your_h_records_stream_name";
    String streamName2 = "your_raw_records_stream_name";

    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();
    deleteStreamExample(client, streamName1);
    deleteStreamForceExample(client, streamName2);
    client.close();
  }

  public static void deleteStreamExample(HStreamClient client, String streamName) {
    client.deleteStream(streamName);
  }

  public static void deleteStreamForceExample(HStreamClient client, String streamName) {
    client.deleteStream(streamName, true);
  }
}

```

```go
// ExampleDeleteStream.go

package examples

import (
	"github.com/hstreamdb/hstreamdb-go/hstream"
	"log"
)

func ExampleDeleteStream() error {
	client, err := hstream.NewHStreamClient(YourHStreamServiceUrl)
	if err != nil {
		log.Fatalf("Creating client error: %s", err)
	}
	defer client.Close()

	// force delete stream and ignore none exist stream
	if err := client.DeleteStream("testStream",
		hstream.EnableForceDelete,
		hstream.EnableIgnoreNoneExist); err != nil {
		log.Fatalf("Deleting stream error: %s", err)
	}

	if err := client.DeleteStream("testDefaultStream"); err != nil {
		log.Fatalf("Deleting stream error: %s", err)
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


async def delete_stream(client):
    await client.delete_stream(stream_name, ignore_non_exist=True, force=True)
```

:::

## List Streams

To get all streams in HStreamDB:

::: code-group

```java
// ListStreamsExample.java

package docs.code.examples;

import io.hstream.HStreamClient;
import io.hstream.Stream;
import java.util.List;

public class ListStreamsExample {
  public static void main(String[] args) throws Exception {
    // TODO(developer): Replace these variables before running the sample.
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }

    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();
    listStreamExample(client);
    client.close();
  }

  public static void listStreamExample(HStreamClient client) {
    List<Stream> streams = client.listStreams();
    for (Stream stream : streams) {
      System.out.println(stream.getStreamName());
    }
  }
}

```

```go
// ExampleListStreams.go

package examples

import (
	"fmt"
	"github.com/hstreamdb/hstreamdb-go/hstream"
	"log"
)

func ExampleListStreams() error {
	client, err := hstream.NewHStreamClient(YourHStreamServiceUrl)
	if err != nil {
		log.Fatalf("Creating client error: %s", err)
	}
	defer client.Close()

	streams, err := client.ListStreams()
	if err != nil {
		log.Fatalf("Listing streams error: %s", err)
	}

	for _, stream := range streams {
		fmt.Printf("%+v\n", stream)
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


async def list_streams(client):
    ss = await client.list_streams()
    for s in ss:
        print(s)
```

:::
