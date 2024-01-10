package examples

import (
	"context"
	"fmt"
	"log"
	"sync"

	"github.com/segmentio/kafka-go"
)

func Produce() {
	host := "localhost:9092"

	wg := &sync.WaitGroup{}
	wg.Add(totalMesssages)
	writer := &kafka.Writer{
		Addr:         kafka.TCP(host),
		Topic:        "test-topic",
		Balancer:     &kafka.RoundRobin{},
		RequiredAcks: kafka.RequireAll,
		Async:        true,
		Completion: func(messages []kafka.Message, err error) {
			if err != nil {
				wg.Done()
				log.Printf("produce err: %s\n", err.Error())
				return
			}

			for _, msg := range messages {
				wg.Done()
				log.Printf("write date to partition %d, offset %d\n", msg.Partition, msg.Offset)
			}
		},
	}

	defer func() {
		if err := writer.Close(); err != nil {
			log.Fatal("Failed to close writer:", err)
		}
	}()

	for i := 0; i < totalMesssages; i++ {
		msg := kafka.Message{
			Key:   []byte(fmt.Sprintf("key-%d", i)),
			Value: []byte(fmt.Sprintf("value-%d", i)),
		}
		if err := writer.WriteMessages(context.Background(), msg); err != nil {
			log.Fatal("Failed to write messages:", err)
		}
	}

	wg.Wait()
	log.Println("Write messages done.")
}
