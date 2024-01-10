package examples

import (
	"context"
	"log"
	"time"

	"github.com/segmentio/kafka-go"
)

func Consume() {
	host := "localhost:9092"

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:     []string{host},
		Topic:       "test-topic",
		GroupID:     "test-group1",
		StartOffset: kafka.FirstOffset,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	readCnt := 0
	for readCnt < totalMesssages {
		m, err := reader.ReadMessage(ctx)
		if err != nil {
			log.Fatal(err)
		}
		readCnt++
		log.Printf("Message received: value = %s, timestamp = %v, topic = %s", string(m.Value), m.Time, m.Topic)
	}
	log.Printf("Read %d messages", readCnt)

	if err := reader.Close(); err != nil {
		log.Fatal("Failed to close reader:", err)
	}
}
