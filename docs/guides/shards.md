# Manage Shards of the Stream

## Sharding in HStreamDB

A stream is a logical concept for producer and consumer, and under the hood,
these data passing through are stored in the shards of the stream in an
append-only fashion.

A shard is essentially the primary storage unit which contains all the
corresponding records with some partition keys. Every stream will contain
multiple shards spread across multiple server nodes. Since we believe that
stream on itself is a sufficiently concise and powerful abstraction, the
sharding logic is minimally visible to the user. For example, during writing or
consumption, each stream appears to be managed as an entity as far as the user
is concerned.

However, for the cases where the user needs more fine-grained control and better
flexibility, we offer interfaces to get into the details of shards of the stream
and other interfaces to work with shards like Reader.

## Specify the Number of Shards When Creating a Stream

To decide the number of shards which a stream should have, an attribute
shardCount is provided when creating a
[stream](./stream.md#attributes-of-a-stream).

## List Shards

To list all the shards of one stream.

::: code-group

```java
// ListShardsExample.java

package docs.code.examples;

import io.hstream.HStreamClient;
import io.hstream.Shard;
import java.util.List;

public class ListShardsExample {
  public static void main(String[] args) throws Exception {
    // TODO(developer): Replace these variables before running the sample.
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }
    String streamName = "your_h_records_stream_name";

    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();
    listShardsExample(client, streamName);
    client.close();
  }

  public static void listShardsExample(HStreamClient client, String streamName) {
    List<Shard> shards = client.listShards(streamName);
    for (Shard shard : shards) {
      System.out.println(shard.getStreamName());
    }
  }
}

```

```go
// ExampleListShards.go

package examples

import (
	"fmt"
	"github.com/hstreamdb/hstreamdb-go/hstream"
	"log"
)

func ExampleListShards() error {
	client, err := hstream.NewHStreamClient(YourHStreamServiceUrl)
	if err != nil {
		log.Fatalf("Create client error: %s", err)
	}
	defer client.Close()

	streamName := "testStream"
	shards, err := client.ListShards(streamName)
	if err != nil {
		log.Fatalf("Liste shards error: %s", err)
	}

	for _, shard := range shards {
		fmt.Printf("%+v\n", shard)
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


async def list_shards(client):
    shards = client.list_shards(stream_name)
    print(list(shards))
```

:::
