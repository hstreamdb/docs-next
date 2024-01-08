import java.util.Properties;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

class Produce {
  public static void main(String[] args) throws Exception {
    String endpoint = "localhost:9092";
    String topicName = "my_topic";

    var props = new Properties();
    props.put("bootstrap.servers", endpoint);
    props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
    props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

    try (var producer = new KafkaProducer<String, String>(props)) {
      producer.send(new ProducerRecord<>(topicName, "Hello HStream!"));
      producer.flush();
    }
  }
}
