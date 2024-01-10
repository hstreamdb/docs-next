package examples

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/segmentio/kafka-go"
)

func CreateTopics() {
	host := "localhost:9092"
	client := &kafka.Client{
		Addr:    kafka.TCP(host),
		Timeout: 10 * time.Second,
	}

	request := &kafka.CreateTopicsRequest{
		Topics: []kafka.TopicConfig{
			{
				Topic:             "test-topic",
				NumPartitions:     1,
				ReplicationFactor: 1,
			},
		},
		ValidateOnly: false,
	}

	resp, err := client.CreateTopics(context.Background(), request)
	if err != nil {
		log.Fatal(err)
	}

	for _, err = range resp.Errors {
		if err != nil && !errors.Is(err, kafka.TopicAlreadyExists) {
			log.Fatal(err)
		}
	}
}
