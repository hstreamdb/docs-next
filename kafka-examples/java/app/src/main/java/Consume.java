import java.time.Duration;
import java.util.Collections;
import java.util.Properties;
import org.apache.kafka.clients.consumer.KafkaConsumer;

class Consume {
  public static void main(String[] args) throws Exception {
    String endpoint = "localhost:9092";
    String topicName = "my_topic";
    String groupName = "my_group";

    var props = new Properties();
    props.put("bootstrap.servers", endpoint);
    props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
    props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
    props.put("auto.offset.reset", "earliest");
    props.put("group.id", groupName);

    try (var consumer = new KafkaConsumer<String, String>(props)) {
      consumer.subscribe(Collections.singleton(topicName));
      var records = consumer.poll(Duration.ofSeconds(10));
      for (var record : records) {
        System.out.println(record);
      }
    }
  }
}
