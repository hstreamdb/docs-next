package examples

import (
	"log"

	"github.com/IBM/sarama"
)

func CreateTopics() {
  brokers := []string{"localhost:9092"}
	config := sarama.NewConfig()
	config.Version = KafkaVersion
	validateOnly := false

	admin, err := sarama.NewClusterAdmin(brokers, config)
	if err != nil {
		log.Fatal(err)
	}
	defer admin.Close()

	topicDetail := &sarama.TopicDetail{
		NumPartitions:     1,
		ReplicationFactor: 1,
	}

	if err = admin.CreateTopic("test-topic", topicDetail, validateOnly); err != nil {
		log.Fatal(err)
	}
}
