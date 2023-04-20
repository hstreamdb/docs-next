# Write Records to Streams

This document provides information about how to write data to streams in
HStreamDB using hstreamdb-java or clients implemented in other languages.

You can also read the following pages to get a more thorough understanding:

- How to [create and manage Streams](./stream.md).
- How to [consume the data written to a Stream](./consume.md).

To write data to HStreamDB, we need to pack messages as HStream Records and a
producer that creates and sends messages to servers.

## HStream Record

All data in streams are in the form of an HStream Record. There are two kinds of
HStream Record:

- **HRecord**: You can think of an hrecord as a piece of JSON data, just like
  the document in some NoSQL databases.
- **Raw Record**: Arbitrary binary data.

## End-to-End Compression

To reduce transfer overhead and maximize bandwidth utilization, HStreamDB
supports the compression of written HStream records. Users can set the
compression algorithm when creating a `BufferedProducer`. Currently, HStreamDB
supports both `gzip` and `zstd` compression algorithms. Compressed records are
automatically decompressed by the client when they are consumed from HStreamDB.

## Write HStream Records

There are two ways to write records to servers. For simplicity, you can use
`Producer` from `client.newProducer()` to start with. `Producer`s do not provide
any configure options, it simply sends records to servers as soon as possible,
and all these records are sent in parallel, which means they are unordered. In
practice, `BufferedProducer` from the `client.newBufferedProducer()` would
always be better. `BufferedProducer` will buffer records in order as a batch and
send the batch to servers. When a record is written to the stream, HStream
Server will generate a corresponding record id for the record and send it back
to the client. The record id is unique in the stream.

## Write Records Using a Producer

::: code-group

```java
// WriteDataSimpleExample.java

package docs.code.examples;

import io.hstream.*;
import io.hstream.Record;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class WriteDataSimpleExample {
  public static void main(String[] args) throws Exception {
    // TODO (developers): Replace these variables for your own use cases.
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }

    String streamName1 = "your_h_records_stream_name";
    String streamName2 = "your_raw_records_stream_name";

    // We do not recommend write both raw data and HRecord data into the same stream.
    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();

    writeHRecordData(client, streamName1);
    writeRawData(client, streamName2);
    client.close();
  }

  public static void writeHRecordData(HStreamClient client, String streamName) {
    // Create a basic producer for low latency scenarios
    // For high throughput scenarios, please see the next section "Using `BufferedProducer`s"
    Producer producer = client.newProducer().stream(streamName).build();

    HRecord hRecord =
        HRecord.newBuilder()
            // Number
            .put("id", 10)
            // Boolean
            .put("isReady", true)
            // List
            .put("targets", HArray.newBuilder().add(1).add(2).add(3).build())
            // String
            .put("name", "hRecord-example")
            .build();

    for (int i = 0; i <= 3000; i++) {
      Record record = Record.newBuilder().hRecord(hRecord).build();
      // If the data is written successfully, returns a server-assigned record id
      CompletableFuture<String> recordId = producer.write(record);
      System.out.println("Wrote message ID: " + recordId.join());
    }
  }

  private static void writeRawData(HStreamClient client, String streamName) {
    Producer producer = client.newProducer().stream(streamName).build();
    List<String> messages = Arrays.asList("first", "second");
    for (final String message : messages) {
      Record record =
          Record.newBuilder().rawRecord(message.getBytes(StandardCharsets.UTF_8)).build();
      CompletableFuture<String> recordId = producer.write(record);
      System.out.println("Published message ID: " + recordId.join());
    }
  }
}

```

```go
// ExampleWriteProducer.go

package examples

import (
	"github.com/hstreamdb/hstreamdb-go/hstream"
	"github.com/hstreamdb/hstreamdb-go/hstream/Record"
	"log"
)

func ExampleWriteProducer() error {
	client, err := hstream.NewHStreamClient(YourHStreamServiceUrl)
	if err != nil {
		log.Fatalf("Creating client error: %s", err)
	}
	defer client.Close()

	producer, err := client.NewProducer("testStream")
	if err != nil {
		log.Fatalf("Creating producer error: %s", err)
	}

	defer producer.Stop()

	payload := []byte("Hello HStreamDB")

	rawRecord, err := Record.NewHStreamRawRecord("testStream", payload)
	if err != nil {
		log.Fatalf("Creating raw record error: %s", err)
	}

	for i := 0; i < 100; i++ {
		appendRes := producer.Append(rawRecord)
		if resp, err := appendRes.Ready(); err != nil {
			log.Printf("Append error: %s", err)
		} else {
			log.Printf("Append response: %s", resp)
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


async def append_records(client):
    payloads = [b"some_raw_binary_bytes", {"msg": "hi"}]
    rs = await client.append(stream_name, payloads)
    for r in rs:
        print("Append done, ", r)
```

