package docs.code.examples;

import io.hstream.*;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeoutException;

import static java.util.concurrent.TimeUnit.SECONDS;

public class ReadShardExample {
  public static void main(String[] args) throws Exception {
    String serviceUrl = "hstream://127.0.0.1:6570";
    if (System.getenv("serviceUrl") != null) {
      serviceUrl = System.getenv("serviceUrl");
    }

    String streamName = "your_raw_records_stream_name";
    HStreamClient client = HStreamClient.builder().serviceUrl(serviceUrl).build();
    List<Shard> shards = client.listShards(streamName);
    readShardExample(client, streamName, shards.get(0).getShardId());
    client.close();
  }

  public static void readShardExample(
    HStreamClient client, String streamName, long shardId) {
    StreamShardReaderReceiver receiver =
      records -> {
        System.out.println("read " + records.getRecordId());
        if (records.getRecord().isRawRecord()) {
          System.out.println("read raw record: " + Arrays.toString(records.getRecord().getRawRecord()));
        } else {
          System.out.println("read hrecord: " + records.getRecord().getHRecord().toString());
        }
      };
    // Reader is a Service(ref:
    // https://guava.dev/releases/19.0/api/docs/com/google/common/util/concurrent/Service.html)
    var reader = client.newStreamShardReader()
      // Set streamName
      .streamName(streamName)
      // Set shardId
      .shardId(shardId)
      // Optional: Set start offset, can be EARLIEST, LATEST, some specified timestamp or a RecordId
      .from(new StreamShardOffset(StreamShardOffset.SpecialOffset.EARLIEST))
      // Optional: Set end offset, can be EARLIEST, LATEST, some specified timestamp or a RecordId
      .until(new StreamShardOffset(System.currentTimeMillis()))
      // Optional: Set max number of records to read
      .maxReadBatches(3)
      .receiver(receiver)
      .build();

    // start Consumer as a background service and return
    reader.startAsync().awaitRunning();
    try {
      // sleep 5s for consuming records
      Thread.sleep(5000L);
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
    reader.stopAsync().awaitTerminated();
  }
}
