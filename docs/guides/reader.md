# Get Records from Shards of the Stream with Reader

## What is a Reader

To allow users to retrieve data from any stream shard, HStreamDB provides
readers for applications to manually manage the exact position of the record to
read from. Unlike subscription and consumption, a reader can be seen as a
lower-level API for getting records from streams. It gives users direct access
to any records in the stream, more precisely, any records from a specific shard
in the stream, and it does not require or rely on subscriptions and will not
send any acknowledgement back to the server. Therefore, the reader is helpful
for the case that requires better flexibility or rewinding of data reading.

When a user creates a reader instance, it is required that the user needs to
specify which record and which shard the reader begins from. A reader provides
starting position with the following options:

- The earliest available record in the shard
- The latest available record in the shard
- User-specified record location in the shard

## Reader Example

To read from the shards, users are required to get the desired shard id with
[`listShards`](./shards.md#listshards).

The name of a reader should also follow the format specified by the [guidelines](./stream.md#guidelines-to-name-a-resource)

::: code-group

```java
// ReadDataWithReaderExample.java

package docs.code.examples;

import static io.hstream.StreamShardOffset.SpecialOffset.EARLIEST;

import io.hstream.*;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class ReadDataWithReaderExample {
  public static void main(String[] args) throws Exception {
    // TODO (developers): Replace these variables for your own use cases.
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }
    String streamName = "your_h_records_stream_name";
    // Please change the value of shardId to the ones you can get from listShards
    long shardId = 0;
    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();
    readTheFirstRecordInShard(client, streamName, shardId);
    client.close();
  }

  public static void readTheFirstRecordInShard(
      HStreamClient client, String streamName, long shardId) {
    StreamShardOffset offset = new StreamShardOffset(EARLIEST);
    Reader reader =
        client
            .newReader()
            .readerId("your_reader_id")
            .streamName(streamName)
            .shardId(shardId)
            .shardOffset(offset) // default: EARLIEST
            .timeoutMs(1000) // default: 0
            .build();
    CompletableFuture<List<ReceivedRecord>> records =
        reader.read(10); // Specify the maximum available records a reader will get for one read
    System.out.println("Read records: " + records.join());
  }
}

```

```go
// ExampleReadDataWithReader.go

package examples

import (
	"context"
	"github.com/hstreamdb/hstreamdb-go/hstream"
	"log"
)

func ExampleReadDataWithReader() error {
	client, err := hstream.NewHStreamClient(YourHStreamServiceUrl)
	if err != nil {
		log.Fatalf("Create client error: %s", err)
	}
	defer client.Close()

	streamName := "testDefaultStream"
	readerId := "shardReader"

	shards, err := client.ListShards(streamName)
	if err != nil {
		log.Fatalf("List shards error: %s", err)
	}

	shardId := shards[0].ShardId

	reader, err := client.NewShardReader(streamName, readerId, shardId, hstream.WithReaderTimeout(100))
	if err != nil {
		log.Fatalf("Create reader error: %s", err)
	}
	defer client.DeleteShardReader(shardId, readerId)
	defer reader.Close()

	count := 0
	for {
		records, err := reader.Read(context.Background())
		if err != nil {
			log.Printf("Reader read error: %s\n", err.Error())
			continue
		}
		for _, record := range records {
			log.Printf("Reader read record [%s]:%v", record.GetRecordId().String(), record.GetPayload())
		}
		count += len(records)
		if count >= 100 {
			break
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


async def read_reader(client):
    offset = hstreamdb.ShardOffset()
    offset.specialOffset = hstreamdb.SpecialOffset.EARLIEST
    max_records = 10
    async with client.with_reader(
        stream_name, "your_reader_id", offset, 1000
    ) as reader:
        records = await reader.read(max_records)
        for i, r in enumerate(records):
            print(f"[{i}] payload: {r.payload}")
```

:::