:::

## Write Records Using a Buffered Producer

In almost all scenarios, we would recommend using `BufferedProducer` whenever
possible because it offers higher throughput and provides a very flexible
configuration that allows you to adjust between throughput and latency as
needed. You can configure the following two settings of BufferedProducer to
control and set the trigger and the buffer size. With `BatchSetting`, you can
determine when to send the batch based on the maximum number of records, byte
size in the batch and the maximum age of the batch. By configuring
`FlowControlSetting`, you can set the buffer for all records. The following code
example shows how you can use `BatchSetting` to set responding triggers to
notify when the producer should flush and `FlowControlSetting` to limit maximum
bytes in a BufferedProducer.

::: code-group

```java
// WriteDataBufferedExample.java

package docs.code.examples;

import io.hstream.*;
import io.hstream.Record;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.CompletableFuture;

public class WriteDataBufferedExample {
  public static void main(String[] args) throws Exception {
    // TODO (developers): Replace these variables for your own use cases.
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }

    String streamName = "your_h_records_stream_name";
    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();
    writeHRecordDataWithBufferedProducers(client, streamName);
    client.close();
  }

  public static void writeHRecordDataWithBufferedProducers(
      HStreamClient client, String streamName) {
    BatchSetting batchSetting =
        BatchSetting.newBuilder()
            // optional, default: 100, the max records count of a batch,
            // disable the trigger if the value <= 0.
            .recordCountLimit(100)

            // optional, default: 4096(4KB), the max bytes size of a batch,
            // disable the trigger if the value <= 0.
            .bytesLimit(4096)

            // optional, default: 100(ms), the max age of a buffering batch,
            // disable the trigger if the value <= 0.
            .ageLimit(100)
            .build();

    // FlowControlSetting is to control total records,
    // including buffered batch records and sending records
    FlowControlSetting flowControlSetting =
        FlowControlSetting.newBuilder()
            // Optional, the default: 104857600(100MB), total bytes limit, including buffered batch
            // records and
            // sending records, the value must be greater than batchSetting.bytesLimit
            .bytesLimit(40960)
            .build();
    BufferedProducer producer =
        client.newBufferedProducer().stream(streamName)
            .batchSetting(batchSetting)
            .flowControlSetting(flowControlSetting)
            .build();

    List<CompletableFuture<String>> recordIds = new ArrayList<>();
    Random random = new Random();

    for (int i = 0; i < 100; i++) {
      double temp = random.nextInt(100) / 10.0 + 15;
      HRecord hRecord = HRecord.newBuilder().put("temperature", temp).build();
      Record record = Record.newBuilder().hRecord(hRecord).build();
      CompletableFuture<String> recordId = producer.write(record);
      recordIds.add(recordId);
    }

    // close a producer, it will call flush() first
    producer.close();
    System.out.println("Wrote message IDs: " + recordIds.stream().map(CompletableFuture::join));
  }
}

```

```go
// ExampleWriteBatchProducer.go

package examples

import (
	"github.com/hstreamdb/hstreamdb-go/hstream"
	"github.com/hstreamdb/hstreamdb-go/hstream/Record"
	"log"
)

func ExampleWriteBatchProducer() error {
	client, err := hstream.NewHStreamClient(YourHStreamServiceUrl)
	if err != nil {
		log.Fatalf("Creating client error: %s", err)
	}
	defer client.Close()

	producer, err := client.NewBatchProducer("testDefaultStream", hstream.WithBatch(10, 500))
	if err != nil {
		log.Fatalf("Creating producer error: %s", err)
	}
	defer producer.Stop()

	result := make([]hstream.AppendResult, 0, 100)
	for i := 0; i < 100; i++ {
		rawRecord, _ := Record.NewHStreamHRecord("", map[string]interface{}{
			"id":      i,
			"isReady": true,
			"name":    "hRecord-example",
		})
		r := producer.Append(rawRecord)
		result = append(result, r)
	}

	for i, res := range result {
		resp, err := res.Ready()
		if err != nil {
			log.Printf("write error: %s\n", err.Error())
		}
		log.Printf("record[%d]=%s\n", i, resp.String())
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


class AppendCallback(hstreamdb.BufferedProducer.AppendCallback):
    count = 0

    def on_success(self, stream_name, payloads, stream_keyid):
        self.count += 1
        print(f"Batch {self.count}: Append success with {len(payloads)} payloads.")

    def on_fail(self, stream_name, payloads, stream_keyid, e):
        print("Append failed!")
        print(e)


async def buffered_append_records(client):
    p = client.new_producer(
        append_callback=AppendCallback(),
        size_trigger=10240,
        time_trigger=0.5,
        retry_count=2,
    )

    for i in range(50):
        await p.append(stream_name, b"some_raw_binary_bytes")
        await p.append(stream_name, {"msg": "hello"})

    await p.wait_and_close()
```

