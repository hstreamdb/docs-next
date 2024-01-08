import java.util.Collections;
import java.util.Properties;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.NewTopic;

class CreateTopic {
  public static void main(String[] args) throws Exception {
    String endpoint = "localhost:9092";
    String topicName = "my_topic";
    int partitions = 1;
    short replicationFactor = 1;

    var props = new Properties();
    props.put("bootstrap.servers", endpoint);

    try (var admin = AdminClient.create(props)) {
      admin
          .createTopics(
              Collections.singleton(new NewTopic(topicName, partitions, replicationFactor)))
          .all()
          .get();
    }
  }
}