:::

## Write Records with Partition Keys

Partition keys are optional, and if not given, the server will automatically
assign a default key. Records with the same partition key can be guaranteed to
be written orderly in BufferedProducer.

Another important feature of HStreamDB, sharding, uses these partition keys to
decide which shards the record will be allocated to and improve write/read
performance. See [Manage Shards of a Stream](./shards.md) for a more detailed
explanation.

You can easily write records with keys using the following example:

::: code-group

```java
// WriteDataWithKeyExample.java

package docs.code.examples;

import io.hstream.*;
import io.hstream.Record;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.CompletableFuture;

public class WriteDataWithKeyExample {
  public static void main(String[] args) throws Exception {
    // TODO (developers): Replace these variables for your own use cases.
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }

    String streamName = "your_h_records_stream_name";

    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();
    writeHRecordDataWithKey(client, streamName);
    client.close();
  }

  public static void writeHRecordDataWithKey(HStreamClient client, String streamName) {
    // For demonstrations, we would use the following as our partition keys for the records.
    // As the documentations mentioned, if we do not give any partition key, it will get a default
    // key and be mapped to some default shard.
    String key1 = "South";
    String key2 = "North";

    // Create a buffered producer with default BatchSetting and FlowControlSetting.
    BufferedProducer producer = client.newBufferedProducer().stream(streamName).build();

    List<CompletableFuture<String>> recordIds = new ArrayList<>();
    Random random = new Random();

    for (int i = 0; i < 100; i++) {
      double temp = random.nextInt(100) / 10.0 + 15;
      Record record;
      if ((i % 3) == 0) {
        HRecord hRecord = HRecord.newBuilder().put("temperature", temp).put("withKey", 1).build();
        record = Record.newBuilder().hRecord(hRecord).partitionKey(key1).build();
      } else {
        HRecord hRecord = HRecord.newBuilder().put("temperature", temp).put("withKey", 2).build();
        record = Record.newBuilder().hRecord(hRecord).partitionKey(key2).build();
      }

      CompletableFuture<String> recordId = producer.write(record);
      recordIds.add(recordId);
    }
    System.out.println("Wrote message IDs: " + recordIds.stream().map(CompletableFuture::join));
    producer.close();
  }
}

```

```go
// ExampleWriteBatchProducerMultiKey.go

package examples

import (
	"fmt"
	"github.com/hstreamdb/hstreamdb-go/hstream"
	"github.com/hstreamdb/hstreamdb-go/hstream/Record"
	"github.com/hstreamdb/hstreamdb-go/hstream/compression"
	"log"
	"math/rand"
	"sync"
)

func ExampleWriteBatchProducerMultiKey() error {
	client, err := hstream.NewHStreamClient(YourHStreamServiceUrl)
	if err != nil {
		log.Fatalf("Creating client error: %s", err)
	}
	defer client.Close()

	producer, err := client.NewBatchProducer("testStream",
		// optional: set record count and max batch bytes trigger
		hstream.WithBatch(10, 500),
		// optional: set timeout trigger
		hstream.TimeOut(1000),
		// optional: set client compression
		hstream.WithCompression(compression.Zstd),
		// optional: set flow control
		hstream.WithFlowControl(81920000))
	if err != nil {
		log.Fatalf("Creating producer error: %s", err)
	}
	defer producer.Stop()

	keys := []string{"sensor1", "sensor2", "sensor3", "sensor4", "sensor5"}
	rids := sync.Map{}
	wg := sync.WaitGroup{}
	wg.Add(5)

	for _, key := range keys {
		go func(key string) {
			result := make([]hstream.AppendResult, 0, 100)
			for i := 0; i < 100; i++ {
				temp := rand.Intn(100)/10.0 + 15
				rawRecord, _ := Record.NewHStreamHRecord(key, map[string]interface{}{
					key: fmt.Sprintf("temperature=%d", temp),
				})
				r := producer.Append(rawRecord)
				result = append(result, r)
			}
			rids.Store(key, result)
			wg.Done()
		}(key)
	}

	wg.Wait()
	rids.Range(func(key, value interface{}) bool {
		k := key.(string)
		res := value.([]hstream.AppendResult)
		for i := 0; i < 100; i++ {
			resp, err := res[i].Ready()
			if err != nil {
				log.Printf("write error: %s\n", err.Error())
			}
			log.Printf("[key: %s]: record[%d]=%s\n", k, i, resp.String())
		}
		return true
	})

	return nil
}

```

:::
